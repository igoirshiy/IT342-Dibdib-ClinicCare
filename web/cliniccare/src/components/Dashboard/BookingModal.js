import React, { useState } from 'react';
import { X, Calendar, User, ChevronDown } from 'lucide-react';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        type: '',
        date: '',
        timeSlot: '',
        doctor: '',
        reason: ''
    });

    if (!isOpen) return null;

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

    // Get max date (+7 days from today)
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const maxDate = nextWeek.toISOString().split('T')[0];

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

                <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
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
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="button" className="btn-primary" onClick={() => {
                            alert('Appointment Confirmed! (Mock)');
                            onClose();
                        }}>Confirm Appointment</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
