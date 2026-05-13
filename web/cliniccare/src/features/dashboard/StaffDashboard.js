import React from "react";
import StaffHeader from './StaffHeader';
import StaffAppointmentList from '../appointments/StaffAppointmentList';
import SlotManager from '../appointments/SlotManager';
import DoctorScheduleList from '../appointments/DoctorScheduleList';
import StaffDashboardCards from './StaffDashboardCards';
import './StaffDashboard.css';

const StaffDashboard = () => {
  return (
    <div className="staff-dashboard-wrapper">
      <StaffHeader />
      <div style={{ marginBottom: '20px' }}>
        <StaffDashboardCards />
      </div>
      <div className="staff-grid">
        <StaffAppointmentList />
        <SlotManager />
        <DoctorScheduleList />
      </div>
    </div>
  );
};

export default StaffDashboard;
