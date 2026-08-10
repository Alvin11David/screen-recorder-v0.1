package com.screencapture.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMs
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(String email) {
        Date now = new Date();
        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isValid(String token) {
        return parseClaimsOrNull(token) != null;
    }

    public Claims extractClaimsOrNull(String token) {
        return parseClaimsOrNull(token);
    }

    public record JwtParseResult(Claims claims, String error) {}

    public JwtParseResult parseTokenOrError(String token) {
        try {
            return new JwtParseResult(parseClaims(token), null);
        } catch (ExpiredJwtException e) {
            return new JwtParseResult(null, "expired");
        } catch (SignatureException e) {
            return new JwtParseResult(null, "bad signature");
        } catch (MalformedJwtException e) {
            return new JwtParseResult(null, "malformed");
        } catch (Exception e) {
            return new JwtParseResult(null, e.getClass().getSimpleName());
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Claims parseClaimsOrNull(String token) {
        try {
            return parseClaims(token);
        } catch (Exception e) {
            return null;
        }
    }
}
