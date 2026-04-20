package com.foodrush.auth.service;

import com.foodrush.auth.dto.AuthResponse;
import com.foodrush.auth.dto.RecoverRequest;
import com.foodrush.auth.dto.SignInRequest;
import com.foodrush.auth.dto.SignUpRequest;
import com.foodrush.auth.model.User;
import com.foodrush.auth.repository.UserRepository;
import com.foodrush.auth.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(SignUpRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Un compte existe déjà avec cet email: " + request.getEmail());
        }

        User user = new User();
        user.setNom(request.getNom());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setTelephone(request.getTelephone());

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser);

        return new AuthResponse(token, savedUser.getNom(), savedUser.getEmail(), savedUser.getRole());
    }

    public AuthResponse login(SignInRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Email ou mot de passe incorrect");
        }

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getNom(), user.getEmail(), user.getRole());
    }

    @Transactional
    public void recoverPassword(RecoverRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Aucun compte associé à cet email: " + request.getEmail()));

        user.setPassword(passwordEncoder.encode(request.getNouveauMotDePasse()));
        userRepository.save(user);
    }
}
