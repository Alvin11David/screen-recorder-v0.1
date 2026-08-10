package com.screencapture.controller;

import com.screencapture.dto.ErrorResponse;
import com.screencapture.dto.RecordingRequest;
import com.screencapture.model.User;
import com.screencapture.repository.UserRepository;
import com.screencapture.service.RecordingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recordings")
public class RecordingController {

    private final RecordingService recordingService;
    private final UserRepository userRepository;

    public RecordingController(RecordingService recordingService, UserRepository userRepository) {
        this.recordingService = recordingService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> list(Authentication authentication) {
        try {
            return ResponseEntity.ok(recordingService.listForUser(currentUser(authentication)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody RecordingRequest req, Authentication authentication) {
        try {
            return ResponseEntity.ok(recordingService.create(currentUser(authentication), req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable long id, Authentication authentication) {
        try {
            recordingService.delete(currentUser(authentication), id);
            return ResponseEntity.ok(java.util.Map.of("message", "Recording deleted"));
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
