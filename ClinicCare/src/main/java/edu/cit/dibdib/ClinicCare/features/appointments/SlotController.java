package edu.cit.dibdib.ClinicCare.features.appointments;

import edu.cit.dibdib.ClinicCare.features.users.Doctor;
import edu.cit.dibdib.ClinicCare.features.appointments.Slot;
import edu.cit.dibdib.ClinicCare.features.users.DoctorRepository;
import edu.cit.dibdib.ClinicCare.features.appointments.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class SlotController {

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping
    public List<Slot> getAllSlots() {
        return slotRepository.findAll();
    }

    @PostMapping
    public Slot createSlot(@RequestBody Slot slot) {
        return slotRepository.save(slot);
    }

    @PostMapping("/batch")
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
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        return slotRepository.findById(id)
                .map(slot -> {
                    slotRepository.delete(slot);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
