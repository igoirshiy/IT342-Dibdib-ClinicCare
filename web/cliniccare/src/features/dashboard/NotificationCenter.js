import React, { useState, useEffect } from "react";
import { Bell, Calendar, Info, CheckCircle } from "lucide-react";
import NotificationItem from './NotificationItem';
import './NotificationCenter.css';

const NotificationCenter = ({ isDropdown, onClose, user, onUnreadCount }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        const fetchRealNotifications = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8080/api/appointments/patient/${user.email}`);
                if (response.ok) {
                    const appointments = await response.json();
                    
                    // Generate dynamic notifications from appointments
                    const dynamicNotifs = appointments
                        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
                        .map((app, index) => {
                            const isToday = app.appointmentDate === new Date().toISOString().split('T')[0];
                            
                            return {
                                id: app.id,
                                title: isToday ? "Appointment Today!" : "Upcoming Appointment",
                                message: `You have a ${app.consultationType} with Doc ${app.doctorName} at ${app.timeSlot} on ${app.appointmentDate}.`,
                                time: isToday ? "Today" : app.appointmentDate,
                                type: app.status === "Completed" ? "update" : "reminder",
                                read: index > 2 // Assume older ones are read
                            };
                        });

                    // Add a welcome notification
                    dynamicNotifs.push({
                        id: 'welcome',
                        title: 'Welcome to ClinicCare',
                        message: 'Manage your health and book appointments easily through our portal.',
                        time: 'System',
                        type: 'info',
                        read: true
                    });

                    setNotifications(dynamicNotifs);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRealNotifications();
    }, [user]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    useEffect(() => {
        if (onUnreadCount) onUnreadCount(unreadCount);
    }, [unreadCount, onUnreadCount]);

    return (
        <div className={`notification-center ${isDropdown ? 'dropdown-mode' : 'glass-card'}`}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bell size={20} />
                    <h3>Notifications</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {unreadCount > 0 && (
                        <span className="notif-badge">{unreadCount} New</span>
                    )}
                    {isDropdown && (
                        <button className="notif-close-btn" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>×</button>
                    )}
                </div>
            </div>
            <div className="notif-scroll">
                {loading ? (
                    <p style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>Loading...</p>
                ) : notifications.length === 0 ? (
                    <p style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No notifications</p>
                ) : (
                    notifications.map((notif) => (
                        <NotificationItem key={notif.id} notification={notif} />
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationCenter;
