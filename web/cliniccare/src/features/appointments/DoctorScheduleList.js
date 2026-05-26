import React, { useState, useEffect } from "react";
import { User, Calendar, Clock, ChevronDown, ChevronUp, Stethoscope } from "lucide-react";
import "./DoctorScheduleList.css";

const DoctorScheduleList = () => {
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDoctors, setExpandedDoctors] = useState({});

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [docRes, slotRes] = await Promise.all([
        fetch((process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + "/api/doctors"),
        fetch((process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + "/api/slots")
      ]);

      if (docRes.ok && slotRes.ok) {
        const docData = await docRes.json();
        const slotData = await slotRes.json();
        setDoctors(docData);
        setSlots(slotData);
      }
    } catch (error) {
      console.error("Error fetching doctor schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDoctor = (doctorId) => {
    setExpandedDoctors(prev => ({
      ...prev,
      [doctorId]: !prev[doctorId]
    }));
  };

  if (loading) {
    return <div className="doctor-schedule-card glass-card">Loading schedules...</div>;
  }

  return (
    <div className="doctor-schedule-card glass-card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Stethoscope size={22} />
          <h3>Doctors & Schedules</h3>
          <span className="doctor-count">{doctors.length}</span>
        </div>
      </div>

      <div className="doctor-schedule-scroll">
        {doctors.length === 0 ? (
          <p className="empty-message">No doctors registered.</p>
        ) : (
          doctors.map((doctor) => {
            const doctorSlots = slots.filter(s => s.doctor === doctor.doctorName);
            const isExpanded = expandedDoctors[doctor.id];

            // Group slots by date
            const groupedSlots = doctorSlots.reduce((acc, slot) => {
              if (!acc[slot.date]) acc[slot.date] = [];
              acc[slot.date].push(slot);
              return acc;
            }, {});

            // Sort dates
            const sortedDates = Object.keys(groupedSlots).sort();

            return (
              <div key={doctor.id} className={`doctor-item-wrapper ${isExpanded ? 'is-expanded' : ''}`}>
                <div className="doctor-item-header" onClick={() => toggleDoctor(doctor.id)}>
                  <div className="doctor-info">
                    <div className="doctor-avatar">
                      <User size={18} />
                    </div>
                    <div className="doctor-text">
                      <div className="name-row">
                        <span className="queue-prefix">{doctor.queueLetter}</span>
                        <h4>{doctor.doctorName}</h4>
                      </div>
                      <span className="slot-summary">{doctorSlots.length} Total Slots • {sortedDates.length} Days</span>
                    </div>
                  </div>
                  <div className="expand-icon">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="doctor-slots-content">
                    {doctorSlots.length === 0 ? (
                      <p className="no-slots">No slots scheduled for this doctor.</p>
                    ) : (
                      <div className="slots-by-date-container">
                        {sortedDates.map(date => (
                          <div key={date} className="date-group">
                            <div className="date-header">
                              <Calendar size={14} />
                              <span>{date}</span>
                            </div>
                            <div className="slots-grid">
                              {groupedSlots[date].sort((a, b) => a.startTime.localeCompare(b.startTime)).map((slot) => (
                                <div key={slot.id} className={`slot-mini-card ${slot.booked >= slot.capacity ? 'is-full' : ''} ${slot.disabled ? 'is-disabled' : ''}`}>
                                  <div className="slot-time">
                                    <Clock size={12} />
                                    <span>{slot.startTime} - {slot.endTime}</span>
                                  </div>
                                  <div className="slot-status">
                                    <span className="capacity-indicator">
                                      {slot.booked}/{slot.capacity}
                                    </span>
                                    {slot.disabled && <span className="disabled-badge">OFF</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DoctorScheduleList;
