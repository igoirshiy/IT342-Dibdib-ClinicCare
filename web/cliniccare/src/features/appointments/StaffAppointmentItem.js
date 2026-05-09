import React, { useState } from "react";
import { ChevronDown, BellRing } from "lucide-react";
import './StaffAppointments.css';

const statusOptions = ["Waiting", "Serving", "Completed", "Cancelled"];

const statusClass = {
  Waiting: "staff-status--waiting",
  Serving: "staff-status--serving",
  Completed: "staff-status--completed",
  Cancelled: "staff-status--cancelled",
};

const StaffAppointmentItem = ({ appointment, onUpdateStatus, onNotify }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isFaded =
    appointment.status === "Completed" || appointment.status === "Cancelled";

  return (
    <div className={`staff-appt-item ${isFaded ? "staff-appt-item--faded" : ""}`}>
      <div className="staff-appt-top">
        <div className="staff-appt-left">
          <h4 className="staff-appt-patient">{appointment.patientName}</h4>
          <span className="staff-appt-type">{appointment.consultationType}</span>
          <span className="staff-appt-datetime">
            {appointment.appointmentDate} · {appointment.timeSlot}
          </span>
        </div>
        <div className="staff-appt-right">
          <span className="staff-appt-queue">{appointment.queueNumber}</span>
          <span className={`staff-appt-status ${statusClass[appointment.status]}`}>
            {appointment.status}
          </span>
        </div>
      </div>

      <div className="staff-appt-actions">
        <div className="staff-status-dropdown">
          <button
            className="staff-action-btn staff-action-btn--status"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Update Status <ChevronDown size={14} />
          </button>
          {menuOpen && (
            <div className="staff-status-menu">
              {statusOptions
                .filter((s) => s !== appointment.status)
                .map((s) => (
                  <button
                    key={s}
                    className={`staff-status-option ${statusClass[s]}`}
                    onClick={() => {
                      onUpdateStatus(appointment.id, s);
                      setMenuOpen(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
            </div>
          )}
        </div>
        <button
          className="staff-action-btn staff-action-btn--notify"
          onClick={() => onNotify(appointment.patientName)}
        >
          <BellRing size={14} /> Notify
        </button>
      </div>
    </div>
  );
};

export default StaffAppointmentItem;
