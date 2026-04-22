package com.foodrush.business.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    public JwtAuthenticationFilter(JwtUtil jwtUtil) { this.jwtUtil = jwtUtil; }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/restaurants") || path.startsWith("/api/plats/restaurant/");
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String email = jwtUtil.getEmailFromToken(token);
                String role = jwtUtil.getRoleFromToken(token);
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email, null, 
                    Collections.singletonList(() -> "ROLE_" + role.toUpperCase()));
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception e) { }
        }
        chain.doFilter(req, res);
    }
}
