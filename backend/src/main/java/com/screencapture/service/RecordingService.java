package com.screencapture.service;

import com.screencapture.dto.RecordingRequest;
import com.screencapture.dto.RecordingResponse;
import com.screencapture.model.Recording;
import com.screencapture.model.User;
import com.screencapture.repository.RecordingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecordingService {

    private static final Logger log = LoggerFactory.getLogger(RecordingService.class);

    private final RecordingRepository recordingRepository;
    private final GoogleDriveService googleDriveService;

    public RecordingService(RecordingRepository recordingRepository, GoogleDriveService googleDriveService) {
        this.recordingRepository = recordingRepository;
        this.googleDriveService = googleDriveService;
    }

    @Transactional(readOnly = true)
    public List<RecordingResponse> listForUser(User user) {
        return recordingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public RecordingResponse create(User user, RecordingRequest req) {
        var recording = new Recording();
        recording.setUserId(user.getId());
        recording.setDriveFileId(req.getDriveFileId());
        recording.setDriveUrl(req.getDriveUrl());
        recording.setDurationSeconds(req.getDurationSeconds());
        recording.setWidth(req.getWidth());
        recording.setHeight(req.getHeight());
        recording.setSizeBytes(req.getSizeBytes());
        recording.setMimeType(req.getMimeType());
        recording.setFileName(req.getFileName());
        return toResponse(recordingRepository.save(recording));
    }

    @Transactional
    public RecordingResponse rename(User user, long id, String fileName) {
        var recording = recordingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recording not found"));
        if (!recording.getUserId().equals(user.getId())) {
            throw new IllegalArgumentException("Recording not found");
        }
        if (fileName == null || fileName.isBlank()) {
            throw new IllegalArgumentException("File name is required");
        }
        if (recording.getDriveFileId() != null && !recording.getDriveFileId().isBlank()) {
            googleDriveService.renameFile(user, recording.getDriveFileId(), fileName);
        }
        recording.setFileName(fileName);
        return toResponse(recordingRepository.save(recording));
    }

    @Transactional
    public void delete(User user, long id) {
        var recording = recordingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Recording not found"));
        if (!recording.getUserId().equals(user.getId())) {
            throw new IllegalArgumentException("Recording not found");
        }
        try {
            googleDriveService.deleteFile(user, recording.getDriveFileId());
        } catch (Exception e) {
            log.warn("Could not delete Drive file {} for recording {}; removing row anyway", recording.getDriveFileId(), id);
        }
        recordingRepository.delete(recording);
    }

    private RecordingResponse toResponse(Recording r) {
        return new RecordingResponse(r.getId(), r.getDriveFileId(), r.getDriveUrl(),
                r.getDurationSeconds(), r.getWidth(), r.getHeight(), r.getSizeBytes(),
                r.getMimeType(), r.getCreatedAt());
    }
}
