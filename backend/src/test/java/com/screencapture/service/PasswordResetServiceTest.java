package com.screencapture.service;

import com.screencapture.config.ResetCodeProperties;
import com.screencapture.service.mail.PasswordResetMailer;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PasswordResetServiceTest {

    private static final String EMAIL = "user@example.com";

    private static ResetCodeProperties props(int maxAttempts, long cooldownSeconds, int maxPerWindow) {
        return new ResetCodeProperties(4, 300, maxAttempts, cooldownSeconds, maxPerWindow, 15, 60_000);
    }

    private static final class FakeMailer implements PasswordResetMailer {
        final List<Mail> sent = new ArrayList<>();

        record Mail(String email, String code, Duration validity) {}

        @Override
        public void sendCode(String email, String code, Duration validity, String timezone) {
            sent.add(new Mail(email, code, validity));
        }
    }

    private static PasswordResetService service(FakeMailer mailer, ResetCodeProperties props) {
        return new PasswordResetService(mailer, props);
    }

    @Test
    void issuesFourDigitCodesWithinRange() {
        FakeMailer mailer = new FakeMailer();
        PasswordResetService service = service(mailer, props(5, 60, 5));

        for (int i = 0; i < 200; i++) {
            service.issueCode(EMAIL, null);
            String delivered = mailer.sent.get(mailer.sent.size() - 1).code();
            assertEquals(4, delivered.length());
            int numeric = Integer.parseInt(delivered);
            assertTrue(numeric >= 1000 && numeric <= 9999, "code out of range: " + delivered);
        }
    }

    @Test
    void deliversCodeToMailer() {
        FakeMailer mailer = new FakeMailer();
        PasswordResetService service = service(mailer, props(5, 60, 5));

        service.issueCode(EMAIL, null);

        assertEquals(1, mailer.sent.size());
        String delivered = mailer.sent.get(0).code();
        assertEquals(EMAIL, mailer.sent.get(0).email());
        assertEquals(300, mailer.sent.get(0).validity().toSeconds());
        assertTrue(service.verifyCode(EMAIL, delivered));
    }

    @Test
    void rejectsWrongCode() {
        FakeMailer mailer = new FakeMailer();
        PasswordResetService service = service(mailer, props(5, 60, 5));

        service.issueCode(EMAIL, null);
        String delivered = mailer.sent.get(0).code();
        String wrong = delivered.equals("0000") ? "0001" : "0000";

        assertFalse(service.verifyCode(EMAIL, wrong));
        assertTrue(service.verifyCode(EMAIL, delivered));
    }

    @Test
    void invalidatesCodeAfterMaxFailedAttempts() {
        FakeMailer mailer = new FakeMailer();
        PasswordResetService service = service(mailer, props(3, 60, 5));

        service.issueCode(EMAIL, null);
        String delivered = mailer.sent.get(0).code();

        assertFalse(service.verifyCode(EMAIL, "1111"));
        assertFalse(service.verifyCode(EMAIL, "2222"));
        assertFalse(service.verifyCode(EMAIL, "3333"));
        assertFalse(service.verifyCode(EMAIL, delivered), "code should be invalidated after max attempts");
    }

    @Test
    void rejectsExpiredCode() throws Exception {
        FakeMailer mailer = new FakeMailer();
        ResetCodeProperties props = new ResetCodeProperties(4, 1, 5, 60, 5, 15, 60_000);
        PasswordResetService service = service(mailer, props);

        service.issueCode(EMAIL, null);
        String delivered = mailer.sent.get(0).code();

        Thread.sleep(1_100);
        assertFalse(service.verifyCode(EMAIL, delivered));
    }

    @Test
    void codeIsConsumedAfterSuccessfulVerification() {
        FakeMailer mailer = new FakeMailer();
        PasswordResetService service = service(mailer, props(5, 60, 5));

        service.issueCode(EMAIL, null);
        String delivered = mailer.sent.get(0).code();
        assertTrue(service.verifyCode(EMAIL, delivered));

        service.issueCode(EMAIL, null);
        String second = mailer.sent.get(1).code();
        service.consumeCode(EMAIL);
        assertFalse(service.verifyCode(EMAIL, second));
    }

    @Test
    void storedEntryHoldsDigestNotPlaintext() throws Exception {
        FakeMailer mailer = new FakeMailer();
        PasswordResetService service = service(mailer, props(5, 60, 5));

        service.issueCode(EMAIL, null);
        String delivered = mailer.sent.get(0).code();

        Field codesField = PasswordResetService.class.getDeclaredField("codes");
        codesField.setAccessible(true);
        @SuppressWarnings("unchecked")
        Map<String, Object> codes = (Map<String, Object>) codesField.get(service);
        Object entry = codes.get(EMAIL);

        Field codeHashField = entry.getClass().getDeclaredField("codeHash");
        codeHashField.setAccessible(true);
        String storedHash = (String) codeHashField.get(entry);

        assertNotEquals(delivered, storedHash, "plaintext code must not be stored");
        assertEquals(64, storedHash.length(), "SHA-256 hex digest expected");
    }

    @Test
    void cooldownBlocksImmediateResend() {
        FakeMailer mailer = new FakeMailer();
        PasswordResetService service = service(mailer, props(5, 60, 5));

        assertTrue(service.tryAcquireSend(EMAIL));
        assertFalse(service.tryAcquireSend(EMAIL));
    }

    @Test
    void zeroCooldownAllowsImmediateResend() {
        FakeMailer mailer = new FakeMailer();
        PasswordResetService service = service(mailer, props(5, 0, 5));

        assertTrue(service.tryAcquireSend(EMAIL));
        assertTrue(service.tryAcquireSend(EMAIL));
    }

    @Test
    void capsSendsWithinWindow() {
        FakeMailer mailer = new FakeMailer();
        PasswordResetService service = service(mailer, props(5, 0, 2));

        assertTrue(service.tryAcquireSend(EMAIL));
        assertTrue(service.tryAcquireSend(EMAIL));
        assertFalse(service.tryAcquireSend(EMAIL));
    }

    @Test
    void throttlesIndependentlyPerEmail() {
        FakeMailer mailer = new FakeMailer();
        PasswordResetService service = service(mailer, props(5, 60, 5));

        assertTrue(service.tryAcquireSend(EMAIL));
        assertFalse(service.tryAcquireSend(EMAIL));
        assertTrue(service.tryAcquireSend("other@example.com"));
    }

    @Test
    void purgeExpiredSweepsOldCodes() throws Exception {
        FakeMailer mailer = new FakeMailer();
        ResetCodeProperties props = new ResetCodeProperties(4, 1, 5, 60, 5, 15, 60_000);
        PasswordResetService service = service(mailer, props);

        service.issueCode(EMAIL, null);
        String delivered = mailer.sent.get(0).code();
        Thread.sleep(1_100);

        service.purgeExpired();
        assertFalse(service.verifyCode(EMAIL, delivered));
    }
}
