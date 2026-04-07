package edu.cit.dibdib.ClinicCare.service;

import edu.cit.dibdib.ClinicCare.model.Appointment;

public interface QueueStrategy {
    String generateQueueNumber(Appointment appointment);
}
