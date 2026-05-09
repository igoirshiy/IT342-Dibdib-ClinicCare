import React, { useState, useEffect } from 'react';
import { Calendar, User, ChevronDown, Clock, Activity, AlertCircle } from 'lucide-react';
import './BookingModal.css'; // Reusing styles for now, can be extracted if needed
import CustomCalendar from './CustomCalendar';

const BookingView = ({ user, onBookingSuccess }) => {
    const [formData, setFormData] = useState({
        type: '',
        date: '',
        timeSlot: '',
        doctor: '',
        reason: '',
        selectedSlotId: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [allSlots, setAllSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [userAppointments, setUserAppointments] = useState([]);

    const fetchAllSlots = async () => {
        setIsLoadingSlots(true);
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/slots`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAllSlots(data);
            }
        } catch (error) {
            console.error("Error fetching slots:", error);
        } finally {
            setIsLoadingSlots(false);
        }
    };

    useEffect(() => {
        fetchAllSlots();
        fetchUserAppointments();
    }, []);

    const fetchUserAppointments = async () => {
        if (!user?.email) return;
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/appointments/patient/${user.email}`);
            if (response.ok) {
                const data = await response.json();
                setUserAppointments(data);
            }
        } catch (error) {
            console.error("Error fetching user appointments for calendar:", error);
        }
    };

    useEffect(() => {
        if (formData.date && formData.doctor) {
            const filtered = allSlots.filter(s =>
                s.doctor === formData.doctor &&
                s.date === formData.date &&
                !s.disabled
            );
            setAvailableSlots(filtered);
        } else {
            setAvailableSlots([]);
        }
    }, [formData.date, formData.doctor, allSlots]);

    const availableDoctors = formData.date
        ? [...new Set(allSlots.filter(s => s.date === formData.date && !s.disabled).map(s => s.doctor))]
        : [...new Set(allSlots.filter(s => !s.disabled).map(s => s.doctor))];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Error: User session not found. Please log in again.');
            return;
        }

        if (!formData.type || !formData.date || !formData.timeSlot || !formData.doctor) {
            alert('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                patientEmail: user.email,
                patientName: user.fullName,
                doctorName: formData.doctor,
                consultationType: formData.type,
                appointmentDate: formData.date,
                timeSlot: formData.timeSlot,
                reason: formData.reason,
                status: 'Waiting',
                selectedSlotId: formData.selectedSlotId
            };

            const response = await fetch('http://127.0.0.1:8080/api/appointments/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccessData(data);
                
                // Trigger refresh in dashboard
                if (onBookingSuccess) onBookingSuccess();

                // Reset form
                setFormData({
                    type: '',
                    date: '',
                    timeSlot: '',
                    doctor: '',
                    reason: '',
                    selectedSlotId: null
                });
            } else {
                const errorText = await response.text();
                alert('Booking Failed: ' + errorText);
            }
        } catch (error) {
            alert('Booking Failed (Network Error): ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const consultationTypes = [
        "General Check-up",
        "Follow-up Consultation",
        "Medical Concern",
        "Prescription Refill"
    ];

    const formatBookingTime = (t) => {
        if (!t) return "";
        try {
            const [h, m] = t.split(":").map(Number);
            const ampm = h >= 12 ? "PM" : "AM";
            const hr = h % 12 || 12;
            return `${hr}:${m.toString().padStart(2, '0')} ${ampm}`;
        } catch (e) {
            return t;
        }
    };

    const getLocalDate = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const today = getLocalDate();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const maxDate = `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, '0')}-${String(nextWeek.getDate()).padStart(2, '0')}`;

    if (successData) {
        return (
            <div className="glass-card animate-fade-in" style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ background: '#ec4899', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'white' }}>
                    <Activity size={32} />
                </div>
                <h2 style={{ color: '#500732', marginBottom: '12px' }}>Appointment Confirmed!</h2>
                <p style={{ color: '#64748b', marginBottom: '32px' }}>Your booking has been successfully processed.</p>
                
                <div style={{ background: 'rgba(236, 72, 153, 0.05)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
                    <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Queue Number</span>
                    <span style={{ fontSize: '3rem', fontWeight: '800', color: '#ec4899' }}>{successData.queueNumber}</span>
                </div>

                <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', padding: '16px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#64748b' }}>Doctor:</span>
                        <span style={{ fontWeight: '600', color: '#500732' }}>Doc {successData.doctorName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#64748b' }}>Date:</span>
                        <span style={{ fontWeight: '600', color: '#500732' }}>{successData.appointmentDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#64748b' }}>Time:</span>
                        <span style={{ fontWeight: '600', color: '#500732' }}>{successData.timeSlot}</span>
                    </div>
                </div>

                <button className="btn-primary" onClick={() => setSuccessData(null)}>Book Another</button>
            </div>
        );
    }

    return (
        <div className="glass-card animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="modal-header" style={{ padding: '32px 32px 0' }}>
                <div className="modal-header-text">
                    <h2>Book New Appointment</h2>
                    <p>Select your preferred doctor and time slot</p>
                </div>
            </div>

            <form className="modal-form" onSubmit={handleSubmit} style={{ padding: '32px' }}>
                <div className="form-group">
                    <label>Consultation Type</label>
                    <div className="select-wrapper">
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="" disabled>Select Type</option>
                            {consultationTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={18} className="select-icon" />
                    </div>
                </div>

                <div className="form-group">
                    <label>Select Doctor</label>
                    <div className="select-wrapper">
                        <select
                            value={formData.doctor}
                            onChange={(e) => {
                                setFormData({ ...formData, doctor: e.target.value, date: '', timeSlot: '', selectedSlotId: null });
                            }}
                        >
                            <option value="" disabled>Select Doctor</option>
                            {[...new Set(allSlots.filter(s => !s.disabled).map(s => s.doctor))].map(d => (
                                <option key={d} value={d}>Doc {d}</option>
                            ))}
                        </select>
                        <User size={18} className="select-icon" />
                    </div>
                </div>

                <div className="form-group">
                    <label>Appointment Date</label>
                    {!formData.doctor ? (
                        <div style={{ textAlign: 'center', padding: '32px', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.1)' }}>
                            <Calendar size={32} style={{ color: '#94a3b8', marginBottom: '12px' }} />
                            <p style={{ color: '#64748b' }}>Please select a doctor first to see their available dates.</p>
                        </div>
                    ) : (
                        <CustomCalendar 
                            selectedDate={formData.date}
                            onDateSelect={(date) => setFormData({ ...formData, date, timeSlot: '', selectedSlotId: null })}
                            userAppointments={userAppointments}
                            availableDates={[...new Set(allSlots.filter(s => s.doctor === formData.doctor && !s.disabled).map(s => s.date))]}
                        />
                    )}
                    <p className="field-note">Dates in green have available slots for the selected doctor.</p>
                </div>

                <div className="form-group">
                    <label>Available Time Slots</label>
                    {!formData.date || !formData.doctor ? (
                        <div style={{ textAlign: 'center', padding: '32px', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.1)' }}>
                            <Clock size={32} style={{ color: '#94a3b8', marginBottom: '12px' }} />
                            <p style={{ color: '#64748b' }}>Please select a date and doctor to see available times.</p>
                        </div>
                    ) : isLoadingSlots ? (
                        <p style={{ textAlign: 'center', padding: '20px' }}>Loading slots...</p>
                    ) : availableSlots.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '32px', background: '#fff1f2', borderRadius: '16px', color: '#be123c' }}>
                            <AlertCircle size={32} style={{ marginBottom: '12px' }} />
                            <p>No available slots found for this selection.</p>
                        </div>
                    ) : (
                        <div className="time-slots-grid">
                            {availableSlots.map((slot) => {
                                const timeRange = `${formatBookingTime(slot.startTime)} – ${formatBookingTime(slot.endTime)}`;
                                const isFull = slot.booked >= slot.capacity;
                                const left = slot.capacity - slot.booked;

                                return (
                                        <button
                                            key={slot.id}
                                            type="button"
                                            disabled={isFull}
                                            className={`slot-card ${formData.timeSlot === timeRange ? 'slot-selected' : ''} ${isFull ? 'slot-full' : ''}`}
                                            onClick={() => setFormData({ ...formData, timeSlot: timeRange, selectedSlotId: slot.id })}
                                        >
                                            <span className="slot-time">{timeRange}</span>
                                            <span className="slot-capacity">
                                                {isFull ? 'FULL' : `Available: ${left} / ${slot.capacity}`}
                                            </span>
                                        </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Reason for Visit</label>
                    <textarea
                        placeholder="Briefly describe your concern..."
                        rows="3"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    />
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '16px' }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Confirm Appointment'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingView;
