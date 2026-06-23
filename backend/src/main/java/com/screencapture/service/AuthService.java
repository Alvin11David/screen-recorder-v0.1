package com.screencapture.service;

import com.screencapture.dto.*;
import com.screencapture.model.User;
import com.screencapture.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        var user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getAvatar());
    }

    public AuthResponse login(LoginRequest req) {
        var user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getAvatar());
    }

    public AuthResponse handleGitHubCallback(String code) {
        Map<String, String> tokenData = exchangeGitHubCode(code);
        String accessToken = tokenData.get("access_token");

        Map<String, Object> userData = fetchGitHubUser(accessToken);

        String githubId = userData.get("id").toString();
        String login = (String) userData.get("login");
        String name = (String) userData.get("name");
        String avatarUrl = (String) userData.get("avatar_url");
        String email = (String) userData.get("email");

        if (name == null || name.isBlank()) name = login;

        if (email == null || email.isBlank()) {
            email = fetchPrimaryGitHubEmail(accessToken);
        }

        if (email == null || email.isBlank()) {
            email = login + "@github.com";
        }

        String finalEmail = email;
        var user = userRepository.findByEmail(finalEmail).orElseGet(() -> {
            var newUser = new User();
            newUser.setName(name);
            newUser.setEmail(finalEmail);
            newUser.setPassword(passwordEncoder.encode(githubId));
            newUser.setAvatar(avatarUrl);
            newUser.setGithubUsername(login);
            return userRepository.save(newUser);
        });

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getAvatar());
    }

    public void sendResetLink(ForgotPasswordRequest req) {
        if (!userRepository.existsByEmail(req.getEmail())) return;
        // In production, send an email with a reset link.
        // For now, this is a no-op — the frontend will show a success message.
    }

    @SuppressWarnings("unchecked")
    private Map<String, String> exchangeGitHubCode(String code) {
        try {
            var body = new java.util.LinkedHashMap<String, Object>();
            body.put("client_id", System.getenv("GITHUB_CLIENT_ID"));
            body.put("client_secret", System.getenv("GITHUB_CLIENT_SECRET"));
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
