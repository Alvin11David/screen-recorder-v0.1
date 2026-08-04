package com.screencapture.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);
    private static final long CODE_TTL_SECONDS = 300;
    private static final int MAX_ATTEMPTS = 5;

    private final SecureRandom random = new SecureRandom();
    private final ConcurrentHashMap<String, ResetEntry> store = new ConcurrentHashMap<>();

    public String generateAndStoreCode(String email) {
        String code = String.format("%05d", random.nextInt(100000));
        store.put(email, new ResetEntry(code, Instant.now().plusSeconds(CODE_TTL_SECONDS), 0));
        log.info("Password reset code for {}: {}", email, code);
        sendEmail(email, code);
        return code;
    }

    public boolean verifyCode(String email, String code) {
        ResetEntry entry = store.get(email);
        if (entry == null) return false;
        if (Instant.now().isAfter(entry.expiry())) {
            store.remove(email);
            return false;
        }
        if (constantTimeEquals(entry.code(), code)) {
            return true;
        }
        ResetEntry updated = entry.incrementAttempts();
        if (updated.attempts() >= MAX_ATTEMPTS) {
            store.remove(email);
            log.warn("Too many invalid reset-code attempts for {}", email);
        } else {
            store.put(email, updated);
        }
        return false;
    }

    public void consumeCode(String email) {
        store.remove(email);
    }

    private boolean constantTimeEquals(String a, String b) {
        return MessageDigest.isEqual(
                a.getBytes(StandardCharsets.UTF_8),
                b.getBytes(StandardCharsets.UTF_8));
    }

    private void sendEmail(String email, String code) {
        log.info("--- PASSWORD RESET ---");
        log.info("To: {}", email);
        log.info("Code: {}", code);
        log.info("----------------------");
    }

    private record ResetEntry(String code, Instant expiry, int attempts) {
        ResetEntry incrementAttempts() {
            return new ResetEntry(code, expiry, attempts + 1);
        }
    }
}
