import React, { useState, useEffect } from "react";
import { CalendarCheck, User, ChevronUp, ChevronDown, BellRing, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import StaffAppointmentItem from './StaffAppointmentItem';
import './StaffAppointments.css';

// Helper for consistent local date strings (YYYY-MM-DD)
const getLocalDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
const StaffAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
  const [viewDate, setViewDate] = useState(new Date()); // For month navigation
  const [showCalendar, setShowCalendar] = useState(false);
  const [expandedDoctors, setExpandedDoctors] = useState({});

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();

    const interval = setInterval(fetchAppointments, 10000);
    return () => clearInterval(interval);
  }, [viewAll]);

  const fetchAppointments = async () => {
    try {
      const endpoint = viewAll ? "all" : "today";
      const response = await fetch(`${process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + ""}/api/appointments/${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch((process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + "/api/doctors");
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const updateStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );

    fetch(`${process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + ""}/api/appointments/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStatus),
    }).catch((error) => console.error("Error updating status:", error));
  };

  const notifyPatient = (patient) => {
    // Notification logic would go here
  };

  const toggleDoctorExpand = (doctorName) => {
    setExpandedDoctors((prev) => ({
      ...prev,
      [doctorName]: !prev[doctorName],
    }));
  };

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
    setViewAll(true); // Switch to "All/Filter" mode when date is picked
    setShowCalendar(false);
  };

  const renderCalendar = () => {
    const tempDate = new Date(viewDate);
    const daysInMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1).getDay();
    const monthName = tempDate.toLocaleString('default', { month: 'long' });

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = dateStr === selectedDate && viewAll;
      const isToday = dateStr === getLocalDateString(new Date());

      days.push(
        <div
          key={d}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateSelect(dateStr)}
        >
          {d}
        </div>
      );
    }

    const prevMonth = (e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); };
    const nextMonth = (e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); };

    return (
      <div className="mini-calendar collapsible">
        <div className="calendar-header">
          <button onClick={prevMonth}><ChevronLeft size={16} /></button>
          <h4>{monthName} {tempDate.getFullYear()}</h4>
          <button onClick={nextMonth}><ChevronRight size={16} /></button>
        </div>
        <div className="calendar-weekdays">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </div>
    );
  };

  // Group appointments by doctor and filter by selected date if in "All/Filter" mode
  const filteredAppointments = viewAll
    ? appointments.filter(a => a.appointmentDate === selectedDate)
    : appointments;

  const groupedAppointments = filteredAppointments.reduce((groups, appt) => {
    const docName = appt.doctorName || "Unassigned";
    if (!groups[docName]) {
      groups[docName] = [];
    }
    groups[docName].push(appt);
    return groups;
  }, {});

  const formattedSelectedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  if (loading) {
    return <div className="staff-appt-card glass-card">Loading appointments...</div>;
  }

  return (
    <div className="staff-appt-card glass-card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarCheck size={22} />
          <h3>{viewAll ? `Appointments for ${formattedSelectedDate}` : "Today's Appointments"}</h3>
          <span className="staff-appt-count">{filteredAppointments.length}</span>
        </div>
        <div className="view-toggle" style={{ display: 'flex', alignItems: 'center' }}>
          <button
            className={`toggle-btn ${!viewAll ? 'active' : ''}`}
            onClick={() => setViewAll(false)}
            style={{ padding: '4px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', background: !viewAll ? '#3b82f6' : 'transparent', color: !viewAll ? 'white' : '#64748b', fontSize: '0.8rem', cursor: 'pointer' }}
          >
            Today
          </button>

          <div style={{ position: 'relative', marginLeft: '4px' }}>
            <button
              className={`toggle-btn ${viewAll ? 'active' : ''}`}
              onClick={() => setShowCalendar(!showCalendar)}
              style={{ padding: '4px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', background: viewAll ? '#3b82f6' : 'transparent', color: viewAll ? 'white' : '#64748b', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <CalendarIcon size={14} />
              {viewAll ? formattedSelectedDate : "Pick Date"}
              {showCalendar ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>
      </div>

      {showCalendar && (
        <div className="calendar-dropdown-wrapper collapsible">
          {renderCalendar()}
        </div>
      )}

      <div className="staff-appt-scroll">
        {Object.keys(groupedAppointments).length === 0 ? (
          <p style={{ padding: "20px", textAlign: "center", color: "#64748b" }}>
            No appointments found
          </p>
        ) : (
          Object.entries(groupedAppointments).map(([doctorName, doctorAppts]) => {
            const isExpanded = expandedDoctors[doctorName];
            const activeAppts = doctorAppts.filter(a => a.status !== "Completed" && a.status !== "Cancelled").length;

            return (
              <div key={doctorName} className={`doc-group-wrapper ${isExpanded ? 'is-expanded' : ''}`}>
                <div className="doc-group-header" onClick={() => toggleDoctorExpand(doctorName)}>
                  <div className="doc-header-left">
                    <div className="doc-avatar-small">
                      <User size={16} />
                    </div>
                    <div className="doc-info-text">
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {doctors.find(d => d.doctorName === doctorName)?.queueLetter && (
                          <span style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                            {doctors.find(d => d.doctorName === doctorName).queueLetter}
                          </span>
                        )}
                        {doctorName}
                      </h4>
                      <span>{doctorAppts.length} Appointments • {activeAppts} Waiting</span>
                    </div>
                  </div>
                  <div className="doc-header-right">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="doc-group-content">
                    {doctorAppts.map((appt) => (
                      <StaffAppointmentItem
                        key={appt.id}
                        appointment={appt}
                        onUpdateStatus={updateStatus}
                        onNotify={notifyPatient}
                      />
                    ))}
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

export default StaffAppointmentList;
