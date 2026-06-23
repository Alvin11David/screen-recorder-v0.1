package com.screencapture.controller;

import com.screencapture.dto.*;
import com.screencapture.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            return ResponseEntity.ok(authService.register(req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            return ResponseEntity.ok(authService.login(req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/github/callback")
    public ResponseEntity<?> githubCallback(@Valid @RequestBody GitHubCallbackRequest req) {
        try {
            return ResponseEntity.ok(authService.handleGitHubCallback(req.getCode()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.sendResetLink(req);
        return ResponseEntity.ok(new java.util.Map.Entry<>("message", "If that email is registered, a reset link has been sent.") {
            private final String key = "message";
            private final String value = "If that email is registered, a reset link has been sent.";
            @Override
            public String getKey() { return key; }
            @Override
            public String getValue() { return value; }
        });
    }
}
