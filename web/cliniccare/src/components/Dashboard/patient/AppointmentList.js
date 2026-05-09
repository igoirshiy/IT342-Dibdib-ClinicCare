import React, { useState, useEffect } from 'react';
import AppointmentItem from './AppointmentItem';
import './AppointmentList.css';
import { CalendarOff, Loader2, Search, Filter } from 'lucide-react';

const AppointmentList = ({ user, refreshTrigger }) => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUserAppointments = async () => {
        if (!user?.email) return;
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/appointments/patient/${user.email}`);
            if (response.ok) {
                const data = await response.json();
                // Sort by date descending (newest first)
                const sorted = data.sort((a, b) => {
                    const dateA = new Date(a.appointmentDate);
                    const dateB = new Date(b.appointmentDate);
                    return dateB - dateA;
                });
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
    }, [user, refreshTrigger]);

    useEffect(() => {
        let filtered = [...appointments];

        // Apply Tab Filter
        if (activeTab === 'Upcoming') {
            filtered = filtered.filter(app => app.status === 'Waiting' || app.status === 'Serving');
        } else if (activeTab === 'Completed') {
            filtered = filtered.filter(app => app.status === 'Completed');
        } else if (activeTab === 'Cancelled') {
            filtered = filtered.filter(app => app.status === 'Cancelled');
        }

        // Apply Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(app => 
                app.doctorName.toLowerCase().includes(query) || 
                app.consultationType.toLowerCase().includes(query)
            );
        }

        setFilteredAppointments(filtered);
    }, [appointments, activeTab, searchQuery]);

    if (loading) {
        return (
            <div className="appointments-view-container animate-fade-in">
                <div className="glass-card loading-state">
                    <Loader2 className="animate-spin" size={40} style={{ color: '#ec4899' }} />
                    <p>Loading your appointments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="appointments-view-container animate-fade-in">
            <header className="view-header">
                <div className="header-text">
                    <h2>My Appointments</h2>
                    <p>Manage and track all your clinic visits</p>
                </div>
                <div className="header-stats">
                    <div className="stat-pill">
                        <span className="stat-label">Total</span>
                        <span className="stat-value">{appointments.length}</span>
                    </div>
                </div>
            </header>

            <div className="view-controls glass-card">
                <div className="search-bar">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by doctor or type..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="filter-tabs">
                    {['All', 'Upcoming', 'Completed', 'Cancelled'].map(tab => (
                        <button 
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="appointments-grid">
                {filteredAppointments.length === 0 ? (
                    <div className="empty-state glass-card">
                        <CalendarOff size={64} />
                        <h3>No appointments found</h3>
                        <p>Adjust your filters or book a new appointment to get started.</p>
                    </div>
                ) : (
                    filteredAppointments.map(app => (
                        <AppointmentItem 
                            key={app.id} 
                            appointment={app} 
                            onRefresh={fetchUserAppointments}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default AppointmentList;
