package com.screencapture.dto;

import java.time.Instant;

public class RecordingResponse {

    private long id;
    private String driveFileId;
    private String driveUrl;
    private double durationSeconds;
    private int width;
    private int height;
    private long sizeBytes;
    private String mimeType;
    private Instant createdAt;

    public RecordingResponse() {}

    public RecordingResponse(long id, String driveFileId, String driveUrl, double durationSeconds,
                             int width, int height, long sizeBytes, String mimeType, Instant createdAt) {
        this.id = id;
        this.driveFileId = driveFileId;
        this.driveUrl = driveUrl;
        this.durationSeconds = durationSeconds;
        this.width = width;
        this.height = height;
        this.sizeBytes = sizeBytes;
        this.mimeType = mimeType;
        this.createdAt = createdAt;
    }

    public long getId() { return id; }
    public String getDriveFileId() { return driveFileId; }
    public String getDriveUrl() { return driveUrl; }
    public double getDurationSeconds() { return durationSeconds; }
    public int getWidth() { return width; }
    public int getHeight() { return height; }
    public long getSizeBytes() { return sizeBytes; }
    public String getMimeType() { return mimeType; }
    public Instant getCreatedAt() { return createdAt; }
}
