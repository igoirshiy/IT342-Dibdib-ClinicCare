import React, { useState } from 'react';
import { X, Calendar, User, ChevronDown } from 'lucide-react';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose, user }) => {
    const [formData, setFormData] = useState({
        type: '',
        date: '',
        timeSlot: '',
        doctor: '',
        reason: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Submitting booking...", formData);

        if (!user) {
            alert('Error: User session not found. Please log in again.');
            return;
        }

        // Basic Validation
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
                status: 'Waiting'
            };

            console.log("Full Booking Payload:", payload);
            console.log("Current User Object:", user);

            if (!payload.patientEmail || !payload.patientName) {
                console.error("CRITICAL: Missing user details!", { email: user.email, name: user.fullName });
                alert("Error: User details missing. Try logging out and back in.");
                setIsSubmitting(false);
                return;
            }

            console.log("Sending request to backend...");
            const response = await fetch('http://127.0.0.1:8080/api/appointments/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log("Response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                alert(`Successfully booked! Your Queue Number is: ${data.queueNumber}`);
                onClose();
            } else {
                const errorText = await response.text();
                alert('Booking Failed (Backend Error): ' + errorText);
            }
        } catch (error) {
            console.error('Error during booking:', error);
            alert('Booking Failed (Network Error): ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const timeSlots = [
        { time: "07:30 – 08:00 AM", left: 2, full: false },
        { time: "08:30 – 09:00 AM", left: 1, full: false },
        { time: "09:30 – 10:00 AM", left: 0, full: true },
        { time: "10:30 – 11:00 AM", left: 3, full: false },
    ];

    const doctors = ["Dr. Santos", "Dr. Reyes", "Dr. Cruz"];
    const consultationTypes = [
        "General Check-up",
        "Follow-up Consultation",
        "Medical Concern",
        "Prescription Refill"
    ];

    const handleBackdropClick = (e) => {
        if (e.target.className === 'modal-overlay') onClose();
    };

    // Get local date string YYYY-MM-DD
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
    const maxDay = new Date(nextWeek);
    const maxDate = `${maxDay.getFullYear()}-${String(maxDay.getMonth() + 1).padStart(2, '0')}-${String(maxDay.getDate()).padStart(2, '0')}`;

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content glass-modal animate-fade-in">
                <header className="modal-header">
                    <div className="modal-header-text">
                        <h2>Book New Appointment</h2>
                        <p>Fill in your details to schedule your visit</p>
                    </div>
                    <button className="close-btn" onClick={onClose} aria-label="Close modal">
                        <X size={20} />
                    </button>
                </header>

                <form className="modal-form" onSubmit={handleSubmit}>
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
                        <p className="field-note">Consultation type helps the clinic prepare for your visit.</p>
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>Appointment Date</label>
                            <div className="input-wrapper">
                                <input
                                    type="date"
                                    min={today}
                                    max={maxDate}
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                                <Calendar size={18} className="input-icon" />
                            </div>
                            <p className="field-note">Available within the next 7 days.</p>
                        </div>

                        <div className="form-group flex-1">
                            <label>Select Doctor</label>
                            <div className="select-wrapper">
                                <select
                                    value={formData.doctor}
                                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                                >
                                    <option value="" disabled>Select Doctor</option>
                                    {doctors.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <User size={18} className="select-icon" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Available Time Slots</label>
                        <div className="time-slots-grid">
                            {timeSlots.map((slot, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={slot.full}
                                    className={`slot-card ${formData.timeSlot === slot.time ? 'slot-selected' : ''} ${slot.full ? 'slot-full' : ''}`}
                                    onClick={() => setFormData({ ...formData, timeSlot: slot.time })}
                                >
                                    <span className="slot-time">{slot.time}</span>
                                    <span className="slot-capacity">
                                        {slot.full ? 'FULL' : `${slot.left} slots left`}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Reason for Visit</label>
                        <textarea
                            placeholder="Briefly describe your concern or reason for visiting the clinic."
                            rows="3"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        />
                    </div>

                    <footer className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : 'Confirm Appointment'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
