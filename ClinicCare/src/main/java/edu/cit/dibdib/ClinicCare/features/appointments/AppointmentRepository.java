package edu.cit.dibdib.ClinicCare.features.appointments;

import edu.cit.dibdib.ClinicCare.features.appointments.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientEmail(String patientEmail);
    List<Appointment> findByAppointmentDateOrderByTimeSlotAsc(LocalDate date);
    long countByAppointmentDate(LocalDate date);
    long countByAppointmentDateAndStatus(LocalDate date, String status);
    long countByAppointmentDateAndDoctorName(LocalDate date, String doctorName);
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctorName = :doctorName AND a.appointmentDate = :date AND a.timeSlot = :timeSlot AND a.status <> 'Cancelled'")
    long countActiveAppointments(String doctorName, LocalDate date, String timeSlot);
    
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT a.doctorName FROM Appointment a WHERE a.appointmentDate = :date ORDER BY a.id ASC")
    List<String> findDistinctDoctorNamesByDate(LocalDate date);
}
