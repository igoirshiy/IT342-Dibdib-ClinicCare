package edu.cit.dibdib.ClinicCare.model;

public interface BaseUser {
    Long getId();
    String getFullName();
    String getEmail();
    String getPassword();
    String getRole();
    void setRole(String role);
}
