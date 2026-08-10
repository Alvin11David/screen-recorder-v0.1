package com.screencapture.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.screencapture.model.User;
import com.screencapture.model.UserDriveConnection;
import com.screencapture.repository.UserDriveConnectionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class GoogleDriveService {

    private static final int OAUTH_TIMEOUT_MS = 8_000;
    private static final String TOKEN_URI = "https://oauth2.googleapis.com/token";
    private static final String USERINFO_URI = "https://www.googleapis.com/oauth2/v3/userinfo";
    private static final String DRIVE_FILES_URI = "https://www.googleapis.com/drive/v3/files";
    private static final String REVOKE_URI = "https://oauth2.googleapis.com/revoke";
    private static final Logger log = LoggerFactory.getLogger(GoogleDriveService.class);

    private final UserDriveConnectionRepository connectionRepository;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final SecretKeySpec tokenKey;

    @Value("${app.google.client-id:${GOOGLE_CLIENT_ID:}}")
    private String googleClientId;

    @Value("${app.google.client-secret:${GOOGLE_CLIENT_SECRET:}}")
    private String googleClientSecret;

    public GoogleDriveService(UserDriveConnectionRepository connectionRepository,
                              ObjectMapper objectMapper,
                              HttpClient httpClient,
                              @Value("${app.drive.token-key:${app.jwt.secret:}}") String tokenKey) {
        this.connectionRepository = connectionRepository;
        this.objectMapper = objectMapper;
        this.httpClient = httpClient;
        this.tokenKey = deriveKey(tokenKey == null || tokenKey.isBlank() ? "screencapture-drive-key" : tokenKey);
    }

    public record DriveTokens(String accessToken, String refreshToken, long expiresIn) {}

    public boolean isConfigured() {
        return googleClientId != null && !googleClientId.isBlank()
                && googleClientSecret != null && !googleClientSecret.isBlank();
    }

    public DriveTokens exchangeCode(String code, String redirectUri) {
        if (!isConfigured()) {
            throw new IllegalStateException(
                    "Google OAuth is not configured on the backend (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET)");
        }
        var body = new LinkedHashMap<String, Object>();
        body.put("client_id", googleClientId);
        body.put("client_secret", googleClientSecret);
        body.put("code", code);
        body.put("grant_type", "authorization_code");
        body.put("redirect_uri", redirectUri);

        Map<String, String> response = postForm(TOKEN_URI, body);
        String accessToken = response.get("access_token");
        String refreshToken = response.get("refresh_token");
        if (accessToken == null || accessToken.isBlank()) {
            throw new IllegalArgumentException("Failed to connect Google Drive: no access token returned");
        }
        long expiresIn = parseLong(response.get("expires_in"), 3600);
        return new DriveTokens(accessToken, refreshToken, expiresIn);
    }

    @Transactional
    public UserDriveConnection connect(User user, String code, String redirectUri) {
        DriveTokens tokens = exchangeCode(code, redirectUri);
        String driveEmail = fetchDriveEmail(tokens.accessToken());
        log.info("[drive] exchanged code for user={} refreshToken={} expiresIn={}s",
                user.getEmail(), tokens.refreshToken() != null && !tokens.refreshToken().isBlank(), tokens.expiresIn());

        var connection = connectionRepository.findByUserId(user.getId()).orElseGet(() -> {
            var c = new UserDriveConnection();
            c.setUserId(user.getId());
            c.setProvider("google");
            return c;
        });
        if (tokens.refreshToken() != null && !tokens.refreshToken().isBlank()) {
            connection.setRefreshToken(encrypt(tokens.refreshToken()));
        }
        connection.setAccessToken(encrypt(tokens.accessToken()));
        connection.setTokenExpiresAt(Instant.now().plusSeconds(tokens.expiresIn()));
        connection.setDriveEmail(driveEmail);
        log.info("[drive] saved connection for user={} driveEmail={}", user.getEmail(), driveEmail);
        return connectionRepository.save(connection);
    }

    public String fetchDriveEmail(String accessToken) {
        try {
            var request = HttpRequest.newBuilder()
                    .uri(URI.create(USERINFO_URI))
                    .timeout(Duration.ofMillis(OAUTH_TIMEOUT_MS))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/json")
                    .GET()
                    .build();
            @SuppressWarnings("unchecked")
            var data = objectMapper.readValue(send(request), Map.class);
            String email = (String) data.get("email");
            return email == null ? "" : email;
        } catch (Exception e) {
            log.warn("Failed to fetch Google email for Drive connection", e);
            return "";
        }
    }

    @Transactional
    public String accessTokenForUser(User user) {
        var connection = connectionRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Google Drive is not connected"));

        String stored = connection.getAccessToken();
        Instant expiresAt = connection.getTokenExpiresAt();
        if (stored != null && expiresAt != null && expiresAt.isAfter(Instant.now().plusSeconds(120))) {
            log.info("[drive] access-token served from cache for user={}", user.getEmail());
            return decrypt(stored);
        }
        if (connection.getRefreshToken() == null || connection.getRefreshToken().isBlank()) {
            log.warn("[drive] connection expired without refresh token for user={}", user.getEmail());
            throw new IllegalArgumentException("Google Drive connection is expired — please reconnect");
        }

        log.info("[drive] refreshing access token for user={}", user.getEmail());
        var body = new LinkedHashMap<String, Object>();
        body.put("client_id", googleClientId);
        body.put("client_secret", googleClientSecret);
        body.put("grant_type", "refresh_token");
        body.put("refresh_token", decrypt(connection.getRefreshToken()));

        Map<String, String> response = postForm(TOKEN_URI, body);
        String accessToken = response.get("access_token");
        if (accessToken == null || accessToken.isBlank()) {
            throw new IllegalArgumentException("Failed to refresh Google Drive access — please reconnect");
        }
        long expiresIn = parseLong(response.get("expires_in"), 3600);
        connection.setAccessToken(encrypt(accessToken));
        connection.setTokenExpiresAt(Instant.now().plusSeconds(expiresIn));
        connectionRepository.save(connection);
        log.info("[drive] access token refreshed for user={} expiresIn={}s", user.getEmail(), expiresIn);
        return accessToken;
    }

    public void deleteFile(User user, String fileId) {
        if (fileId == null || fileId.isBlank()) return;
        String accessToken = accessTokenForUser(user);
        try {
            var request = HttpRequest.newBuilder()
                    .uri(URI.create(DRIVE_FILES_URI + "/" + urlEncode(fileId)))
                    .timeout(Duration.ofMillis(OAUTH_TIMEOUT_MS))
                    .header("Authorization", "Bearer " + accessToken)
                    .DELETE()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 404) {
                log.info("[drive] delete file {} already gone", fileId);
                return;
            }
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.warn("Failed to delete Drive file {}: HTTP {}", fileId, response.statusCode());
                throw new IllegalStateException("Failed to delete file from Google Drive");
            }
            log.info("[drive] deleted file {} for user={}", fileId, user.getEmail());
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.warn("Failed to delete Drive file {}", fileId, e);
            throw new IllegalStateException("Failed to delete file from Google Drive");
        }
    }

    @Transactional
    public void disconnect(User user) {
        connectionRepository.findByUserId(user.getId()).ifPresent(connection -> {
            if (connection.getRefreshToken() != null && !connection.getRefreshToken().isBlank()) {
                revokeToken(decrypt(connection.getRefreshToken()));
            }
            connectionRepository.delete(connection);
        });
    }

    private void revokeToken(String token) {
        try {
            var request = HttpRequest.newBuilder()
                    .uri(URI.create(REVOKE_URI))
                    .timeout(Duration.ofMillis(OAUTH_TIMEOUT_MS))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString("token=" + urlEncode(token)))
                    .build();
            httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (Exception e) {
            log.warn("Failed to revoke Google Drive token", e);
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, String> postForm(String uri, Map<String, Object> params) {
        try {
            var request = HttpRequest.newBuilder()
                    .uri(URI.create(uri))
                    .timeout(Duration.ofMillis(OAUTH_TIMEOUT_MS))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(toFormBody(params)))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.error("Google Drive OAuth call failed: HTTP {} body={}", response.statusCode(), response.body());
                throw new IllegalArgumentException("Google Drive authorization failed");
            }
            return objectMapper.readValue(response.body(), Map.class);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to reach Google authorization server", e);
        }
    }

    private String send(HttpRequest request) throws Exception {
        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException("Google API returned HTTP " + response.statusCode());
        }
        return response.body();
    }

    private String toFormBody(Map<String, Object> params) {
        var encoded = new StringBuilder();
        for (var entry : params.entrySet()) {
            if (encoded.length() > 0) encoded.append('&');
            encoded.append(urlEncode(entry.getKey()))
                    .append('=')
                    .append(urlEncode(String.valueOf(entry.getValue())));
        }
        return encoded.toString();
    }

    private static String urlEncode(String value) {
        return java.net.URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private static long parseLong(Object value, long fallback) {
        if (value == null) return fallback;
        try {
            return Long.parseLong(String.valueOf(value));
        } catch (NumberFormatException e) {
            return fallback;
        }
    }

    private static SecretKeySpec deriveKey(String seed) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(seed.getBytes(StandardCharsets.UTF_8));
            return new SecretKeySpec(digest, "AES");
        } catch (Exception e) {
            throw new IllegalStateException("Failed to derive encryption key", e);
        }
    }

    private String encrypt(String plaintext) {
        try {
            byte[] iv = new byte[12];
            new SecureRandom().nextBytes(iv);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, tokenKey, new GCMParameterSpec(128, iv));
            byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));
            byte[] combined = new byte[iv.length + ciphertext.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(ciphertext, 0, combined, iv.length, ciphertext.length);
            return Base64.getEncoder().encodeToString(combined);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to encrypt token", e);
        }
    }

    private String decrypt(String encoded) {
        try {
            byte[] combined = Base64.getDecoder().decode(encoded);
            byte[] iv = Arrays.copyOfRange(combined, 0, 12);
            byte[] ciphertext = Arrays.copyOfRange(combined, 12, combined.length);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.DECRYPT_MODE, tokenKey, new GCMParameterSpec(128, iv));
            return new String(cipher.doFinal(ciphertext), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to decrypt token", e);
        }
    }
}
