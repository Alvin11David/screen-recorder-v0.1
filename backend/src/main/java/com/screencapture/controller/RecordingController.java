package com.screencapture.controller;

import com.screencapture.dto.ErrorResponse;
import com.screencapture.dto.RecordingRequest;
import com.screencapture.model.User;
import com.screencapture.repository.UserRepository;
import com.screencapture.service.RecordingService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PatchMapping;

@RestController
@RequestMapping("/api/recordings")
public class RecordingController {

    private static final Logger log = LoggerFactory.getLogger(RecordingController.class);

    private final RecordingService recordingService;
    private final UserRepository userRepository;

    public RecordingController(RecordingService recordingService, UserRepository userRepository) {
        this.recordingService = recordingService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> list(Authentication authentication) {
        try {
            var entries = recordingService.listForUser(currentUser(authentication));
            log.info("[recordings] list: user={} count={}", authName(authentication), entries.size());
            return ResponseEntity.ok(entries);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody RecordingRequest req, Authentication authentication) {
        try {
            var entry = recordingService.create(currentUser(authentication), req);
            log.info("[recordings] create: user={} id={} file={} size={}",
                    authName(authentication), entry.getId(), req.getDriveFileId(), req.getSizeBytes());
            return ResponseEntity.ok(entry);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> rename(@PathVariable long id,
                                    @RequestBody RenameRecordingRequest req,
                                    Authentication authentication) {
        try {
            var entry = recordingService.rename(currentUser(authentication), id, req.getFileName());
            log.info("[recordings] rename: user={} id={} -> {}",
                    authName(authentication), id, req.getFileName());
            return ResponseEntity.ok(entry);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable long id, Authentication authentication) {
        try {
            recordingService.delete(currentUser(authentication), id);
            log.info("[recordings] delete: user={} id={}", authName(authentication), id);
            return ResponseEntity.ok(java.util.Map.of("message", "Recording deleted"));
        } catch (IllegalArgumentException e) {
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
