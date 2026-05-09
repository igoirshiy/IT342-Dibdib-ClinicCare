package edu.cit.dibdib.ClinicCare.features.appointments;

import edu.cit.dibdib.ClinicCare.features.appointments.Appointment;

public interface QueueStrategy {
    String generateQueueNumber(Appointment appointment);
}
