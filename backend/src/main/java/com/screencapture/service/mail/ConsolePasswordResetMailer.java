package com.screencapture.service.mail;

import com.screencapture.config.MailProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;

/**
 * Development-only fallback that prints the code to the application log when
 * SMTP is not configured. Never enable in production: it deliberately emits
 * the code, which would leak into logs.
 */
public class ConsolePasswordResetMailer implements PasswordResetMailer {

    private static final Logger log = LoggerFactory.getLogger(ConsolePasswordResetMailer.class);

    private final MailProperties props;

    public ConsolePasswordResetMailer(MailProperties props) {
        this.props = props;
    }

    @Override
    public void sendCode(String email, String code, Duration validity) {
        if (props.consoleFallback()) {
            log.warn("""
                    ==========================================================
                    PASSWORD RESET CODE (console fallback - DEV ONLY)
                    To: {}
                    Code: {}
                    Expires in: {} minutes
                    Set MAIL_ENABLED=true and configure SMTP in production.
                    ==========================================================""",
                    email, code, validity.toMinutes());
        } else {
            log.warn("Password reset requested for {} but mail is not configured and console fallback is disabled; no code was delivered.", email);
        }
    }
}
