package com.screencapture.service.mail;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;

import java.time.Duration;

/**
 * Tries the primary (SMTP) mailer first and falls back to the console mailer
 * when delivery throws. The console path only prints the code when
 * {@code console-fallback} is enabled, so production SMTP failures do not leak
 * codes into the logs by default.
 */
public class FailoverPasswordResetMailer implements PasswordResetMailer {

    private static final Logger log = LoggerFactory.getLogger(FailoverPasswordResetMailer.class);

    private final PasswordResetMailer primary;
    private final PasswordResetMailer fallback;

    public FailoverPasswordResetMailer(PasswordResetMailer primary, PasswordResetMailer fallback) {
        this.primary = primary;
        this.fallback = fallback;
    }

    @Override
    public void sendCode(String email, String code, Duration validity, String timezone) {
        try {
            primary.sendCode(email, code, validity, timezone);
        } catch (MailException e) {
            log.warn("SMTP delivery failed for {}; falling back to console", email, e);
            fallback.sendCode(email, code, validity, timezone);
        }
    }
}
