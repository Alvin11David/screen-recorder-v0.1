package com.screencapture.security;

import com.screencapture.repository.UserRepository;
import com.screencapture.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().startsWith("/api/auth/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            JwtService.JwtParseResult result = jwtService.parseTokenOrError(token);
            if (result.claims() != null) {
                String email = result.claims().getSubject();
                if (email != null && userRepository.existsByEmail(email)) {
                    var auth = new UsernamePasswordAuthenticationToken(email, null, List.of());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else {
                    log.warn("[jwt] rejected: user not found for subject '{}' (uri={})", email, request.getRequestURI());
                }
            } else {
                log.warn("[jwt] rejected: {} (uri={})", result.error(), request.getRequestURI());
            }
        } else {
            log.debug("[jwt] no bearer token (uri={})", request.getRequestURI());
        }
        chain.doFilter(request, response);
    }
}
