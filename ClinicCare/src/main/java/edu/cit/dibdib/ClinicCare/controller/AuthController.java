package edu.cit.dibdib.ClinicCare.controller;

import edu.cit.dibdib.ClinicCare.model.User;
import edu.cit.dibdib.ClinicCare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        System.out.println("Login attempt for email: " + loginRequest.getEmail());
        return userRepository.findByEmail(loginRequest.getEmail())
                .map(user -> {
                    if (user.getPassword().equals(loginRequest.getPassword())) {
                        System.out.println("Login success for: " + loginRequest.getEmail());
                        return ResponseEntity.ok("Login successful!");
                    } else {
                        System.out.println("Login failed: Invalid password for " + loginRequest.getEmail());
                        return ResponseEntity.status(401).body("Error: Invalid password!");
                    }
                })
                .orElseGet(() -> {
                    System.out.println("Login failed: User not found with email " + loginRequest.getEmail());
                    return ResponseEntity.status(401).body("Error: User not found!");
                });
    }
}
