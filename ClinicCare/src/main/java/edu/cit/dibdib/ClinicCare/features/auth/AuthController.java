package edu.cit.dibdib.ClinicCare.features.auth;

import edu.cit.dibdib.ClinicCare.features.users.Staff;
import edu.cit.dibdib.ClinicCare.features.users.User;
import edu.cit.dibdib.ClinicCare.features.users.StaffRepository;
import edu.cit.dibdib.ClinicCare.features.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private edu.cit.dibdib.ClinicCare.features.users.UserFactory userFactory;

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> registerUser(@RequestBody User userRequest) {
        System.out.println("Registration attempt for email: " + userRequest.getEmail());
        
        // 1. Check if email exists in either table
        if (userRepository.findByEmail(userRequest.getEmail()).isPresent() || 
            staffRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        // 2. Use Factory Pattern to create the correct object
        // For registration through this endpoint, we default to PATIENT 
        // unless specified otherwise (in a real system, roles are sensitive)
        edu.cit.dibdib.ClinicCare.features.users.BaseUser newUser = userFactory.createUser(userRequest.getRole());
        
        // Map data (A DTO or Mapper pattern would be better, but we'll stick to a simple copy for now)
        if (newUser instanceof edu.cit.dibdib.ClinicCare.features.users.Staff staff) {
            staff.setFullName(userRequest.getFullName());
            staff.setEmail(userRequest.getEmail());
            staff.setPassword(userRequest.getPassword());
            staff.setAge(userRequest.getAge());
            staff.setGender(userRequest.getGender());
            return ResponseEntity.ok(staffRepository.save(staff));
        } else {
            edu.cit.dibdib.ClinicCare.features.users.User user = (edu.cit.dibdib.ClinicCare.features.users.User) newUser;
            user.setFullName(userRequest.getFullName());
            user.setEmail(userRequest.getEmail());
            user.setPassword(userRequest.getPassword());
            user.setAge(userRequest.getAge());
            user.setGender(userRequest.getGender());
            return ResponseEntity.ok(userRepository.save(user));
        }
    }

    @PostMapping("/login")
    @Transactional(readOnly = true)
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

    @PostMapping("/google-login")
    @Transactional
    public ResponseEntity<?> googleLogin(@RequestBody edu.cit.dibdib.cliniccare.features.auth.GoogleLoginRequest request) {
        try {
            com.google.api.client.http.HttpTransport transport = new com.google.api.client.http.javanet.NetHttpTransport();
            com.google.api.client.json.JsonFactory jsonFactory = com.google.api.client.json.gson.GsonFactory.getDefaultInstance();
            
            // Replace with the Web Client ID once generated
            String webClientId = "106277203446-9792k4n8vl2qdkkjdoone90irhei09gq.apps.googleusercontent.com"; 
            
            com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier verifier = new com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .setAudience(java.util.Collections.singletonList(webClientId))
                .build();

            com.google.api.client.googleapis.auth.oauth2.GoogleIdToken idToken = verifier.verify(request.getIdToken());
            if (idToken != null) {
                com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                
                var patientOpt = userRepository.findByEmail(email);
                if (patientOpt.isPresent()) {
                    User patient = patientOpt.get();
                    if (patient.getRole() == null) patient.setRole("PATIENT");
                    return ResponseEntity.ok(patient);
                }
                
                var staffOpt = staffRepository.findByEmail(email);
                if (staffOpt.isPresent()) {
                    return ResponseEntity.ok(staffOpt.get());
                }
                
                // Auto-register new patient
                edu.cit.dibdib.ClinicCare.features.users.BaseUser newUser = userFactory.createUser("PATIENT");
                User user = (User) newUser;
                user.setEmail(email);
                user.setFullName(name);
                user.setPassword(""); // Generate random or leave blank
                user.setRole("PATIENT");
                userRepository.save(user);
                
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(401).body("Invalid ID token.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error verifying token: " + e.getMessage());
        }
    }
}
