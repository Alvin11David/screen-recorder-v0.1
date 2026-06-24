package com.screencapture.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class VerifyResetCodeRequest {

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Code is required")
    @Size(min = 5, max = 5, message = "Code must be exactly 5 digits")
    @Pattern(regexp = "\\d{5}", message = "Code must be 5 digits")
    private String code;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}
