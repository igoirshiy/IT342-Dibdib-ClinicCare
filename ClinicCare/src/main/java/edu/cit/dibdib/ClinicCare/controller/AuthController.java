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
}
