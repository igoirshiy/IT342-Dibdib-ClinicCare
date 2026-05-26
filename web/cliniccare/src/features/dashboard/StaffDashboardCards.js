import React, { useState, useEffect } from "react";
import { Users, Calendar, CheckCircle, XCircle, Clock, Stethoscope } from "lucide-react";
import './StaffDashboardCards.css';

const StaffDashboardCards = ({ refreshTrigger }) => {
    const [stats, setStats] = useState({
        totalToday: 0,
        waitingToday: 0,
        servingToday: 0,
        completedToday: 0,
        cancelledToday: 0,
        totalPatients: 0,
        activeSlots: 0
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const response = await fetch((process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + "") + '/api/appointments/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Error fetching staff stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Refresh stats periodically
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, [refreshTrigger]);

    const statCards = [
        {
            title: "Today's Appointments",
            value: stats.totalToday,
            icon: Calendar,
            color: "#3b82f6",
            bgColor: "rgba(59, 130, 246, 0.1)",
            label: "Total scheduled"
        },
        {
            title: "Waiting",
            value: stats.waitingToday,
            icon: Clock,
            color: "#f59e0b",
            bgColor: "rgba(245, 158, 11, 0.1)",
            label: "Patients in queue"
        },
        {
            title: "Completed",
            value: stats.completedToday,
            icon: CheckCircle,
            color: "#10b981",
            bgColor: "rgba(16, 185, 129, 0.1)",
            label: "Patients seen today"
        },
        {
            title: "Total Patients",
            value: stats.totalPatients,
            icon: Users,
            color: "#8b5cf6",
            bgColor: "rgba(139, 92, 246, 0.1)",
            label: "Registered in system"
        }
    ];

    return (
        <div className="staff-dashboard-cards">
            {statCards.map((card, index) => (
                <div key={index} className="staff-stat-card glass-card">
                    <div className="stat-card-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
                        <card.icon size={24} />
                    </div>
                    <div className="stat-card-info">
                        <h3>{card.value}</h3>
                        <p className="stat-card-title">{card.title}</p>
                        <p className="stat-card-label">{card.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StaffDashboardCards;
