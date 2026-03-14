import React, { useState, useEffect } from 'react';
import { X, Calendar, User, ChevronDown } from 'lucide-react';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose, user }) => {
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

    useEffect(() => {
        if (isOpen) {
            fetchAllSlots();
            // Auto-refresh slots every 5 seconds while modal is open
            const interval = setInterval(fetchAllSlots, 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const fetchAllSlots = async () => {
        setIsLoadingSlots(true);
        try {
            // Add timestamp to bus cache
            const response = await fetch(`http://127.0.0.1:8080/api/slots?t=${Date.now()}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("[DEBUG] Fetched slots:", data.length);
                setAllSlots(data);
            }
        } catch (error) {
            console.error("Error fetching slots:", error);
        } finally {
            setIsLoadingSlots(false);
        }
    };

    useEffect(() => {
        // Filter available slots based on selected date and doctor
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

    // Derive dynamic doctor list based on selected date
    const availableDoctors = formData.date
        ? [...new Set(allSlots.filter(s => s.date === formData.date && !s.disabled).map(s => s.doctor))]
        : [...new Set(allSlots.filter(s => !s.disabled).map(s => s.doctor))];

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
                status: 'Waiting',
                selectedSlotId: formData.selectedSlotId // Send the ID to backend
            };

            console.log("[DEBUG] Sending booking payload with Slot ID:", formData.selectedSlotId);

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
                                    {availableDoctors.length === 0 ? (
                                        <option disabled>No doctors available</option>
                                    ) : (
                                        availableDoctors.map(d => <option key={d} value={d}>Doc {d}</option>)
                                    )}
                                </select>
                                <User size={18} className="select-icon" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Available Time Slots</label>
                        {!formData.date || !formData.doctor ? (
                            <p className="field-note" style={{ textAlign: 'center', padding: '10px', background: '#f8fafc', borderRadius: '8px' }}>
                                Please select a date and doctor to see available times.
                            </p>
                        ) : isLoadingSlots ? (
                            <p className="field-note" style={{ textAlign: 'center' }}>Loading slots...</p>
                        ) : availableSlots.length === 0 ? (
                            <p className="field-note" style={{ textAlign: 'center', padding: '10px', background: '#fff1f2', color: '#be123c', borderRadius: '8px' }}>
                                No available slots found for this selection.
                            </p>
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
                                                {isFull ? 'FULL' : `${left} slots left`}
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

export default BookingModal;
