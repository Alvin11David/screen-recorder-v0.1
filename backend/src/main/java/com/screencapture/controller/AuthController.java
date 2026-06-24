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
        return ResponseEntity.ok(java.util.Map.of("message", "If that email is registered, a code has been sent."));
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<?> verifyResetCode(@Valid @RequestBody VerifyResetCodeRequest req) {
        try {
            authService.verifyResetCode(req);
            return ResponseEntity.ok(java.util.Map.of("message", "Code verified"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        try {
            authService.resetPassword(req);
            return ResponseEntity.ok(java.util.Map.of("message", "Password has been reset"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}
