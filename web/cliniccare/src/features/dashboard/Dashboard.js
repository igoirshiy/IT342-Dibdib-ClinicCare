import React, { useState } from "react";
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardCards from './DashboardCards';
import NotificationCenter from './NotificationCenter';
import StaffDashboard from './StaffDashboard';
import BookingModal from '../appointments/BookingModal';
import BookingView from '../appointments/BookingView';
import AppointmentList from '../appointments/AppointmentList';
import QueueView from '../appointments/QueueView';
import './Dashboard.css';

const Dashboard = ({ onLogout, userRole, user }) => {
    const [activeKey, setActiveKey] = useState(userRole === 'STAFF' ? 'staff' : 'dashboard');
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleBookingSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const renderContent = () => {
        if (userRole === 'STAFF') {
            if (activeKey === 'staff') return <StaffDashboard />;
            return (
                <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                    <h3>Welcome, Staff</h3>
                    <p style={{ marginTop: '20px', color: '#64748b' }}>
                        Please use the Sidebar to navigate to the Staff View.
                    </p>
                </div>
            );
        }

        // Patient Views
        switch (activeKey) {
            case 'dashboard':
                return (
                    <>
                        <DashboardCards 
                            onBookClick={() => setIsBookingOpen(true)} 
                            user={user} 
                            refreshTrigger={refreshTrigger}
                        />
                        <NotificationCenter />
                    </>
                );
            case 'book':
                return <BookingView user={user} onBookingSuccess={handleBookingSuccess} />;
            case 'appointments':
                return <AppointmentList user={user} refreshTrigger={refreshTrigger} />;
            case 'queue':
                return <QueueView user={user} refreshTrigger={refreshTrigger} />;
            default:
                return (
                    <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                        <h3>{activeKey.charAt(0).toUpperCase() + activeKey.slice(1)} Section</h3>
                        <p style={{ marginTop: '20px', color: '#64748b' }}>
                            This section is currently under development.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                activeKey={activeKey}
                onNavigate={setActiveKey}
                onLogout={onLogout}
                userRole={userRole}
            />
            <main className="dashboard-main">
                {activeKey !== "staff" && <Header user={user} />}
                <div className="dashboard-content">
                    {renderContent()}
                </div>
            </main>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                onSuccess={handleBookingSuccess}
                user={user}
            />
        </div>
    );
};

export default Dashboard;
