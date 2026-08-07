package com.screencapture.service;

import com.screencapture.config.ResetCodeProperties;
import com.screencapture.service.mail.PasswordResetMailer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Issues, stores and validates short-lived password-reset verification codes.
 *
 * <p>Security properties:
 * <ul>
 *   <li>Codes are 4 digits, generated with {@link SecureRandom}.</li>
 *   <li>Only a SHA-256 digest of a code is retained in memory, never the plaintext.</li>
 *   <li>Codes expire after a configurable TTL and are invalidated after too many wrong attempts.</li>
 *   <li>Verification uses constant-time comparison.</li>
 *   <li>Sends are throttled per email (resend cooldown + max per rolling window) to blunt
 *       abuse and brute-force, and the throttle applies identically to unknown accounts so the
 *       endpoint cannot be used to enumerate registered emails.</li>
 * </ul>
 */
@Service
public class PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);

    private final SecureRandom random = new SecureRandom();
    private final PasswordResetMailer mailer;
    private final ResetCodeProperties props;

    private final ConcurrentHashMap<String, ResetEntry> codes = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, SendRecord> sends = new ConcurrentHashMap<>();

    public PasswordResetService(PasswordResetMailer mailer, ResetCodeProperties props) {
        this.mailer = mailer;
        this.props = props;
    }

    /**
     * Atomically attempts to reserve a send slot for the given email.
     * Applies the resend cooldown and the per-window cap. Must be called for both
     * registered and unregistered emails so the endpoint behaves identically for both.
     */
    public boolean tryAcquireSend(String email) {
        long now = Instant.now().toEpochMilli();
        AtomicBoolean allowed = new AtomicBoolean(false);

        sends.compute(email, (key, current) -> {
            if (current == null) {
                allowed.set(true);
                return new SendRecord(now, now, 1);
            }
            if (now - current.lastSentAtMillis() < props.cooldownMillis()) {
                return current;
            }
            long windowStart = current.windowStartMillis();
            int count = current.count();
            if (now - windowStart > props.windowMillis()) {
                windowStart = now;
                count = 0;
            }
            if (count >= props.maxPerWindow()) {
                return current;
            }
            allowed.set(true);
            return new SendRecord(now, windowStart, count + 1);
        });

        return allowed.get();
    }

    /**
     * Generates a fresh 4-digit code, stores only its digest, and delivers it via email.
     */
    public void issueCode(String email, String timezone) {
        String code = generateCode(props.length());
        long expiry = Instant.now().plusSeconds(props.ttlSeconds()).toEpochMilli();
        codes.put(email, new ResetEntry(hash(code), expiry, 0));
        mailer.sendCode(email, code, Duration.ofSeconds(props.ttlSeconds()), timezone);
    }

    /**
     * Validates a code. Returns true once and only once for the correct code; a wrong
     * code increments the attempt counter until the entry is invalidated.
     */
    public boolean verifyCode(String email, String code) {
        ResetEntry entry = codes.get(email);
        if (entry == null) return false;

        if (Instant.now().toEpochMilli() > entry.expiryMillis()) {
            codes.remove(email);
            return false;
        }

        if (constantTimeEquals(entry.codeHash(), hash(code))) {
            return true;
        }

        int attempts = entry.attempts() + 1;
        if (attempts >= props.maxAttempts()) {
            codes.remove(email);
            log.warn("Password reset code invalidated for {} after {} failed attempts", email, attempts);
        } else {
            codes.put(email, new ResetEntry(entry.codeHash(), entry.expiryMillis(), attempts));
        }
        return false;
    }

    public void consumeCode(String email) {
        codes.remove(email);
    }

    /** Periodic sweep that drops expired codes and stale send-window bookkeeping. */
    @Scheduled(fixedDelayString = "${app.security.reset-code.cleanup-interval-ms:60000}")
    public void purgeExpired() {
        long now = Instant.now().toEpochMilli();
        codes.entrySet().removeIf(e -> e.getValue().expiryMillis() <= now);
        sends.entrySet().removeIf(e -> now - e.getValue().windowStartMillis() > props.windowMillis());
    }

    private String generateCode(int length) {
        int min = (int) Math.pow(10, length - 1);
        int max = (int) Math.pow(10, length);
        return Integer.toString(random.nextInt(max - min) + min);
    }

    private static String hash(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    private static boolean constantTimeEquals(String a, String b) {
        return MessageDigest.isEqual(
                a.getBytes(StandardCharsets.UTF_8),
                b.getBytes(StandardCharsets.UTF_8));
    }

    private record ResetEntry(String codeHash, long expiryMillis, int attempts) {}

    private record SendRecord(long lastSentAtMillis, long windowStartMillis, int count) {}
}
