package edu.cit.dibdib.ClinicCare.features.appointments;

import edu.cit.dibdib.ClinicCare.features.users.Doctor;
import edu.cit.dibdib.ClinicCare.features.appointments.Slot;
import edu.cit.dibdib.ClinicCare.features.users.DoctorRepository;
import edu.cit.dibdib.ClinicCare.features.appointments.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class SlotController {

    @Autowired
    private SlotRepository slotRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping
    public List<Slot> getAllSlots() {
        List<Slot> slots = slotRepository.findAll();
        // Dynamic correction: Update booked count based on real non-cancelled appointments
        for (Slot slot : slots) {
            try {
                java.time.LocalDate date = java.time.LocalDate.parse(slot.getDate());
                String timeRange = formatSlotTime(slot.getStartTime()) + " – " + formatSlotTime(slot.getEndTime());
                long count = appointmentRepository.countActiveAppointments(slot.getDoctor(), date, timeRange);
                slot.setBooked((int)count);
            } catch (Exception e) {
                // Skip if date format is invalid or other error
                System.out.println("Error calculating booked count for slot: " + e.getMessage());
            }
        }
        return slots;
    }

    private String formatSlotTime(String t) {
        if (t == null || !t.contains(":")) return t;
        try {
            String[] parts = t.split(":");
            int h = Integer.parseInt(parts[0]);
            int m = Integer.parseInt(parts[1]);
            String ampm = h >= 12 ? "PM" : "AM";
            int hr = h % 12;
            if (hr == 0) hr = 12;
            return hr + ":" + String.format("%02d", m) + " " + ampm;
        } catch (Exception e) {
            return t;
        }
    }

    @PostMapping
    @Transactional
    public Slot createSlot(@RequestBody Slot slot) {
        return slotRepository.save(slot);
    }

    @PostMapping("/batch")
    @Transactional
    public List<Slot> createSlotsBatch(@RequestBody List<Slot> slots) {
        if (!slots.isEmpty()) {
            String doctorName = slots.get(0).getDoctor();
            doctorRepository.findByDoctorName(doctorName).orElseGet(() -> {
                long count = doctorRepository.count();
                char prefix = (char) ('A' + (int) count); // Assign letter based on current count
                Doctor newDoctor = new Doctor(null, doctorName, String.valueOf(prefix));
                return doctorRepository.save(newDoctor);
            });
        }
        return slotRepository.saveAll(slots);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Slot> updateSlot(@PathVariable Long id, @RequestBody Slot slotDetails) {
        return slotRepository.findById(id)
                .map(slot -> {
                    slot.setDoctor(slotDetails.getDoctor());
                    slot.setDate(slotDetails.getDate());
                    slot.setStartTime(slotDetails.getStartTime());
                    slot.setEndTime(slotDetails.getEndTime());
                    slot.setCapacity(slotDetails.getCapacity());
                    slot.setDisabled(slotDetails.isDisabled());
                    slot.setBooked(slotDetails.getBooked());
                    return ResponseEntity.ok(slotRepository.save(slot));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        return slotRepository.findById(id)
                .map(slot -> {
                    slotRepository.delete(slot);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
