package edu.cit.dibdib.ClinicCare.features.users;

import org.springframework.stereotype.Component;

@Component
public class UserFactory {

    public BaseUser createUser(String role) {
        if (role == null) {
            return new User(); // Default to Patient if no role
        }

        switch (role.toUpperCase()) {
            case "STAFF":
            case "DOCTOR":
            case "ADMIN":
                Staff staff = new Staff();
                staff.setRole(role.toUpperCase());
                return staff;
            case "PATIENT":
            default:
                User user = new User();
                user.setRole("PATIENT");
                return user;
        }
    }
}
