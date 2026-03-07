package edu.cit.dibdib.ClinicCare.controller;

import edu.cit.dibdib.ClinicCare.model.Staff;
import edu.cit.dibdib.ClinicCare.model.User;
import edu.cit.dibdib.ClinicCare.repository.StaffRepository;
import edu.cit.dibdib.ClinicCare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StaffRepository staffRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent() || 
            staffRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        System.out.println("Login attempt for email: " + loginRequest.getEmail());

        // 1. Check Patients (users table)
        var patientOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (patientOpt.isPresent()) {
            User patient = patientOpt.get();
            if (patient.getPassword().equals(loginRequest.getPassword())) {
                System.out.println("Patient login success: " + loginRequest.getEmail());
                if (patient.getRole() == null) patient.setRole("PATIENT");
                return ResponseEntity.ok(patient);
            } else {
                return ResponseEntity.status(401).body("Error: Invalid password!");
            }
        }

        // 2. Check Staff (staff table)
        var staffOpt = staffRepository.findByEmail(loginRequest.getEmail());
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            if (staff.getPassword().equals(loginRequest.getPassword())) {
                System.out.println("Staff login success: " + loginRequest.getEmail());
                return ResponseEntity.ok(staff);
            } else {
                return ResponseEntity.status(401).body("Error: Invalid password!");
            }
        }

        System.out.println("Login failed: User not found with email " + loginRequest.getEmail());
        return ResponseEntity.status(401).body("Error: User not found!");
    }
}
