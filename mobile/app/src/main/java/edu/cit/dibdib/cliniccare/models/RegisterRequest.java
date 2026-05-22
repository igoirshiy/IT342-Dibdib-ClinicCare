package edu.cit.dibdib.cliniccare.models;

public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String role;
    private Integer age;
    private String gender;

    // Constructors
    public RegisterRequest() {}

    public RegisterRequest(String fullName, String email, String password, String role, Integer age, String gender) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.age = age;
        this.gender = gender;
    }

    // Getters and Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
}
