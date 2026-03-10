import React, { useState, useEffect } from "react";
import "./DashboardCards.css";
import { Calendar, Clock, Users, CalendarPlus, CalendarCheck } from "lucide-react";

const DashboardCards = ({ onBookClick, user }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserAppointments = async () => {
        if (!user?.email) return;
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/appointments/patient/${user.email}`);
            if (response.ok) {
                const data = await response.json();
                const sorted = data.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
                setAppointments(sorted);
            }
        } catch (error) {
            console.error("Error fetching patient appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserAppointments();
    }, [user]);

    const latest = appointments.find(a => a.status !== "Completed" && a.status !== "Cancelled") || appointments[0];

    return (
        <div className="dashboard-cards">
            {/* Upcoming Appointment */}
            <div className="glass-card">
                <div className="card-header">
                    <Calendar size={22} />
                    <h3>Upcoming Appointment</h3>
                </div>
                {latest ? (
                    <div className="card-body">
                        <div className="card-detail">
                            <span className="card-label">Doctor</span>
                            <span className="card-value">{latest.doctorName}</span>
                        </div>
                        <div className="card-detail">
                            <span className="card-label">Date</span>
                            <span className="card-value">{latest.appointmentDate}</span>
                        </div>
                        <div className="card-detail">
                            <span className="card-label">Time</span>
                            <span className="card-value">{latest.timeSlot}</span>
                        </div>
                        <div className="card-detail">
                            <span className="card-label">Status</span>
                            <span className={`status-badge status-${latest.status.toLowerCase()}`}>{latest.status}</span>
                        </div>
                    </div>
                ) : (
                    <div className="card-body">
                        <p className="no-data-text">No upcoming appointments.</p>
                    </div>
                )}
            </div>

            {/* Queue Status */}
            <div className="glass-card">
                <div className="card-header">
                    <Users size={22} />
                    <h3>Queue Status</h3>
                </div>
                {latest && latest.status !== "Completed" ? (
                    <div className="card-body card-body--queue">
                        <div className="queue-item">
                            <span className="queue-label">Your Number</span>
                            <span className="queue-number">{latest.queueNumber}</span>
                        </div>
                        <div className="queue-divider" />
                        <div className="queue-item">
                            <span className="queue-label">Status</span>
                            <span className={`queue-number queue-number--${latest.status.toLowerCase()}`}>{latest.status}</span>
                        </div>
                        <div className="queue-wait">
                            <Clock size={16} />
                            <span>Please wait for your turn.</span>
                        </div>
                    </div>
                ) : (
                    <div className="card-body card-body--queue">
                        <p className="no-data-text">Not currently in queue.</p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="glass-card">
                <div className="card-header">
                    <CalendarPlus size={22} />
                    <h3>Quick Actions</h3>
                </div>
                <div className="card-body card-body--actions">
                    <button className="action-btn action-btn--primary" onClick={onBookClick}>
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
