package com.screencapture.repository;

import com.screencapture.model.Recording;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecordingRepository extends JpaRepository<Recording, Long> {
    List<Recording> findByUserIdOrderByCreatedAtDesc(Long userId);
}
