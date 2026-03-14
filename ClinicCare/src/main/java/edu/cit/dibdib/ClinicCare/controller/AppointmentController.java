package edu.cit.dibdib.ClinicCare.controller;

import edu.cit.dibdib.ClinicCare.model.Appointment;
import edu.cit.dibdib.ClinicCare.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private edu.cit.dibdib.ClinicCare.repository.DoctorRepository doctorRepository;

    @Autowired
    private edu.cit.dibdib.ClinicCare.repository.SlotRepository slotRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/patient/{email}")
    public List<Appointment> getPatientAppointments(@PathVariable String email) {
        return appointmentRepository.findByPatientEmail(email);
    }

    @GetMapping("/all")
    public List<Appointment> getAllAppointments() {
        System.out.println("Fetching ALL appointments...");
        List<Appointment> all = appointmentRepository.findAll();
        System.out.println("Found " + all.size() + " total appointments.");
        return all;
    }

    @GetMapping("/today")
    public List<Appointment> getTodayAppointments() {
        LocalDate today = LocalDate.now();
        System.out.println("Fetching appointments for today: " + today);
        List<Appointment> apps = appointmentRepository.findByAppointmentDateOrderByTimeSlotAsc(today);
        System.out.println("Found " + apps.size() + " appointments.");
        return apps;
    }

    @PostMapping("/book")
    @Transactional
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        System.out.println("Booking appointment: " + appointment);
        try {
            LocalDate date = appointment.getAppointmentDate();
            String docName = appointment.getDoctorName();
            
            // 1. Get permanent doctor prefix from Doctor table
            String prefix = "X"; // Default fallback
            java.util.Optional<edu.cit.dibdib.ClinicCare.model.Doctor> docOpt = doctorRepository.findByDoctorName(docName);
            if(docOpt.isPresent()) {
                prefix = docOpt.get().getQueueLetter();
            } else {
                // Should theoretically never happen as we auto-create on batch slot creation
                long count = doctorRepository.count();
                char newPrefix = (char) ('A' + (int) count); 
                edu.cit.dibdib.ClinicCare.model.Doctor newDoctor = new edu.cit.dibdib.ClinicCare.model.Doctor(null, docName, String.valueOf(newPrefix));
                doctorRepository.save(newDoctor);
                prefix = String.valueOf(newPrefix);
            }
            
            // 2. Count existing appointments for THIS doctor on THIS date
            long docAppointmentCount = appointmentRepository.countByAppointmentDateAndDoctorName(date, docName);
            
            // 3. Set the queue number (e.g., A1, B2)
            appointment.setQueueNumber("" + prefix + (docAppointmentCount + 1));
            
            Appointment savedApp = appointmentRepository.saveAndFlush(appointment);
            System.out.println("Appointment saved with queue " + savedApp.getQueueNumber());
            
            // 4. Update Slot capacity
            boolean updated = false;
            
            // Try ID-based lookup first (Most robust)
            if (appointment.getSelectedSlotId() != null) {
                System.out.println("[SLOT_DEBUG] Attempting ID-based lookup for Slot ID: " + appointment.getSelectedSlotId());
                java.util.Optional<edu.cit.dibdib.ClinicCare.model.Slot> slotOpt = slotRepository.findById(appointment.getSelectedSlotId());
                if (slotOpt.isPresent()) {
                    edu.cit.dibdib.ClinicCare.model.Slot slot = slotOpt.get();
                    if (slot.getBooked() < slot.getCapacity()) {
                        int oldBooked = slot.getBooked();
                        slot.setBooked(oldBooked + 1);
                        slotRepository.saveAndFlush(slot);
                        System.out.println("[SLOT_DEBUG] SUCCESS (ID-based)! Updated slot ID " + slot.getId() + " from " + oldBooked + " to " + slot.getBooked());
                        updated = true;
                    } else {
                        System.out.println("[SLOT_DEBUG] FAIL (ID-based): Slot is FULL.");
                        throw new RuntimeException("This time slot is already full.");
                    }
                } else {
                    System.out.println("[SLOT_DEBUG] WARNING: ID-based lookup failed. ID not found: " + appointment.getSelectedSlotId());
                }
            }

            // Fallback to refined string matching if ID lookup didn't happen or failed
            if (!updated) {
                System.out.println("[SLOT_DEBUG] Falling back to string-based lookup...");
                List<edu.cit.dibdib.ClinicCare.model.Slot> slots = slotRepository.findAll();
                String reqTimeNorm = appointment.getTimeSlot().replace(" ", "").replace("–", "-").replace("—", "-").toLowerCase();
                String reqDocNorm = docName.trim().toLowerCase();
                String reqDateNorm = date.toString();

                for (edu.cit.dibdib.ClinicCare.model.Slot slot : slots) {
                    String sDocNorm = slot.getDoctor().trim().toLowerCase();
                    String sDateNorm = slot.getDate().trim();
                    String sRange = formatSlotTime(slot.getStartTime()) + " – " + formatSlotTime(slot.getEndTime());
                    String sRangeNorm = sRange.replace(" ", "").replace("–", "-").replace("—", "-").toLowerCase();

                    if (sDocNorm.equals(reqDocNorm) && sDateNorm.equals(reqDateNorm) && sRangeNorm.equals(reqTimeNorm)) {
                        if (slot.getBooked() < slot.getCapacity()) {
                            int oldBooked = slot.getBooked();
                            slot.setBooked(oldBooked + 1);
                            slotRepository.saveAndFlush(slot);
                            System.out.println("[SLOT_DEBUG] SUCCESS (String-based)! Updated slot ID " + slot.getId() + " from " + oldBooked + " to " + slot.getBooked());
                            updated = true;
                        } else {
                            throw new RuntimeException("This time slot is already full.");
                        }
                        break;
                    }
                }
            }

            if (!updated) {
                System.out.println("[SLOT_DEBUG] SEVERE WARNING: Total failure to update slot capacity!");
            }

            // Broadcast update
            messagingTemplate.convertAndSend("/topic/appointments", "booked");
            messagingTemplate.convertAndSend("/topic/slots", "updated");
            
            return ResponseEntity.ok(savedApp);
        } catch (Exception e) {
            System.out.println("Error booking: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error booking appointment: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody String status) {
        return appointmentRepository.findById(id)
                .map(app -> {
                    app.setStatus(status.replace("\"", "")); // Remove quotes if any
                    appointmentRepository.save(app);
                    
                    // Broadcast update to all clients
                    System.out.println("Broadcasting 'updated' message to /topic/appointments for app: " + id);
                    messagingTemplate.convertAndSend("/topic/appointments", "updated");
                    
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
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
}
