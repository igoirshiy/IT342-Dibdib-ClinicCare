package edu.cit.dibdib.ClinicCare.repository;

import edu.cit.dibdib.ClinicCare.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByEmail(String email);
}
