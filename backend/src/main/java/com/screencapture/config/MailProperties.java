package com.screencapture.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * Email delivery configuration for transactional (password-reset) mail.
 * <p>
 * {@code provider} selects the mailer: {@code emailjs} (HTTPS API, works on
 * hosts that block SMTP egress), {@code smtp} (JavaMailSender), or {@code console}
 * (log only, local development). When {@code enabled} is false, codes are
 * printed to the application log instead.
 */
@ConfigurationProperties(prefix = "app.mail")
public record MailProperties(
        @DefaultValue("false") boolean enabled,
        @DefaultValue("console") String provider,
        @DefaultValue("") String host,
        @DefaultValue("587") int port,
        @DefaultValue("") String username,
        @DefaultValue("") String password,
        @DefaultValue("true") boolean auth,
        @DefaultValue("true") boolean starttls,
        @DefaultValue("") String from,
        @DefaultValue("ScreenFlow") String fromName,
        @DefaultValue("true") boolean consoleFallback,
        @DefaultValue("Your ScreenFlow password reset code") String subject,
        EmailJs emailjs
) {

    /**
     * EmailJS REST API credentials and template. See
     * <a href="https://www.emailjs.com/docs/rest-api/send/">EmailJS /send</a>.
     */
    public record EmailJs(
            @DefaultValue("https://api.emailjs.com/api/v1.0/email/send") String apiUrl,
            @DefaultValue("") String serviceId,
            @DefaultValue("") String publicKey,
            @DefaultValue("") String templateId
    ) {
        public boolean configured() {
            return serviceId != null && !serviceId.isBlank()
                    && publicKey != null && !publicKey.isBlank()
                    && templateId != null && !templateId.isBlank();
        }
    }
}
