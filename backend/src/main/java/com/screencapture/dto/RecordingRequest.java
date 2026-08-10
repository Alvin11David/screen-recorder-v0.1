package com.screencapture.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class RecordingRequest {

    @NotBlank(message = "Drive file id is required")
    private String driveFileId;

    @NotBlank(message = "Drive URL is required")
    private String driveUrl;

    @Min(value = 0, message = "Duration must not be negative")
    private double durationSeconds;

    @Min(value = 1, message = "Width must be positive")
    private int width;

    @Min(value = 1, message = "Height must be positive")
    private int height;

    @Min(value = 1, message = "Size must be positive")
    private long sizeBytes;

    @NotBlank(message = "MIME type is required")
    private String mimeType;

    public String getDriveFileId() { return driveFileId; }
    public void setDriveFileId(String driveFileId) { this.driveFileId = driveFileId; }
    public String getDriveUrl() { return driveUrl; }
    public void setDriveUrl(String driveUrl) { this.driveUrl = driveUrl; }
    public double getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(double durationSeconds) { this.durationSeconds = durationSeconds; }
    public int getWidth() { return width; }
    public void setWidth(int width) { this.width = width; }
    public int getHeight() { return height; }
    public void setHeight(int height) { this.height = height; }
    public long getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(long sizeBytes) { this.sizeBytes = sizeBytes; }
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
}
