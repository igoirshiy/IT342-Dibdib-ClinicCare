package edu.cit.dibdib.ClinicCare.features.users;

public interface BaseUser {
    Long getId();
    String getFullName();
    String getEmail();
    String getPassword();
    String getRole();
    void setRole(String role);
    
    Integer getAge();
    void setAge(Integer age);
    String getGender();
    void setGender(String gender);
}
