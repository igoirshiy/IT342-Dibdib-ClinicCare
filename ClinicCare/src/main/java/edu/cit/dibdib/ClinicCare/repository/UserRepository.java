package edu.cit.dibdib.ClinicCare.repository;

import edu.cit.dibdib.ClinicCare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
