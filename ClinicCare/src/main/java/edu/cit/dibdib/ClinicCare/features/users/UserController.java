package edu.cit.dibdib.ClinicCare.features.users;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StaffRepository staffRepository;

    @PutMapping("/profile/{id}")
    @Transactional
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User updateRequest) {
        System.out.println("Profile update request for ID: " + id + ", role: " + updateRequest.getRole());

        // Check Patients
        if ("PATIENT".equalsIgnoreCase(updateRequest.getRole())) {
            var patientOpt = userRepository.findById(id);
            if (patientOpt.isPresent()) {
                User patient = patientOpt.get();
                
                // Validate email uniqueness if changing
                if (!patient.getEmail().equals(updateRequest.getEmail())) {
                    if (userRepository.findByEmail(updateRequest.getEmail()).isPresent() || 
                        staffRepository.findByEmail(updateRequest.getEmail()).isPresent()) {
                        return ResponseEntity.badRequest().body("Error: Email is already in use!");
                    }
                }

                patient.setFullName(updateRequest.getFullName());
                patient.setEmail(updateRequest.getEmail());
                if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
                    patient.setPassword(updateRequest.getPassword());
                }
                if (updateRequest.getAge() != null) patient.setAge(updateRequest.getAge());
                if (updateRequest.getGender() != null) patient.setGender(updateRequest.getGender());
                
                return ResponseEntity.ok(userRepository.save(patient));
            }
        }

        // Check Staff
        if ("STAFF".equalsIgnoreCase(updateRequest.getRole())) {
            var staffOpt = staffRepository.findById(id);
            if (staffOpt.isPresent()) {
                Staff staff = staffOpt.get();

                // Validate email uniqueness if changing
                if (!staff.getEmail().equals(updateRequest.getEmail())) {
                    if (userRepository.findByEmail(updateRequest.getEmail()).isPresent() || 
                        staffRepository.findByEmail(updateRequest.getEmail()).isPresent()) {
                        return ResponseEntity.badRequest().body("Error: Email is already in use!");
                    }
                }

                staff.setFullName(updateRequest.getFullName());
                staff.setEmail(updateRequest.getEmail());
                if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
                    staff.setPassword(updateRequest.getPassword());
                }
                if (updateRequest.getAge() != null) staff.setAge(updateRequest.getAge());
                if (updateRequest.getGender() != null) staff.setGender(updateRequest.getGender());

                return ResponseEntity.ok(staffRepository.save(staff));
            }
        }

        return ResponseEntity.status(404).body("User not found!");
    }
}
