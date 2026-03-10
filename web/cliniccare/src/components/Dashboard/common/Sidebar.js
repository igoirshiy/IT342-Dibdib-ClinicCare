import React, { useState } from "react";
import "./Sidebar.css";
import {
    LayoutDashboard,
    CalendarPlus,
    CalendarCheck,
    Users,
    LogOut,
    Menu,
    X,
    Activity,
    Stethoscope,
} from "lucide-react";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
    { icon: CalendarPlus, label: "Book Appointment", key: "book" },
    { icon: CalendarCheck, label: "My Appointments", key: "appointments" },
    { icon: Users, label: "Queue Status", key: "queue" },
    { icon: Stethoscope, label: "Staff View", key: "staff" },
];

const Sidebar = ({ activeKey, onNavigate, onLogout, userRole }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const filteredNavItems = navItems.filter(item => {
        if (userRole === 'STAFF') {
            return item.key === 'staff' || item.key === 'dashboard' || item.key === 'profile';
        }
        return item.key !== 'staff';
    });

    return (
        <>
            <button
                className="sidebar-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle sidebar"
            >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {mobileOpen && (
                <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
            )}

            <aside className={`sidebar ${mobileOpen ? "sidebar--open" : ""}`}>
                <div className="sidebar-logo">
                    <Activity size={28} className="sidebar-logo-icon" />
                    <span>ClinicCare</span>
                </div>

                <nav className="sidebar-nav">
                    {filteredNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.key}
                                className={`sidebar-nav-item ${activeKey === item.key ? "sidebar-nav-item--active" : ""}`}
                                onClick={() => {
                                    onNavigate(item.key);
                                    setMobileOpen(false);
                                }}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <button className="sidebar-nav-item sidebar-logout" onClick={onLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>
        </>
    );
};

export default Sidebar;
