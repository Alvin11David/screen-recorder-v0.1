package com.screencapture.config;

import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * Security policy for password-reset verification codes.
 * All values are configurable via environment, with sane production defaults.
 */
public record ResetCodeProperties(
        @DefaultValue("4") int length,
        @DefaultValue("300") long ttlSeconds,
        @DefaultValue("5") int maxAttempts,
        @DefaultValue("60") long cooldownSeconds,
        @DefaultValue("5") int maxPerWindow,
        @DefaultValue("15") long windowMinutes,
        @DefaultValue("60000") long cleanupIntervalMs
) {

    public ResetCodeProperties {
        if (length < 4 || length > 8) {
            throw new IllegalArgumentException("reset-code.length must be between 4 and 8");
        }
        if (ttlSeconds <= 0) {
            throw new IllegalArgumentException("reset-code.ttl-seconds must be positive");
        }
        if (maxAttempts <= 0) {
            throw new IllegalArgumentException("reset-code.max-attempts must be positive");
        }
        if (cooldownSeconds < 0) {
            throw new IllegalArgumentException("reset-code.cooldown-seconds must be non-negative");
        }
        if (maxPerWindow <= 0) {
            throw new IllegalArgumentException("reset-code.max-per-window must be positive");
        }
        if (windowMinutes <= 0) {
            throw new IllegalArgumentException("reset-code.window-minutes must be positive");
        }
    }

    public long cooldownMillis() {
        return cooldownSeconds * 1000L;
    }

    public long windowMillis() {
        return windowMinutes * 60_000L;
    }
}
