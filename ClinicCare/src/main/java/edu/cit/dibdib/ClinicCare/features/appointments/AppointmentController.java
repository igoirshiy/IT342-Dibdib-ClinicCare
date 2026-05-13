package edu.cit.dibdib.ClinicCare.features.appointments;

import edu.cit.dibdib.ClinicCare.features.appointments.Appointment;
import edu.cit.dibdib.ClinicCare.features.appointments.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    private BookingFacade bookingFacade;

    @Autowired
    private edu.cit.dibdib.ClinicCare.features.users.UserRepository userRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private edu.cit.dibdib.ClinicCare.features.notifications.NotificationAdapter notificationAdapter;

    @GetMapping("/patient/{email}")
    @Transactional(readOnly = true)
    public List<Appointment> getPatientAppointments(@PathVariable String email) {
        return appointmentRepository.findByPatientEmail(email);
    }

    @GetMapping("/all")
    @Transactional(readOnly = true)
    public List<Appointment> getAllAppointments() {
        System.out.println("Fetching ALL appointments...");
        List<Appointment> all = appointmentRepository.findAll();
        System.out.println("Found " + all.size() + " total appointments.");
        return all;
    }

    @GetMapping("/today")
    @Transactional(readOnly = true)
    public List<Appointment> getTodayAppointments() {
        LocalDate today = LocalDate.now();
        System.out.println("Fetching appointments for today: " + today);
        List<Appointment> apps = appointmentRepository.findByAppointmentDateOrderByTimeSlotAsc(today);
        System.out.println("Found " + apps.size() + " appointments.");
        return apps;
    }

    @GetMapping("/stats")
    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats() {
        LocalDate today = LocalDate.now();
        DashboardStats stats = new DashboardStats();
        
        stats.setTotalToday(appointmentRepository.countByAppointmentDate(today));
        stats.setWaitingToday(appointmentRepository.countByAppointmentDateAndStatus(today, "Waiting"));
        stats.setServingToday(appointmentRepository.countByAppointmentDateAndStatus(today, "Serving"));
        stats.setCompletedToday(appointmentRepository.countByAppointmentDateAndStatus(today, "Completed"));
        stats.setCancelledToday(appointmentRepository.countByAppointmentDateAndStatus(today, "Cancelled"));
        
        stats.setTotalPatients(userRepository.count());
        stats.setActiveSlots(slotRepository.count());
        
        return stats;
    }

    @PostMapping("/book")
    @Transactional
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        System.out.println("Booking via Facade: " + appointment);
        try {
            Appointment savedApp = bookingFacade.book(appointment);
            return ResponseEntity.ok(savedApp);
        } catch (Exception e) {
            System.out.println("Error booking: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error booking appointment: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    @Transactional
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody String status) {
        return appointmentRepository.findById(id)
                .map(app -> {
                    app.setStatus(status.replace("\"", "")); // Remove quotes if any
                    appointmentRepository.save(app);
                    
                    // Broadcast update to all clients via Adapter
                    System.out.println("Broadcasting 'updated' message to /topic/appointments for app: " + id);
                    notificationAdapter.sendNotification("/topic/appointments", "updated");
                    
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
