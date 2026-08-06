package com.screencapture.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleCallbackRequest {

    @NotBlank(message = "Authorization code is required")
    private String code;

    @NotBlank(message = "Redirect URI is required")
    private String redirectUri;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getRedirectUri() { return redirectUri; }
    public void setRedirectUri(String redirectUri) { this.redirectUri = redirectUri; }
}
