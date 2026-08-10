package com.screencapture.controller;

import com.screencapture.dto.DriveCallbackRequest;
import com.screencapture.dto.DriveConnectionResponse;
import com.screencapture.dto.ErrorResponse;
import com.screencapture.model.User;
import com.screencapture.model.UserDriveConnection;
import com.screencapture.repository.UserRepository;
import com.screencapture.service.GoogleDriveService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/drive")
public class DriveController {

    private final GoogleDriveService googleDriveService;
    private final UserRepository userRepository;

    public DriveController(GoogleDriveService googleDriveService, UserRepository userRepository) {
        this.googleDriveService = googleDriveService;
        this.userRepository = userRepository;
    }

    @PostMapping("/connect")
    public ResponseEntity<?> connect(@Valid @RequestBody DriveCallbackRequest req, Authentication authentication) {
        try {
            UserDriveConnection connection = googleDriveService.connect(currentUser(authentication), req.getCode(), req.getRedirectUri());
            long expiresIn = Math.max(0, Duration.between(Instant.now(), connection.getTokenExpiresAt()).toSeconds());
            return ResponseEntity.ok(new DriveConnectionResponse(
                    connection.getDriveEmail(), googleDriveService.accessTokenForUser(currentUser(authentication)), expiresIn));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/access-token")
    public ResponseEntity<?> accessToken(Authentication authentication) {
        try {
            String accessToken = googleDriveService.accessTokenForUser(currentUser(authentication));
            return ResponseEntity.ok(Map.of("accessToken", accessToken));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/connection")
    public ResponseEntity<?> disconnect(Authentication authentication) {
        try {
            googleDriveService.disconnect(currentUser(authentication));
            return ResponseEntity.ok(Map.of("message", "Google Drive disconnected"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    private User currentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("Unauthorized");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Unauthorized"));
    }
}
