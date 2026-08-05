package com.screencapture.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.http.HttpClient;
import java.time.Duration;

@Configuration
public class HttpClientConfig {

    @Bean
    public HttpClient githubHttpClient(@Value("${app.http.connect-timeout-ms:3000}") int connectTimeoutMs,
                                       @Value("${app.http.read-timeout-ms:5000}") int readTimeoutMs) {
        return HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_2)
                .followRedirects(HttpClient.Redirect.NORMAL)
                .connectTimeout(Duration.ofMillis(connectTimeoutMs))
                .build();
    }
}
