package edu.cit.dibdib.ClinicCare.features.users;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "doctor_name", nullable = false, unique = true)
    private String doctorName;

    @Column(name = "queue_letter", nullable = false, length = 2)
    private String queueLetter;
}
