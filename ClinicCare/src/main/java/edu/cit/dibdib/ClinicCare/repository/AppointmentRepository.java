package edu.cit.dibdib.ClinicCare.repository;

import edu.cit.dibdib.ClinicCare.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientEmail(String patientEmail);
    List<Appointment> findByAppointmentDateOrderByTimeSlotAsc(LocalDate date);
    long countByAppointmentDate(LocalDate date);
    long countByAppointmentDateAndDoctorName(LocalDate date, String doctorName);
    
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT a.doctorName FROM Appointment a WHERE a.appointmentDate = :date ORDER BY a.id ASC")
    List<String> findDistinctDoctorNamesByDate(LocalDate date);
}
