package edu.cit.dibdib.cliniccare.models;

public class Appointment {
    private Long id;
    private String patientEmail;
    private String patientName;
    private String doctorName;
    private String consultationType;
    private String appointmentDate;
    private String timeSlot;
    private String reason;
    private String status;
    private String queueNumber;
    private Long selectedSlotId; // Important for backend capacity calculation

    // Getters
    public Long getId() { return id; }
    public String getPatientEmail() { return patientEmail; }
    public String getPatientName() { return patientName; }
    public String getDoctorName() { return doctorName; }
    public String getConsultationType() { return consultationType; }
    public String getAppointmentDate() { return appointmentDate; }
    public String getTimeSlot() { return timeSlot; }
    public String getReason() { return reason; }
    public String getStatus() { return status; }
    public String getQueueNumber() { return queueNumber; }
    public Long getSelectedSlotId() { return selectedSlotId; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public void setConsultationType(String consultationType) { this.consultationType = consultationType; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
    public void setReason(String reason) { this.reason = reason; }
    public void setStatus(String status) { this.status = status; }
    public void setQueueNumber(String queueNumber) { this.queueNumber = queueNumber; }
    public void setSelectedSlotId(Long selectedSlotId) { this.selectedSlotId = selectedSlotId; }
}
