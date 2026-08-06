package com.screencapture.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.screencapture.dto.*;
import com.screencapture.model.User;
import com.screencapture.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Locale;
import java.util.Map;

@Service
public class AuthService {

    private static final int OAUTH_TIMEOUT_MS = 5_000;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetService passwordResetService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${app.github.client-id:${GITHUB_CLIENT_ID:}}")
    private String githubClientId;

    @Value("${app.github.client-secret:${GITHUB_CLIENT_SECRET:}}")
    private String githubClientSecret;

    @Value("${app.google.client-id:${GOOGLE_CLIENT_ID:}}")
    private String googleClientId;

    @Value("${app.google.client-secret:${GOOGLE_CLIENT_SECRET:}}")
    private String googleClientSecret;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
                       PasswordResetService passwordResetService, ObjectMapper objectMapper, HttpClient httpClient) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.passwordResetService = passwordResetService;
        this.objectMapper = objectMapper;
        this.httpClient = httpClient;
    }

    public AuthResponse register(RegisterRequest req) {
        String email = normalizeEmail(req.getEmail());
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        var user = new User();
        user.setName(req.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(req.getPassword()));

        user = userRepository.save(user);

        String token = jwtService.generateToken(email);
        return new AuthResponse(token, email, user.getName(), user.getAvatar());
    }

    public AuthResponse login(LoginRequest req) {
        String email = normalizeEmail(req.getEmail());
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtService.generateToken(email);
        return new AuthResponse(token, email, user.getName(), user.getAvatar());
    }

    public AuthResponse handleGitHubCallback(String code) {
        Map<String, String> tokenData = exchangeGitHubCode(code);
        String accessToken = tokenData.get("access_token");
        if (accessToken == null || accessToken.isBlank()) {
            throw new IllegalArgumentException("GitHub authentication failed");
        }

        Map<String, Object> userData = fetchGitHubUser(accessToken);

        Object idValue = userData.get("id");
        String githubId = idValue == null ? null : idValue.toString();
        if (githubId == null || githubId.isBlank()) {
            throw new IllegalArgumentException("GitHub authentication failed");
        }

        String login = (String) userData.get("login");
        String githubLogin = (login == null || login.isBlank()) ? "github" : login;
        String rawName = (String) userData.get("name");
        String avatarUrl = (String) userData.get("avatar_url");
        String rawEmail = (String) userData.get("email");

        String resolvedName = (rawName == null || rawName.isBlank()) ? githubLogin : rawName;

        if (rawEmail == null || rawEmail.isBlank()) {
            rawEmail = fetchPrimaryGitHubEmail(accessToken);
        }

        String email = (rawEmail == null || rawEmail.isBlank()) ? githubLogin + "@github.com" : rawEmail;
        String normalizedEmail = normalizeEmail(email);

        var user = userRepository.findByEmail(normalizedEmail).orElseGet(() -> {
            var newUser = new User();
            newUser.setName(resolvedName);
            newUser.setEmail(normalizedEmail);
            newUser.setPassword(passwordEncoder.encode(githubId));
            newUser.setAvatar(avatarUrl);
            newUser.setGithubUsername(githubLogin);
            return userRepository.save(newUser);
        });

        user.setAvatar(avatarUrl);
        user.setGithubUsername(githubLogin);
        if (resolvedName != null && !resolvedName.isBlank()) {
            user.setName(resolvedName);
        }
        userRepository.save(user);

        String token = jwtService.generateToken(normalizedEmail);
        return new AuthResponse(token, normalizedEmail, user.getName(), user.getAvatar());
    }

    public void sendResetLink(ForgotPasswordRequest req) {
        String email = normalizeEmail(req.getEmail());
        // The throttle runs before the existence check so registered and unregistered
        // addresses consume send slots identically — the endpoint cannot enumerate users.
        if (!passwordResetService.tryAcquireSend(email)) return;
        if (!userRepository.existsByEmail(email)) return;
        passwordResetService.issueCode(email);
    }

    public void verifyResetCode(VerifyResetCodeRequest req) {
        if (!passwordResetService.verifyCode(normalizeEmail(req.getEmail()), req.getCode())) {
            throw new IllegalArgumentException("Invalid or expired code");
        }
    }

    public void resetPassword(ResetPasswordRequest req) {
        String email = normalizeEmail(req.getEmail());
        if (!passwordResetService.verifyCode(email, req.getCode())) {
            throw new IllegalArgumentException("Invalid or expired code");
        }
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        passwordResetService.consumeCode(email);
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    @SuppressWarnings("unchecked")
    private Map<String, String> exchangeGitHubCode(String code) {
        try {
            if (githubClientId == null || githubClientId.isBlank()
                    || githubClientSecret == null || githubClientSecret.isBlank()) {
                throw new IllegalStateException("GitHub OAuth credentials are not configured");
            }

            var body = new java.util.LinkedHashMap<String, Object>();
            body.put("client_id", githubClientId);
            body.put("client_secret", githubClientSecret);
            body.put("code", code);

            var request = HttpRequest.newBuilder()
                    .uri(URI.create("https://github.com/login/oauth/access_token"))
                    .timeout(Duration.ofMillis(OAUTH_TIMEOUT_MS))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                    .build();

            return objectMapper.readValue(send(request), Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to exchange GitHub code", e);
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> fetchGitHubUser(String accessToken) {
        try {
            var request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.github.com/user"))
                    .timeout(Duration.ofMillis(OAUTH_TIMEOUT_MS))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/json")
                    .header("User-Agent", "ScreenFlow-Backend")
                    .GET()
                    .build();

            return objectMapper.readValue(send(request), Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch GitHub user", e);
        }
    }

    private String fetchPrimaryGitHubEmail(String accessToken) {
        try {
            var request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.github.com/user/emails"))
                    .timeout(Duration.ofMillis(OAUTH_TIMEOUT_MS))
                    .header("Authorization", "Bearer " + accessToken)
                    .header("Accept", "application/json")
                    .header("User-Agent", "ScreenFlow-Backend")
                    .GET()
                    .build();

            var emails = objectMapper.readValue(send(request), java.util.List.class);
            for (var item : emails) {
                var email = (Map<String, Object>) item;
                if (Boolean.TRUE.equals(email.get("primary"))) {
                    return (String) email.get("email");
                }
            }
            if (!emails.isEmpty()) {
                return (String) ((Map<String, Object>) emails.get(0)).get("email");
            }
        } catch (Exception e) {
            // fall through
        }
        return null;
    }

    private String send(HttpRequest request) throws Exception {
        var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IllegalStateException("GitHub API returned HTTP " + response.statusCode());
        }
        return response.body();
    }
}
