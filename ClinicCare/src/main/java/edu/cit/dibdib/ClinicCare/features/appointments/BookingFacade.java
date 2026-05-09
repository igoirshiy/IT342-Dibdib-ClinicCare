package edu.cit.dibdib.ClinicCare.features.appointments;

import edu.cit.dibdib.ClinicCare.features.appointments.Appointment;
import edu.cit.dibdib.ClinicCare.features.users.Doctor;
import edu.cit.dibdib.ClinicCare.features.appointments.Slot;
import edu.cit.dibdib.ClinicCare.features.appointments.AppointmentRepository;
import edu.cit.dibdib.ClinicCare.features.appointments.SlotRepository;
import edu.cit.dibdib.ClinicCare.features.notifications.NotificationAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingFacade {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private SlotRepository slotRepository;

    @Autowired
    private NotificationAdapter notificationAdapter;

    @Autowired
    private QueueStrategy queueStrategy;

    @Transactional
    public Appointment book(Appointment appointment) {
        LocalDate date = appointment.getAppointmentDate();
        String docName = appointment.getDoctorName();
        
        // 1 & 2. Calculate Queue Number using Strategy Pattern
        String queueNumber = queueStrategy.generateQueueNumber(appointment);
        appointment.setQueueNumber(queueNumber);
        
        // 3. Save Appointment
        Appointment savedApp = appointmentRepository.saveAndFlush(appointment);
        
        // 4. Update Slot Capacity
        updateSlotCapacity(appointment, date, docName);

        // 5. Broadcast Updates (Observer Pattern integration)
        broadcastUpdates();
        
        return savedApp;
    }

    private void updateSlotCapacity(Appointment appointment, LocalDate date, String docName) {
        boolean updated = false;

        // ID-based lookup
        if (appointment.getSelectedSlotId() != null) {
            Optional<Slot> slotOpt = slotRepository.findById(appointment.getSelectedSlotId());
            if (slotOpt.isPresent()) {
                Slot slot = slotOpt.get();
                if (slot.getBooked() < slot.getCapacity()) {
                    slot.setBooked(slot.getBooked() + 1);
                    slotRepository.saveAndFlush(slot);
                    updated = true;
                } else {
                    throw new RuntimeException("This time slot is already full.");
                }
            }
        }

        // String-based fallback
        if (!updated) {
            List<Slot> slots = slotRepository.findAll();
            String reqTimeNorm = normalize(appointment.getTimeSlot());
            String reqDocNorm = docName.trim().toLowerCase();
            String reqDateNorm = date.toString();

            for (Slot slot : slots) {
                String sDocNorm = slot.getDoctor().trim().toLowerCase();
                String sDateNorm = slot.getDate().trim();
                String sRange = formatSlotTime(slot.getStartTime()) + " – " + formatSlotTime(slot.getEndTime());
                String sRangeNorm = normalize(sRange);

                if (sDocNorm.equals(reqDocNorm) && sDateNorm.equals(reqDateNorm) && sRangeNorm.equals(reqTimeNorm)) {
                    if (slot.getBooked() < slot.getCapacity()) {
                        slot.setBooked(slot.getBooked() + 1);
                        slotRepository.saveAndFlush(slot);
                        updated = true;
                    } else {
                        throw new RuntimeException("This time slot is already full.");
                    }
                    break;
                }
            }
        }
    }

    private void broadcastUpdates() {
        notificationAdapter.sendNotification("/topic/appointments", "booked");
        notificationAdapter.sendNotification("/topic/slots", "updated");
    }

    private String normalize(String s) {
        return s.replace(" ", "").replace("–", "-").replace("—", "-").toLowerCase();
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
