package edu.cit.dibdib.ClinicCare.features.appointments;

public class DashboardStats {
    private long totalToday;
    private long waitingToday;
    private long servingToday;
    private long completedToday;
    private long cancelledToday;
    private long totalPatients;
    private long activeSlots;

    public DashboardStats() {}

    public DashboardStats(long totalToday, long waitingToday, long servingToday, long completedToday, long cancelledToday, long totalPatients, long activeSlots) {
        this.totalToday = totalToday;
        this.waitingToday = waitingToday;
        this.servingToday = servingToday;
        this.completedToday = completedToday;
        this.cancelledToday = cancelledToday;
        this.totalPatients = totalPatients;
        this.activeSlots = activeSlots;
    }

    // Getters and Setters
    public long getTotalToday() { return totalToday; }
    public void setTotalToday(long totalToday) { this.totalToday = totalToday; }

    public long getWaitingToday() { return waitingToday; }
    public void setWaitingToday(long waitingToday) { this.waitingToday = waitingToday; }

    public long getServingToday() { return servingToday; }
    public void setServingToday(long servingToday) { this.servingToday = servingToday; }

    public long getCompletedToday() { return completedToday; }
    public void setCompletedToday(long completedToday) { this.completedToday = completedToday; }

    public long getCancelledToday() { return cancelledToday; }
    public void setCancelledToday(long cancelledToday) { this.cancelledToday = cancelledToday; }

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }

    public long getActiveSlots() { return activeSlots; }
    public void setActiveSlots(long activeSlots) { this.activeSlots = activeSlots; }
}
