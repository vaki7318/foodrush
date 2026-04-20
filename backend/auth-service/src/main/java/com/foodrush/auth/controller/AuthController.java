package com.foodrush.auth.controller;

import com.foodrush.auth.dto.AuthResponse;
import com.foodrush.auth.dto.RecoverRequest;
import com.foodrush.auth.dto.SignInRequest;
import com.foodrush.auth.dto.SignUpRequest;
import com.foodrush.auth.service.AuthServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServiceImpl authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody SignUpRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody SignInRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/recover")
    public ResponseEntity<Map<String, String>> recoverPassword(@Valid @RequestBody RecoverRequest request) {
        authService.recoverPassword(request);
        return ResponseEntity.ok(Map.of("message", "Mot de passe mis à jour avec succès"));
    }
}
