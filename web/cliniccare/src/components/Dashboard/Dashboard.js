import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardCards from "./DashboardCards";
import "./Dashboard.css";

const Dashboard = ({ onLogout }) => {
    const [activeKey, setActiveKey] = useState("dashboard");

    return (
        <div className="dashboard-layout">
            <Sidebar
                activeKey={activeKey}
                onNavigate={setActiveKey}
                onLogout={onLogout}
            />
            <main className="dashboard-main">
                <Header />
                <div className="dashboard-content">
                    {activeKey === "dashboard" && <DashboardCards />}
                    {activeKey !== "dashboard" && (
                        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                            <h3>{activeKey.charAt(0).toUpperCase() + activeKey.slice(1)} Section</h3>
                            <p style={{ marginTop: '20px', color: '#64748b' }}>
                                This section is currently under development.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
