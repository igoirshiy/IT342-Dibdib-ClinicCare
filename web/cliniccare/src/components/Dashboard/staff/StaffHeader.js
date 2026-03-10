import React from "react";
import { Bell } from "lucide-react";
import "../patient/Header.css";

const StaffHeader = () => {
  return (
    <header className="header">
      <div className="header-welcome">
        <h2>Staff Dashboard</h2>
        <p className="header-subtitle">Manage appointments & schedules</p>
      </div>
      <div className="header-actions">
        <button className="header-notification" aria-label="Notifications">
          <Bell size={20} />
          <span className="header-notification-badge">5</span>
        </button>
        <div className="header-avatar">
          <span>S</span>
        </div>
        <span style={{ fontWeight: 600, color: "#1a3a5c", fontSize: "0.9rem" }}>
          Staff Maria
        </span>
      </div>
    </header>
  );
};

export default StaffHeader;
