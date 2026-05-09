package edu.cit.dibdib.ClinicCare.features.appointments;

import edu.cit.dibdib.ClinicCare.features.appointments.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {
    java.util.List<Slot> findByDoctorAndDate(String doctor, String date);
}
