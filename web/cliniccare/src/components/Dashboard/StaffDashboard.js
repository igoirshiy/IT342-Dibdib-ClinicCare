import React, { useState } from "react";
import {
    Users,
    Clock,
    CheckCircle2,
    Calendar,
    ChevronDown,
    Bell,
    Edit2,
    Slash
} from "lucide-react";
import { initialAppointments, initialDoctorSlots } from "./staffData";
import "./StaffDashboard.css";

const StaffDashboard = () => {
    const [appointments] = useState(initialAppointments);
    const [slots] = useState(initialDoctorSlots);

    const stats = [
        { label: "Total Patients", value: "6", icon: Users, color: "#0d9488" },
        { label: "Waiting", value: "3", icon: Clock, color: "#ca8a04" },
        { label: "Serving", value: "1", icon: Clock, color: "#3b82f6" },
        { label: "Completed", value: "1", icon: CheckCircle2, color: "#16a34a" },
    ];

    const getStatusType = (status) => {
        switch (status) {
            case "Waiting": return "waiting";
            case "Serving": return "serving";
            case "Completed": return "completed";
            case "Cancelled": return "cancelled";
            default: return "default";
        }
    };

    return (
        <div className="staff-container animate-fade-in">
            {/* Staff Header */}
            <header className="staff-header-top">
                <div className="staff-brand">
                    <h1>ClinicCare</h1>
                    <p>Staff Dashboard</p>
                </div>
                <div className="staff-profile-chip">
                    <div className="staff-avatar">SC</div>
                    <div className="staff-info">
                        <p className="staff-name">Staff Coordinator</p>
                        <p className="staff-role">Front Desk</p>
                    </div>
                </div>
            </header>

            {/* Stats Row */}
            <div className="staff-stats-row">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon-wrapper" style={{ color: stat.color, backgroundColor: `${stat.color}15` }}>
                            <stat.icon size={20} />
                        </div>
                        <div className="stat-content">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="staff-main-content">
                {/* Left Column: Appointments */}
                <div className="staff-col-left">
                    <div className="appointments-section glass-panel">
                        <div className="section-header">
                            <div className="section-title">
                                <Calendar size={20} className="text-teal" />
                                <h2>Today's Appointments</h2>
                            </div>
                            <div className="date-picker-mock">
                                <span>03/07/2026</span>
                                <Calendar size={16} />
                            </div>
                        </div>

                        <div className="status-filters">
                            <span className="filter-chip waiting">Waiting: 3</span>
                            <span className="filter-chip serving">Serving: 1</span>
                            <span className="filter-chip completed">Completed: 1</span>
                            <span className="filter-chip cancelled">Cancelled: 1</span>
                        </div>

                        <div className="appointments-list">
                            {appointments.slice(0, 4).map((app) => (
                                <div key={app.id} className="appointment-item">
                                    <div className="app-q-badge">{app.queueNumber}</div>
                                    <div className="app-main-info">
                                        <div className="app-name-row">
                                            <h3>{app.patientName}</h3>
                                            <span className={`status-tag ${getStatusType(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <div className="app-details-row">
                                            <div className="app-detail">
                                                <Slash size={14} className="rotate-45" />
                                                <span>{app.consultationType}</span>
                                            </div>
                                            <div className="app-detail">
                                                <Clock size={14} />
                                                <span>{app.dateTime.split(" ")[1]}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="app-actions">
                                        <button className="btn-text">Update Status <ChevronDown size={14} /></button>
                                        <button className="btn-notify"><Bell size={14} /> Notify</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Slot Management */}
                <div className="staff-col-right">
                    <div className="management-section glass-panel">
                        <div className="section-header">
                            <div className="section-title">
                                <Clock size={20} className="text-teal" />
                                <h2>Slot / Schedule Management</h2>
                            </div>
                        </div>

                        <div className="slots-list">
                            {slots.slice(0, 3).map((slot) => (
                                <div key={slot.id} className="slot-item">
                                    <div className="slot-header">
                                        <div className="slot-doc-info">
                                            <h3>{slot.doctorName}</h3>
                                            <p>{slot.specialty}</p>
                                        </div>
                                        <div className="slot-quick-actions">
                                            <button className="btn-icon-label"><Edit2 size={14} /> Edit</button>
                                            <button className="btn-icon-label text-red"><Slash size={14} /> Disable</button>
                                        </div>
                                    </div>
                                    <div className="slot-time">
                                        <Clock size={14} />
                                        <span>{slot.startTime} - {slot.endTime}</span>
                                    </div>
                                    <div className="slot-progress-container">
                                        <div className="slot-usage-row">
                                            <span className="usage-text">{slot.bookedSlots}/{slot.totalSlots} slots booked</span>
                                            <span className="usage-percent">{Math.round((slot.bookedSlots / slot.totalSlots) * 100)}%</span>
                                        </div>
                                        <div className="progress-bar-bg">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${(slot.bookedSlots / slot.totalSlots) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
