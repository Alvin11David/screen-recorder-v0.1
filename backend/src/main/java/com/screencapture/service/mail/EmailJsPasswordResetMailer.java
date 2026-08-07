package com.screencapture.service.mail;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.screencapture.config.MailProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Delivers the password-reset code via the EmailJS REST API (HTTPS).
 * Unlike SMTP, this path works from hosts that block outbound SMTP egress
 * (e.g. Railway/Render free tiers), because it only needs HTTPS on port 443.
 *
 * <p>The rendered email content lives in the EmailJS template
 * ({@code {{email}}}, {@code {{passcode}}}, {@code {{time}}}), so no HTML is
 * built here. Failures are logged and rethrown so a
 * {@link FailoverPasswordResetMailer} can fall back to another delivery path.
 */
public class EmailJsPasswordResetMailer implements PasswordResetMailer {

    private static final Logger log = LoggerFactory.getLogger(EmailJsPasswordResetMailer.class);
    private static final DateTimeFormatter EXPIRY_FORMAT =
            DateTimeFormatter.ofPattern("h:mm a").withZone(ZoneId.systemDefault());

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final MailProperties.EmailJs props;

    public EmailJsPasswordResetMailer(HttpClient httpClient, ObjectMapper objectMapper, MailProperties.EmailJs props) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
        this.props = props;
    }

    @Override
    public void sendCode(String email, String code, Duration validity) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("service_id", props.serviceId());
        payload.put("template_id", props.templateId());
        payload.put("user_id", props.publicKey());

        Map<String, Object> params = new LinkedHashMap<>();
        params.put("email", email);
        params.put("passcode", code);
        params.put("time", EXPIRY_FORMAT.format(Instant.now().plus(validity)));
        payload.put("template_params", params);

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(props.apiUrl()))
                    .timeout(Duration.ofSeconds(20))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Password reset code email sent via EmailJS to {}", email);
            } else {
                log.error("EmailJS send failed for {}: HTTP {} body={}",
                        email, response.statusCode(), response.body());
                throw new MailSendException("EmailJS returned HTTP " + response.statusCode());
            }
        } catch (MailException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to send password reset email via EmailJS to {}", email, e);
            throw new MailSendException("Failed to send password reset email to " + email, e);
        }
    }
}
