package com.screencapture.repository;

import com.screencapture.model.UserDriveConnection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDriveConnectionRepository extends JpaRepository<UserDriveConnection, Long> {
    Optional<UserDriveConnection> findByUserId(Long userId);
}
