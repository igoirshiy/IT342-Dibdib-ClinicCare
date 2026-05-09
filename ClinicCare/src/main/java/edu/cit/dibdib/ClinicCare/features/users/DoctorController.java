package edu.cit.dibdib.ClinicCare.features.users;

import edu.cit.dibdib.ClinicCare.features.users.Doctor;
import edu.cit.dibdib.ClinicCare.features.appointments.Slot;
import edu.cit.dibdib.ClinicCare.features.appointments.Appointment;
import edu.cit.dibdib.ClinicCare.features.users.DoctorRepository;
import edu.cit.dibdib.ClinicCare.features.appointments.SlotRepository;
import edu.cit.dibdib.ClinicCare.features.appointments.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @PostMapping("/sync")
    public String syncLegacyDoctors() {
        // 1. Get all unique doctor names from Slots
        Set<String> doctorNames = slotRepository.findAll().stream()
                .map(Slot::getDoctor)
                .collect(Collectors.toSet());

        // 2. Get all unique doctor names from Appointments
        doctorNames.addAll(appointmentRepository.findAll().stream()
                .map(Appointment::getDoctorName)
                .collect(Collectors.toSet()));

        int createdCount = 0;
        for (String name : doctorNames) {
            if (name != null && !name.isEmpty() && doctorRepository.findByDoctorName(name).isEmpty()) {
                long count = doctorRepository.count();
                char prefix = (char) ('A' + (int) count);
                Doctor newDoctor = new Doctor(null, name, String.valueOf(prefix));
                doctorRepository.save(newDoctor);
                createdCount++;
            }
        }

        return "Sync complete. Created " + createdCount + " new doctor records.";
    }
}
