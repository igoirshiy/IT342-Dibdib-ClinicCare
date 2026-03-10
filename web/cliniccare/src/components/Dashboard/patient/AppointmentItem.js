import React from 'react';
import './AppointmentList.css';

const AppointmentItem = ({ appointment }) => {
    const { doctor, date, time, type, status, queueNumber } = appointment;

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'waiting': return 'status-waiting';
            case 'serving': return 'status-serving';
            case 'completed': return 'status-completed';
            default: return '';
        }
    };

    return (
        <div className="appointment-item-card glass-item">
            <div className="appointment-info">
                <div className="appointment-main">
                    <h4 className="doctor-name">{doctor}</h4>
                    <span className="consultation-type">{type}</span>
                </div>
                <div className="appointment-details">
                    <p className="appointment-time">{date} | {time}</p>
                </div>
            </div>

            <div className="appointment-status-group">
                {queueNumber && (
                    <div className="queue-tag">
                        <span className="queue-label">Queue</span>
                        <span className="queue-val">{queueNumber}</span>
                    </div>
                )}
                <span className={`status-badge-detailed ${getStatusClass(status)}`}>
                    {status}
                </span>
            </div>
        </div>
    );
};

export default AppointmentItem;
