package edu.cit.dibdib.ClinicCare.features.appointments;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String doctor;

    @Column(nullable = false)
    private String date; // Using String for simplicity in matching frontend format

    @Column(name = "start_time", nullable = false)
    private String startTime;

    @Column(name = "end_time", nullable = false)
    private String endTime;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false)
    private int booked = 0;

    @Column(nullable = false)
    private boolean disabled = false;
}
