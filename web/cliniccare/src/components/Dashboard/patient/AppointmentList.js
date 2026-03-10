import React from 'react';
import AppointmentItem from './AppointmentItem';
import './AppointmentList.css';

const AppointmentList = () => {
    // Placeholder Data
    const appointments = [
        {
            id: 1,
            doctor: "Dr. Santos",
            date: "March 5, 2025",
            time: "9:00 AM – 9:30 AM",
            type: "General Check-up",
            status: "Serving",
            queueNumber: "Q3"
        },
        {
            id: 2,
            doctor: "Dr. Reyes",
            date: "March 5, 2025",
            time: "10:30 AM – 11:00 AM",
            type: "Dental Cleaning",
            status: "Waiting",
            queueNumber: "Q5"
        },
        {
            id: 3,
            doctor: "Dr. Garcia",
            date: "March 4, 2025",
            time: "2:00 PM – 2:30 PM",
            type: "Cardiology Follow-up",
            status: "Completed",
            queueNumber: "Q12"
        },
        {
            id: 4,
            doctor: "Dr. Lee",
            date: "March 6, 2025",
            time: "1:00 PM – 1:30 PM",
            type: "Skin Consultation",
            status: "Waiting",
            queueNumber: "Q2"
        }
    ];

    return (
        <div className="appointments-list-container glass-card">
            <div className="list-header">
                <h3 className="list-title">My Upcoming Appointments</h3>
            </div>
            <div className="appointments-scroll-area">
                {appointments.map(app => (
                    <AppointmentItem key={app.id} appointment={app} />
                ))}
            </div>
        </div>
    );
};

export default AppointmentList;
