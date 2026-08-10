package com.screencapture.dto;

public class DriveConnectionResponse {

    private String driveEmail;
    private String accessToken;
    private long expiresIn;

    public DriveConnectionResponse(String driveEmail, String accessToken, long expiresIn) {
        this.driveEmail = driveEmail;
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
    }

    public String getDriveEmail() { return driveEmail; }
    public String getAccessToken() { return accessToken; }
    public long getExpiresIn() { return expiresIn; }
}
