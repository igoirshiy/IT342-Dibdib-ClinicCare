package edu.cit.dibdib.ClinicCare.repository;

import edu.cit.dibdib.ClinicCare.model.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {
    java.util.List<Slot> findByDoctorAndDate(String doctor, String date);
}
