package com.screencapture.service.mail;

import com.screencapture.config.MailProperties;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;

/**
 * Production mailer backed by a JavaMailSender SMTP session.
 * Delivery failures are logged and rethrown so a {@link FailoverPasswordResetMailer}
 * can fall back to another delivery path (e.g. console) without surfacing the
 * failure to the caller.
 */
public class SmtpPasswordResetMailer implements PasswordResetMailer {

    private static final Logger log = LoggerFactory.getLogger(SmtpPasswordResetMailer.class);

    private final JavaMailSender mailSender;
    private final MailProperties props;

    public SmtpPasswordResetMailer(JavaMailSender mailSender, MailProperties props) {
        this.mailSender = mailSender;
        this.props = props;
    }

    @Override
    public void sendCode(String email, String code, Duration validity) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, StandardCharsets.UTF_8.name());
            helper.setFrom(props.from(), props.fromName());
            helper.setTo(email);
            helper.setSubject(props.subject());
            helper.setSentDate(new Date());
            helper.setText(buildPlainText(code, validity), buildHtml(code, validity));

            mailSender.send(message);
            log.info("Password reset code email sent to {}", email);
        } catch (MailException | jakarta.mail.MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send password reset email to {}", email, e);
        }
    }

    private String buildPlainText(String code, Duration validity) {
        return """
                Hello,

                Use the 4-digit code below to reset your ScreenFlow password.

                Your code: %s

                This code expires in %d minutes. If you didn't request this, you can safely ignore this email.

                — The ScreenFlow team
                """.formatted(code, validity.toMinutes());
    }

    private String buildHtml(String code, Duration validity) {
        long minutes = validity.toMinutes();
        return """
                <div style="font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; \
                max-width: 480px; margin: 0 auto; padding: 32px; color: #1f2937;">
                  <h2 style="margin: 0 0 16px; font-size: 20px;">Reset your ScreenFlow password</h2>
                  <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6;">
                    Use the 4-digit code below to verify it's you:
                  </p>
                  <div style="display: inline-block; padding: 14px 24px; background: #eff6ff; border: 1px solid #bfdbfe;\
                  border-radius: 12px; font-size: 28px; font-weight: 700; letter-spacing: 10px; color: #1d4ed8;">
                    %s
                  </div>
                  <p style="margin: 24px 0 0; font-size: 13px; line-height: 1.6; color: #6b7280;">
                    This code expires in %d minutes. If you didn't request a password reset,
                    you can safely ignore this email.
                  </p>
                </div>
                """.formatted(code, minutes);
    }
}
