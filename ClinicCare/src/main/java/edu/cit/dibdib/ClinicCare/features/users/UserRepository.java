package edu.cit.dibdib.ClinicCare.features.users;

import edu.cit.dibdib.ClinicCare.features.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
