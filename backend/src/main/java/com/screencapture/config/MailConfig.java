package com.screencapture.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.screencapture.service.mail.ConsolePasswordResetMailer;
import com.screencapture.service.mail.EmailJsPasswordResetMailer;
import com.screencapture.service.mail.FailoverPasswordResetMailer;
import com.screencapture.service.mail.PasswordResetMailer;
import com.screencapture.service.mail.SmtpPasswordResetMailer;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.net.http.HttpClient;
import java.util.Properties;

/**
 * Wires the transactional email stack. Selecting the mailer at startup keeps a
 * misconfiguration loud instead of failing at first password reset.
 */
@Configuration
@EnableScheduling
@EnableConfigurationProperties({MailProperties.class, ResetCodeProperties.class})
public class MailConfig {

    @Bean
    @ConditionalOnProperty(name = "app.mail.provider", havingValue = "smtp")
    public JavaMailSender javaMailSender(MailProperties props) {
        if (props.host() == null || props.host().isBlank()) {
            throw new IllegalStateException("app.mail.enabled is true but SMTP_HOST is not set");
        }
        if (props.from() == null || props.from().isBlank()) {
            throw new IllegalStateException("app.mail.enabled is true but MAIL_FROM is not set");
        }

        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(props.host());
        sender.setPort(props.port());
        if (props.username() != null && !props.username().isBlank()) {
            sender.setUsername(props.username());
            sender.setPassword(props.password());
        }

        Properties mailProps = sender.getJavaMailProperties();
        mailProps.put("mail.smtp.auth", String.valueOf(props.auth()));
        mailProps.put("mail.smtp.starttls.enable", String.valueOf(props.starttls()));
        mailProps.put("mail.smtp.connectiontimeout", 10_000);
        mailProps.put("mail.smtp.timeout", 10_000);
        mailProps.put("mail.smtp.writetimeout", 10_000);
        return sender;
    }

    @Bean
    public PasswordResetMailer passwordResetMailer(ObjectProvider<JavaMailSender> sender,
                                                   HttpClient httpClient,
                                                   ObjectMapper objectMapper,
                                                   MailProperties props) {
        PasswordResetMailer primary = buildPrimaryMailer(sender, httpClient, objectMapper, props);
        if (props.consoleFallback()) {
            return new FailoverPasswordResetMailer(primary, new ConsolePasswordResetMailer(props));
        }
        return primary;
    }

    private PasswordResetMailer buildPrimaryMailer(ObjectProvider<JavaMailSender> sender,
                                                   HttpClient httpClient,
                                                   ObjectMapper objectMapper,
                                                   MailProperties props) {
        if (!props.enabled()) {
            return new ConsolePasswordResetMailer(props);
        }
        return switch (props.provider()) {
            case "emailjs" -> buildEmailJsMailer(httpClient, objectMapper, props);
            case "smtp" -> new SmtpPasswordResetMailer(sender.getObject(), props);
            default -> new ConsolePasswordResetMailer(props);
        };
    }

    private PasswordResetMailer buildEmailJsMailer(HttpClient httpClient, ObjectMapper objectMapper, MailProperties props) {
        MailProperties.EmailJs emailjs = props.emailjs();
        if (!emailjs.configured()) {
            throw new IllegalStateException(
                    "app.mail.provider=emailjs but EMAILJS_SERVICE_ID / EMAILJS_PUBLIC_KEY / EMAILJS_TEMPLATE_ID are not set");
        }
        return new EmailJsPasswordResetMailer(httpClient, objectMapper, emailjs);
    }
}
