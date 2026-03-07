import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardCards from "./DashboardCards";
import NotificationCenter from "./NotificationCenter";
import StaffDashboard from "./StaffDashboard";
import BookingModal from "./BookingModal";
import "./Dashboard.css";

const Dashboard = ({ onLogout, userRole, user }) => {
    const [activeKey, setActiveKey] = useState(userRole === 'STAFF' ? 'staff' : 'dashboard');
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    return (
        <div className="dashboard-layout">
            <Sidebar
                activeKey={activeKey}
                onNavigate={setActiveKey}
                onLogout={onLogout}
                userRole={userRole}
            />
            <main className="dashboard-main">
                <Header />
                <div className="dashboard-content">
                    {activeKey === "dashboard" && userRole !== 'STAFF' && (
                        <>
                            <DashboardCards onBookClick={() => setIsBookingOpen(true)} user={user} />
                            <NotificationCenter />
                        </>
                    )}
                    {activeKey === "staff" && userRole === 'STAFF' && <StaffDashboard />}
                    {activeKey === "dashboard" && userRole === 'STAFF' && (
                        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                            <h3>Welcome, Staff</h3>
                            <p style={{ marginTop: '20px', color: '#64748b' }}>
                                Please use the Sidebar to navigate to the Staff View.
                            </p>
                        </div>
                    )}
                    {activeKey !== "dashboard" && activeKey !== "staff" && (
                        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                            <h3>{activeKey.charAt(0).toUpperCase() + activeKey.slice(1)} Section</h3>
                            <p style={{ marginTop: '20px', color: '#64748b' }}>
                                This section is currently under development.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                user={user}
            />
        </div>
    );
};

export default Dashboard;
