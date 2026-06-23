package com.screencapture.dto;

public class AuthResponse {

    private String token;
    private String email;
    private String name;
    private String avatar;

    public AuthResponse(String token, String email, String name, String avatar) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.avatar = avatar;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getAvatar() { return avatar; }
}
