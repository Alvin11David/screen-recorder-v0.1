package com.screencapture.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);
    private static final long CODE_TTL_SECONDS = 300;

    private final ConcurrentHashMap<String, ResetEntry> store = new ConcurrentHashMap<>();

    public String generateAndStoreCode(String email) {
        String code = String.format("%05d", (int) (Math.random() * 100000));
        store.put(email, new ResetEntry(code, Instant.now().plusSeconds(CODE_TTL_SECONDS)));
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
        return entry.code().equals(code);
    }

    public void consumeCode(String email) {
        store.remove(email);
    }

    private void sendEmail(String email, String code) {
        log.info("--- PASSWORD RESET ---");
        log.info("To: {}", email);
        log.info("Code: {}", code);
        log.info("----------------------");
    }

    private record ResetEntry(String code, Instant expiry) {}
}
