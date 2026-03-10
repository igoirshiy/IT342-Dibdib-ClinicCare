import React, { useState, useEffect } from "react";
import { CalendarCheck } from "lucide-react";
import StaffAppointmentItem from "./StaffAppointmentItem";
import "./StaffAppointments.css";

const StaffAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/appointments/all");
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );

    // Also update on backend
    fetch(`http://127.0.0.1:8080/api/appointments/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStatus),
    }).catch((error) => console.error("Error updating status:", error));
  };

  const notifyPatient = (patient) => {
    alert(`📩 Notification sent to ${patient}: Your appointment has been updated.`);
  };

  if (loading) {
    return <div className="staff-appt-card glass-card">Loading appointments...</div>;
  }

  return (
    <div className="staff-appt-card glass-card">
      <div className="card-header">
        <CalendarCheck size={22} />
        <h3>Today's Appointments</h3>
        <span className="staff-appt-count">{appointments.length}</span>
      </div>
      <div className="staff-appt-scroll">
        {appointments.length === 0 ? (
          <p style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>
            No appointments found
          </p>
        ) : (
          appointments.map((appt) => (
            <StaffAppointmentItem
              key={appt.id}
              appointment={appt}
              onUpdateStatus={updateStatus}
              onNotify={notifyPatient}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default StaffAppointmentList;
