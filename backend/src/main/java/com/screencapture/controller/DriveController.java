package com.screencapture.controller;

import com.screencapture.dto.DriveCallbackRequest;
import com.screencapture.dto.DriveConnectionResponse;
import com.screencapture.dto.ErrorResponse;
import com.screencapture.model.User;
import com.screencapture.model.UserDriveConnection;
import com.screencapture.repository.UserRepository;
import com.screencapture.service.GoogleDriveService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/drive")
public class DriveController {

    private static final Logger log = LoggerFactory.getLogger(DriveController.class);

    private final GoogleDriveService googleDriveService;
    private final UserRepository userRepository;

    public DriveController(GoogleDriveService googleDriveService, UserRepository userRepository) {
        this.googleDriveService = googleDriveService;
        this.userRepository = userRepository;
    }

    @PostMapping("/connect")
    public ResponseEntity<?> connect(@Valid @RequestBody DriveCallbackRequest req, Authentication authentication) {
        log.info("[drive] connect: user={} codePresent={} redirectUri={}",
                authName(authentication), req.getCode() != null && !req.getCode().isBlank(), req.getRedirectUri());
        try {
            User user = currentUser(authentication);
            UserDriveConnection connection = googleDriveService.connect(user, req.getCode(), req.getRedirectUri());
            long expiresIn = Math.max(0, Duration.between(Instant.now(), connection.getTokenExpiresAt()).toSeconds());
            String accessToken = googleDriveService.accessTokenForUser(user);
            log.info("[drive] connect OK: user={} email={} expiresIn={}s", user.getEmail(), connection.getDriveEmail(), expiresIn);
            return ResponseEntity.ok(new DriveConnectionResponse(
                    connection.getDriveEmail(), accessToken, expiresIn));
        } catch (IllegalArgumentException e) {
            log.warn("[drive] connect rejected: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("[drive] connect error: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/access-token")
    public ResponseEntity<?> accessToken(Authentication authentication) {
        String name = authName(authentication);
        try {
            String accessToken = googleDriveService.accessTokenForUser(currentUser(authentication));
            log.info("[drive] access-token: user={} issued", name);
            return ResponseEntity.ok(Map.of("accessToken", accessToken));
        } catch (IllegalArgumentException e) {
            log.warn("[drive] access-token rejected: user={} {}", name, e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("[drive] access-token error: user={} {}", name, e.getMessage(), e);
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/connection")
    public ResponseEntity<?> disconnect(Authentication authentication) {
        String name = authName(authentication);
        try {
            googleDriveService.disconnect(currentUser(authentication));
            log.info("[drive] disconnect: user={}", name);
            return ResponseEntity.ok(Map.of("message", "Google Drive disconnected"));
        } catch (IllegalArgumentException e) {
            log.warn("[drive] disconnect rejected: user={} {}", name, e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    private String authName(Authentication authentication) {
        return authentication == null || !authentication.isAuthenticated() ? "anonymous" : authentication.getName();
    }

    private User currentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("Unauthorized");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Unauthorized"));
    }
}
