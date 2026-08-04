package com.screencapture.service;

import com.screencapture.dto.*;
import com.screencapture.model.User;
import com.screencapture.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetService passwordResetService;

    @Value("${app.github.client-id:${GITHUB_CLIENT_ID:}}")
    private String githubClientId;

    @Value("${app.github.client-secret:${GITHUB_CLIENT_SECRET:}}")
    private String githubClientSecret;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, PasswordResetService passwordResetService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.passwordResetService = passwordResetService;
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
        if (!userRepository.existsByEmail(email)) return;
        passwordResetService.generateAndStoreCode(email);
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

            var request = java.net.HttpURLConnection.class.cast(
                    new java.net.URL("https://github.com/login/oauth/access_token").openConnection()
            );
            request.setRequestMethod("POST");
            request.setRequestProperty("Content-Type", "application/json");
            request.setRequestProperty("Accept", "application/json");
            request.setDoOutput(true);
            try (var os = request.getOutputStream()) {
                os.write(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsBytes(body));
            }

            try (var is = request.getInputStream()) {
                return new com.fasterxml.jackson.databind.ObjectMapper().readValue(is, Map.class);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to exchange GitHub code", e);
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> fetchGitHubUser(String accessToken) {
        try {
            var request = java.net.HttpURLConnection.class.cast(
                    new java.net.URL("https://api.github.com/user").openConnection()
            );
            request.setRequestProperty("Authorization", "Bearer " + accessToken);
            request.setRequestProperty("Accept", "application/json");
            try (var is = request.getInputStream()) {
                return new com.fasterxml.jackson.databind.ObjectMapper().readValue(is, Map.class);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch GitHub user", e);
        }
    }

    private String fetchPrimaryGitHubEmail(String accessToken) {
        try {
            var request = java.net.HttpURLConnection.class.cast(
                    new java.net.URL("https://api.github.com/user/emails").openConnection()
            );
            request.setRequestProperty("Authorization", "Bearer " + accessToken);
            request.setRequestProperty("Accept", "application/json");
            try (var is = request.getInputStream()) {
                var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                var emails = mapper.readValue(is, java.util.List.class);
                for (var item : emails) {
                    var email = (Map<String, Object>) item;
                    if (Boolean.TRUE.equals(email.get("primary"))) {
                        return (String) email.get("email");
                    }
                }
                if (!emails.isEmpty()) {
                    return (String) ((Map<String, Object>) emails.get(0)).get("email");
                }
            }
        } catch (Exception e) {
            // fall through
        }
        return null;
    }
}
