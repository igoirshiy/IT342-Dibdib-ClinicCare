import React, { useState, useEffect } from "react";
import { CalendarCheck } from "lucide-react";
import StaffAppointmentItem from "./StaffAppointmentItem";
import "./StaffAppointments.css";

const StaffAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    fetchAppointments();

    // Set up polling for real-time updates every 10 seconds
    const interval = setInterval(fetchAppointments, 10000);
    return () => clearInterval(interval);
  }, [viewAll]);

  const fetchAppointments = async () => {
    try {
      const endpoint = viewAll ? "all" : "today";
      const response = await fetch(`http://127.0.0.1:8080/api/appointments/${endpoint}`);
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
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarCheck size={22} />
          <h3>{viewAll ? "All Appointments" : "Today's Appointments"}</h3>
          <span className="staff-appt-count">{appointments.length}</span>
        </div>
        <div className="view-toggle">
          <button
            className={`toggle-btn ${!viewAll ? 'active' : ''}`}
            onClick={() => setViewAll(false)}
            style={{ padding: '4px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', background: !viewAll ? '#3b82f6' : 'transparent', color: !viewAll ? 'white' : '#64748b', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Today
          </button>
          <button
            className={`toggle-btn ${viewAll ? 'active' : ''}`}
            onClick={() => setViewAll(true)}
            style={{ padding: '4px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', background: viewAll ? '#3b82f6' : 'transparent', color: viewAll ? 'white' : '#64748b', fontSize: '0.8rem', cursor: 'pointer', marginLeft: '4px' }}
          >
            All
          </button>
        </div>
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
