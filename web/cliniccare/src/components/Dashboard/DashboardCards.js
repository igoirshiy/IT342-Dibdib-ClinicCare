import React from "react";
import "./DashboardCards.css";
import { Calendar, Clock, Users, CalendarPlus, CalendarCheck } from "lucide-react";

const DashboardCards = () => {
    return (
        <div className="dashboard-cards">
            {/* Upcoming Appointment */}
            <div className="glass-card">
                <div className="card-header">
                    <Calendar size={22} />
                    <h3>Upcoming Appointment</h3>
                </div>
                <div className="card-body">
                    <div className="card-detail">
                        <span className="card-label">Doctor</span>
                        <span className="card-value">Dr. Sarah Johnson</span>
                    </div>
                    <div className="card-detail">
                        <span className="card-label">Date</span>
                        <span className="card-value">March 12, 2026</span>
                    </div>
                    <div className="card-detail">
                        <span className="card-label">Time</span>
                        <span className="card-value">10:30 AM</span>
                    </div>
                    <div className="card-detail">
                        <span className="card-label">Status</span>
                        <span className="status-badge status-confirmed">Confirmed</span>
                    </div>
                </div>
            </div>

            {/* Queue Status */}
            <div className="glass-card">
                <div className="card-header">
                    <Users size={22} />
                    <h3>Queue Status</h3>
                </div>
                <div className="card-body card-body--queue">
                    <div className="queue-item">
                        <span className="queue-label">Your Number</span>
                        <span className="queue-number">Q12</span>
                    </div>
                    <div className="queue-divider" />
                    <div className="queue-item">
                        <span className="queue-label">Now Serving</span>
                        <span className="queue-number queue-number--serving">Q9</span>
                    </div>
                    <div className="queue-wait">
                        <Clock size={16} />
                        <span>Est. wait: <strong>~15 min</strong></span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card">
                <div className="card-header">
                    <CalendarPlus size={22} />
                    <h3>Quick Actions</h3>
                </div>
                <div className="card-body card-body--actions">
                    <button className="action-btn action-btn--primary">
                        <CalendarPlus size={18} />
                        Book New Appointment
                    </button>
                    <button className="action-btn action-btn--secondary">
                        <CalendarCheck size={18} />
                        View My Appointments
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardCards;
