import React, { useState } from "react";
import { Bell } from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import './Header.css';

const StaffHeader = () => {
  return (
    <header className="header" style={{ position: 'relative' }}>
      <div className="header-welcome">
        <h2>Staff Dashboard</h2>
        <p className="header-subtitle">Manage appointments & schedules</p>
      </div>
      <div className="header-actions">
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
