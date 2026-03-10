import React from "react";
import StaffHeader from "./StaffHeader";
import StaffAppointmentList from "./StaffAppointmentList";
import SlotManager from "../patient/SlotManager";
import "./StaffDashboard.css";

const StaffDashboard = () => {
  return (
    <div className="staff-dashboard-wrapper">
      <StaffHeader />
      <div className="staff-grid">
        <StaffAppointmentList />
        <SlotManager />
      </div>
    </div>
  );
};

export default StaffDashboard;
