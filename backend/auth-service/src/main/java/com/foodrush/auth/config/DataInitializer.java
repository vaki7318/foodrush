package com.foodrush.auth.config;

import com.foodrush.auth.model.User;
import com.foodrush.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        creerSiAbsent("Carlos Resto", "carlos@email.com", "foodrush123", "restaurateur", "514-000-0003");
        creerSiAbsent("Sophie Cuisine", "sophie@email.com", "foodrush123", "restaurateur", "514-000-0004");
        creerSiAbsent("Jean Dupont", "jean@email.com", "foodrush123", "client", "514-000-0001");
        creerSiAbsent("Marie Tremblay", "marie@email.com", "foodrush123", "client", "514-000-0002");
    }

    private void creerSiAbsent(String nom, String email, String motDePasse, String role, String telephone) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = new User();
            user.setNom(nom);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(motDePasse));
            user.setRole(role);
            user.setTelephone(telephone);
            userRepository.save(user);
        }
    }
}
