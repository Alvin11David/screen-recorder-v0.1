package com.screencapture.dto;

import jakarta.validation.constraints.NotBlank;

public class GitHubCallbackRequest {

    @NotBlank(message = "Authorization code is required")
    private String code;

    private String action;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
}
