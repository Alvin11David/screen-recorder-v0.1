package com.screencapture.config;

import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * SMTP configuration for transactional (password-reset) email delivery.
 * When {@code enabled} is false, codes are printed to the application log
 * instead (local development only).
 */
public record MailProperties(
        @DefaultValue("false") boolean enabled,
        @DefaultValue("") String host,
        @DefaultValue("587") int port,
        @DefaultValue("") String username,
        @DefaultValue("") String password,
        @DefaultValue("true") boolean auth,
        @DefaultValue("true") boolean starttls,
        @DefaultValue("") String from,
        @DefaultValue("ScreenFlow") String fromName,
        @DefaultValue("true") boolean consoleFallback,
        @DefaultValue("Your ScreenFlow password reset code") String subject
) {}
