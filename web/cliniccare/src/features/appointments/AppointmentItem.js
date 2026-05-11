import React from 'react';
import './AppointmentList.css';
import { Stethoscope, Calendar, Clock, Tag } from 'lucide-react';

const AppointmentItem = ({ appointment }) => {
    // Backend field names: doctorName, consultationType, appointmentDate, timeSlot, status, queueNumber
    const { doctorName, appointmentDate, timeSlot, consultationType, status, queueNumber } = appointment;

    const getStatusClass = (status) => {
        if (!status) return '';
        switch (status.toLowerCase()) {
            case 'waiting': return 'status-waiting';
            case 'serving': return 'status-serving';
            case 'completed': return 'status-completed';
            case 'cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    const formatDate = (dateStr) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    };

    return (
        <div className="appointment-item-card animate-fade-in">
            <div className="appointment-info">
                <div className="appointment-main">
                    <div className="doctor-info-row">
                        <Stethoscope size={22} className="item-icon" />
                        <h4 className="doctor-name">Doc {doctorName}</h4>
                    </div>
                    <div className="type-info-row">
                        <Tag size={14} className="item-icon-small" />
                        <span className="consultation-type">{consultationType}</span>
                    </div>
                </div>
                
                <div className="appointment-details-grid">
                    <div className="detail-item">
                        <Calendar size={16} className="item-icon-small" />
                        <span>{formatDate(appointmentDate)}</span>
                    </div>
                    <div className="detail-item">
                        <Clock size={16} className="item-icon-small" />
                        <span>{timeSlot}</span>
                    </div>
                </div>
            </div>

            <div className="appointment-status-group">
                {queueNumber && (
                    <div className="queue-tag">
                        <span className="queue-label">No.</span>
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
