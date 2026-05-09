package edu.cit.dibdib.ClinicCare.features.appointments;

import edu.cit.dibdib.ClinicCare.features.appointments.Appointment;
import edu.cit.dibdib.ClinicCare.features.users.Doctor;
import edu.cit.dibdib.ClinicCare.features.appointments.AppointmentRepository;
import edu.cit.dibdib.ClinicCare.features.users.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DoctorPrefixQueueStrategy implements QueueStrategy {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public String generateQueueNumber(Appointment appointment) {
        String docName = appointment.getDoctorName();
        String prefix = getDoctorPrefix(docName);
        long docAppointmentCount = appointmentRepository.countByAppointmentDateAndDoctorName(
                appointment.getAppointmentDate(), docName);
        return "" + prefix + (docAppointmentCount + 1);
    }

    private String getDoctorPrefix(String docName) {
        Optional<Doctor> docOpt = doctorRepository.findByDoctorName(docName);
        if (docOpt.isPresent()) {
            return docOpt.get().getQueueLetter();
        } else {
            long count = doctorRepository.count();
            char newPrefix = (char) ('A' + (int) count);
            Doctor newDoctor = new Doctor(null, docName, String.valueOf(newPrefix));
            doctorRepository.save(newDoctor);
            return String.valueOf(newPrefix);
        }
    }
}
