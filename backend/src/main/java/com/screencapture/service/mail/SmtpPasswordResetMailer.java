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
            throw new MailSendException("Failed to send password reset email to " + email, e);
        }
    }

    private String buildPlainText(String code, Duration validity) {
        return """
                Hi there,

                We received a request to reset your ScreenFlow password.

                Your verification code is: %s

                This code expires in %d minutes. Enter it in the app to continue.

                If you didn't request this, you can safely ignore this email — no changes have been made.

                — The ScreenFlow team
                """.formatted(code, validity.toMinutes());
    }

    private String buildHtml(String code, Duration validity) {
        long minutes = validity.toMinutes();
        StringBuilder digits = new StringBuilder();
        for (char c : code.toCharArray()) {
            digits.append("""
                        <td align="center" valign="middle" style="mso-padding-alt:0;width:64px;height:80px;background:#0D1526;border:1px solid #223A66;border-radius:14px;font-family:'SF Mono',ui-monospace,Menlo,Consolas,'Liberation Mono',monospace;font-size:36px;font-weight:700;color:#6FB4FF;letter-spacing:0;">
                          %c
                        </td>
                    """.formatted(c));
        }

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="color-scheme" content="light dark">
                <meta name="supported-color-schemes" content="light dark">
                <title>Reset your ScreenFlow password</title>
                <!--[if mso]>
                <style type="text/css">.container{width:600px}.card{background-color:#111A2E!important}.header-table{width:100%!important}.spacer{height:40px}</style>
                <![endif]-->
                <style>
                  @media only screen and (max-width:600px){
                    .container{width:100%!important;padding-left:16px!important;padding-right:16px!important}
                    .digit-cell{display:inline-block!important;width:52px!important;height:68px!important;font-size:30px!important}
                    .digits-row td{width:52px!important;height:68px!important;font-size:30px!important;padding:0 4px!important}
                  }
                </style>
                </head>
                <body style="margin:0;padding:0;background-color:#0B1120;">
                <div role="article" aria-roledescription="email" lang="en" style="background-color:#0B1120;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0B1120;">
                <tr><td align="center" style="padding:48px 16px 64px;">

                <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#0B1120;">

                <!-- Preheader (invisible) -->
                <tr><td style="display:none;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;color:#0B1120;">
                Your ScreenFlow verification code is %s — valid for %d minutes.
                </td></tr>

                <!-- Brand header -->
                <tr><td align="center" style="padding-bottom:32px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="header-table">
                    <tr>
                      <td valign="middle" style="padding-right:12px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td width="40" height="40" align="center" valign="middle" style="width:40px;height:40px;background:linear-gradient(135deg,#4FA3EC 0%,#2FC4D9 100%);border-radius:12px;font-size:0;">
                              <div style="display:inline-block;width:12px;height:12px;background:#0B1120;border-radius:3px;"></div>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td valign="middle" style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;letter-spacing:-0.3px;color:#E6EDF7;">
                        ScreenFlow
                      </td>
                    </tr>
                  </table>
                </td></tr>

                <!-- Card -->
                <tr><td>
                  <table role="presentation" class="card" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:linear-gradient(180deg,#111A2E 0%,#0E1626 100%);border:1px solid #223050;border-radius:24px;box-shadow:0 24px 60px rgba(0,0,0,0.45);">
                    <tr><td style="height:6px;background:linear-gradient(90deg,#4FA3EC,#2FC4D9);border-radius:24px 24px 0 0;font-size:0;line-height:6px;" height="6">&nbsp;</td></tr>
                    <tr>
                      <td style="padding:44px 48px 40px;">

                        <p style="margin:0 0 14px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#7DB0FF;">Security verification</p>
                        <h1 style="margin:0 0 12px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:30px;font-weight:700;letter-spacing:-0.8px;line-height:1.2;color:#FFFFFF;">Reset your password</h1>
                        <p style="margin:0 0 32px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;color:#AEBBD1;">
                          We received a request to reset your ScreenFlow account password. Use the code below to verify it's you:
                        </p>

                        <!-- Code digits -->
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="digits-row" align="center" style="margin:0 auto 32px;">
                          <tr>
                            %s
                          </tr>
                        </table>

                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 8px;">
                          <tr>
                            <td align="center" style="font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#8FA3C0;">
                              This code expires in %d minutes.
                            </td>
                          </tr>
                        </table>

                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0;">
                          <tr><td style="border-top:1px solid #223050;font-size:0;line-height:1px;" height="1">&nbsp;</td></tr>
                        </table>

                        <p style="margin:24px 0 0;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#8FA3C0;">
                          Didn't request this? You can safely ignore this email. Your password won't change unless you enter this code.
                        </p>

                      </td>
                    </tr>
                  </table>
                </td></tr>

                <!-- Footer -->
                <tr><td align="center" style="padding:32px 16px 0;">
                  <p style="margin:0 0 8px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#5C6E8C;">Sent from the ScreenFlow team &middot; screenflow</p>
                  <p style="margin:0;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#5C6E8C;">
                    If you have questions, reply to this email or visit <a href="https://screen-recorder-v0-1.vercel.app" style="color:#7DB0FF;text-decoration:none;">ScreenFlow</a>.
                  </p>
                </td></tr>

                </table>
                </td></tr>
                </table>
                </div>
                </body>
                </html>
                """.replace("__DIGITS__", digits)
                .replace("__PREVIEW_CODE__", code)
                .replace("__PREVIEW_MINUTES__", Long.toString(minutes))
                .replace("__MINUTES__", Long.toString(minutes));
    }
}
