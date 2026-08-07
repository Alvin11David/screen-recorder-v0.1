package com.screencapture.service.mail;

import java.time.Duration;

/**
 * Delivers a password-reset verification code to a user's inbox.
 * Implementations must never log the code itself (see {@link ConsolePasswordResetMailer}
 * for the deliberately-explicit development-only exception).
 */
public interface PasswordResetMailer {

    void sendCode(String email, String code, Duration validity, String timezone);
}
