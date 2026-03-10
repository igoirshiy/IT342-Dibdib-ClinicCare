import React from "react";
import { Bell } from "lucide-react";
import NotificationItem from "./NotificationItem";
import "./NotificationCenter.css";

const notifications = [
    {
        id: 1,
        title: "Medication Reminder",
        message: "Time to take Amoxicillin 500mg — 1 capsule after lunch.",
        time: "10 min ago",
        type: "reminder",
        read: false,
    },
    {
        id: 2,
        title: "Appointment Tomorrow",
        message: "You have a dental cleaning with Dr. Reyes at 10:00 AM.",
        time: "1 hour ago",
        type: "alert",
        read: false,
    },
    {
        id: 3,
        title: "Lab Results Ready",
        message: "Your blood test results from March 3 are now available.",
        time: "3 hours ago",
        type: "update",
        read: false,
    },
    {
        id: 4,
        title: "Queue Update",
        message: "You are now Q3 in line for Dr. Santos. Estimated wait: 15 min.",
        time: "5 hours ago",
        type: "info",
        read: true,
    },
    {
        id: 5,
        title: "Prescription Refill",
        message: "Your Metformin prescription is due for refill on March 10.",
        time: "Yesterday",
        type: "reminder",
        read: true,
    },
    {
        id: 6,
        title: "Clinic Announcement",
        message: "ClinicCare will be closed on March 15 for a holiday.",
        time: "2 days ago",
        type: "info",
        read: true,
    },
];

const NotificationCenter = () => {
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="notif-card glass-card">
            <div className="card-header">
                <Bell size={22} />
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount}</span>
                )}
            </div>
            <div className="notif-scroll">
                {notifications.map((notif) => (
                    <NotificationItem key={notif.id} notification={notif} />
                ))}
            </div>
        </div>
    );
};

export default NotificationCenter;
