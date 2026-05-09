import React, { useState, useEffect } from 'react';
import { Users, Clock, Loader2, AlertCircle } from 'lucide-react';
import './DashboardCards.css'; // Reusing some card styles

const QueueView = ({ user, refreshTrigger }) => {
    const [latestAppointment, setLatestAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchLatest = async () => {
        if (!user?.email) return;
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/appointments/patient/${user.email}`);
            if (response.ok) {
                const data = await response.json();
                // Find latest non-completed appointment
                const active = data
                    .filter(a => a.status !== 'Completed' && a.status !== 'Cancelled')
                    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))[0];
                setLatestAppointment(active);
            }
        } catch (error) {
            console.error("Error fetching queue status:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatest();
        const interval = setInterval(fetchLatest, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [user, refreshTrigger]);

    if (loading) {
        return (
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                <Loader2 className="animate-spin" size={32} style={{ color: '#ec4899', margin: '0 auto 16px' }} />
                <p style={{ color: '#64748b' }}>Loading live queue status...</p>
            </div>
        );
    }

    return (
        <div className="queue-view-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                <div className="card-header" style={{ justifyContent: 'center', marginBottom: '32px' }}>
                    <Users size={28} style={{ color: '#ec4899' }} />
                    <h2 style={{ fontSize: '1.5rem', color: '#500732' }}>Live Queue Status</h2>
                </div>

                {!latestAppointment ? (
                    <div style={{ padding: '20px' }}>
                        <AlertCircle size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
                        <p style={{ color: '#64748b' }}>You don't have any active appointments in the queue.</p>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '8px' }}>Book an appointment to see your queue position here.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ background: 'rgba(236, 72, 153, 0.05)', borderRadius: '24px', padding: '40px', marginBottom: '32px' }}>
                            <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Queue Number</span>
                            <span style={{ fontSize: '4.5rem', fontWeight: '900', color: '#ec4899', lineHeight: '1' }}>{latestAppointment.queueNumber}</span>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '16px', padding: '24px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#64748b' }}>Current Status</span>
                                <span className={`status-badge status-${latestAppointment.status.toLowerCase()}`} style={{ fontSize: '1rem', padding: '4px 12px' }}>{latestAppointment.status}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ color: '#64748b' }}>Consulting with</span>
                                <span style={{ fontWeight: '700', color: '#500732' }}>Doc {latestAppointment.doctorName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Time Slot</span>
                                <span style={{ fontWeight: '700', color: '#500732' }}>{latestAppointment.timeSlot}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                            <Clock size={16} />
                            <span>Queue updates in real-time. Please stay in the clinic.</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QueueView;
