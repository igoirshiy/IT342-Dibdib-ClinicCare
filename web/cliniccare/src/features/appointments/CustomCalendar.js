import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CustomCalendar.css';

const CustomCalendar = ({ selectedDate, onDateSelect, userAppointments, availableDates }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse user appointments
    const bookedDates = new Set(
        userAppointments
            .filter(app => app.status !== 'Cancelled')
            .map(app => app.appointmentDate)
    );

    // Doctor availability (if provided)
    const doctorAvailableDates = availableDates ? new Set(availableDates) : null;

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const prevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day, isSelectable) => {
        if (!isSelectable) return;
        const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const dateString = date.toISOString().split('T')[0];
        onDateSelect(dateString);
    };

    const renderDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysCount = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`pad-${i}`} className="calendar-day empty"></div>);
        }

        for (let d = 1; d <= daysCount; d++) {
            const date = new Date(year, month, d);
            const dateString = date.toISOString().split('T')[0];
            const isToday = date.getTime() === today.getTime();
            const isSelected = selectedDate === dateString;
            const isBookedByMe = bookedDates.has(dateString);
            const isPast = date < today;
            
            // If availableDates is provided, check if this date is in the list
            const isDoctorAvailable = doctorAvailableDates ? doctorAvailableDates.has(dateString) : true;
            const isSelectable = !isPast && isDoctorAvailable;

            days.push(
                <div
                    key={d}
                    className={`calendar-day ${!isSelectable ? 'unselectable' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isBookedByMe ? 'has-appointment' : ''} ${isDoctorAvailable && !isPast && doctorAvailableDates ? 'available' : ''}`}
                    onClick={() => handleDateClick(d, isSelectable)}
                >
                    <span className="day-number">{d}</span>
                    {isBookedByMe && <div className="appointment-dot"></div>}
                </div>
            );
        }

        return days;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="custom-calendar glass-card">
            <header className="calendar-header">
                <button type="button" onClick={prevMonth} className="nav-btn"><ChevronLeft size={18} /></button>
                <h3>{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</h3>
                <button type="button" onClick={nextMonth} className="nav-btn"><ChevronRight size={18} /></button>
            </header>
            <div className="calendar-weekdays">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
            <div className="calendar-grid">
                {renderDays()}
            </div>
            <div className="calendar-legend">
                <div className="legend-item">
                    <div className="dot available"></div>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <div className="dot booked"></div>
                    <span>Your Appointment</span>
                </div>
            </div>
        </div>
    );
};

export default CustomCalendar;
