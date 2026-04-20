package com.foodrush.business.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    @Value("${jwt.secret}") private String secret;
    
    public DecodedJWT validateToken(String token) {
        return JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
    }
    
    public String getEmailFromToken(String token) {
        return validateToken(token).getSubject();
    }
    
    public String getRoleFromToken(String token) {
        return validateToken(token).getClaim("role").asString();
    }
}
