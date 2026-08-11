package com.screencapture.dto;

import jakarta.validation.constraints.NotBlank;

public class RenameRecordingRequest {

    @NotBlank(message = "File name is required")
    private String fileName;

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
}
