package edu.cit.dibdib.cliniccare.models;

import java.util.UUID;

public class Habit {
    private String id;
    private String title;
    private String description;
    private boolean isChecked;

    public Habit() {
        this.id = UUID.randomUUID().toString();
    }

    public Habit(String title, String description, boolean isChecked) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.description = description;
        this.isChecked = isChecked;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isChecked() { return isChecked; }
    public void setChecked(boolean checked) { isChecked = checked; }
}
