package edu.cit.dibdib.cliniccare.models;

public class Slot {
    private Long id;
    private String doctor;
    private String date;
    private String startTime;
    private String endTime;
    private int capacity;
    private int booked;
    private boolean disabled;

    // Getters
    public Long getId() { return id; }
    public String getDoctor() { return doctor; }
    public String getDate() { return date; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public int getCapacity() { return capacity; }
    public int getBooked() { return booked; }
    public boolean isDisabled() { return disabled; }

    @Override
    public String toString() {
        return date + " (" + startTime + "-" + endTime + ") : " + doctor;
    }
}
