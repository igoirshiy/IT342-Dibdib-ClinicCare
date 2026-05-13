import React, { useState } from "react";
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardCards from './DashboardCards';
import HealthChecklist from './HealthChecklist';
import StaffDashboard from './StaffDashboard';
import StaffDashboardCards from './StaffDashboardCards';
import BookingModal from '../appointments/BookingModal';
import BookingView from '../appointments/BookingView';
import AppointmentList from '../appointments/AppointmentList';
import QueueView from '../appointments/QueueView';
import ProfileView from './ProfileView';
import './Dashboard.css';

const Dashboard = ({ onLogout, userRole, user, onUserUpdate }) => {
    const [activeKey, setActiveKey] = useState('dashboard');
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleBookingSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleUserUpdate = (updatedUser) => {
        if (onUserUpdate) onUserUpdate(updatedUser);
    };

    const renderContent = () => {
        if (activeKey === 'profile') {
            return <ProfileView user={user} onUpdate={handleUserUpdate} />;
        }

        if (userRole === 'STAFF') {
            if (activeKey === 'staff') return <StaffDashboard />;
            if (activeKey === 'dashboard') {
                return (
                    <div className="staff-overview">
                        <StaffDashboardCards refreshTrigger={refreshTrigger} />
                        <div className="glass-card" style={{ padding: '30px' }}>
                            <h3>Recent Activity</h3>
                            <p style={{ marginTop: '15px', color: '#64748b', fontSize: '0.9rem' }}>
                                Activity logs and recent updates will appear here.
                            </p>
                        </div>
                    </div>
                );
            }
        }

        // Patient Views
        switch (activeKey) {
            case 'dashboard':
                return (
                    <>
                        <DashboardCards 
                            onBookClick={() => setIsBookingOpen(true)} 
                            onViewAppointmentsClick={() => setActiveKey('appointments')}
                            user={user} 
                            refreshTrigger={refreshTrigger}
                        />
                        <HealthChecklist user={user} />
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
                {activeKey !== "staff" && <Header user={user} userRole={userRole} onNavigate={setActiveKey} />}
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
