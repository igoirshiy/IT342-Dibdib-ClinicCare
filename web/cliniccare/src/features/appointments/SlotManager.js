import React, { useState, useEffect } from "react";
import { Clock, Plus, Save, X, CalendarOff, Trash2, CalendarRange, Clock9, ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown, ChevronUp, User } from "lucide-react";
import './SlotManager.css';

// Helper for consistent local date strings (YYYY-MM-DD)
const getLocalDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatTime = (t) => {
  if (!t) return "";
  try {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hr = h % 12 || 12;
    return `${hr}:${m.toString().padStart(2, "0")} ${ampm}`;
  } catch (e) {
    return t;
  }
};

const SlotManager = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));
  const [viewDate, setViewDate] = useState(new Date()); // For month navigation
  const [showAdd, setShowAdd] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [expandedDoctors, setExpandedDoctors] = useState({}); // Track expanded states
  const [newSlotBatch, setNewSlotBatch] = useState({
    doctor: "",
    startDate: getLocalDateString(new Date()),
    endDate: getLocalDateString(new Date()),
    timeBlocks: [{ startTime: "08:00", endTime: "12:00", capacity: 8 }],
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await fetch((process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + "/api/slots");
      if (response.ok) {
        const data = await response.json();
        setSlots(data);
      }
    } catch (e) {
      console.error("Error fetching slots:", e);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (e, slot) => {
    e.stopPropagation(); // prevent card collapse/expand
    setEditingId(slot.id);
    setEditStart(slot.startTime);
    setEditEnd(slot.endTime);
  };

  const saveEdit = async (e, id) => {
    e.stopPropagation();
    const slotToUpdate = slots.find(s => s.id === id);
    if (!slotToUpdate) return;

    try {
      const updatedSlot = { ...slotToUpdate, startTime: editStart, endTime: editEnd };
      const response = await fetch(`${process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + ""}/api/slots/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSlot),
      });

      if (response.ok) {
        setSlots(prev => prev.map(s => s.id === id ? { ...s, startTime: editStart, endTime: editEnd } : s));
        setEditingId(null);
      }
    } catch (e) {
      console.error("Error updating slot:", e);
      alert("Failed to update slot.");
    }
  };

  const toggleDisable = async (e, id) => {
    e.stopPropagation();
    const slotToUpdate = slots.find(s => s.id === id);
    if (!slotToUpdate) return;

    try {
      const updatedSlot = { ...slotToUpdate, disabled: !slotToUpdate.disabled };
      const response = await fetch(`${process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + ""}/api/slots/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSlot),
      });

      if (response.ok) {
        setSlots(prev => prev.map(s => s.id === id ? { ...s, disabled: !s.disabled } : s));
      }
    } catch (e) {
      console.error("Error toggling status:", e);
    }
  };

  const deleteSlot = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this slot?")) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + ""}/api/slots/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSlots(prev => prev.filter(s => s.id !== id));
      }
    } catch (e) {
      console.error("Error deleting slot:", e);
    }
  };

  const addTimeBlock = () => {
    setNewSlotBatch(prev => ({
      ...prev,
      timeBlocks: [...prev.timeBlocks, { startTime: "08:00", endTime: "12:00", capacity: 8 }]
    }));
  };

  const removeTimeBlock = (index) => {
    setNewSlotBatch(prev => ({
      ...prev,
      timeBlocks: prev.timeBlocks.filter((_, i) => i !== index)
    }));
  };

  const updateTimeBlock = (index, field, value) => {
    setNewSlotBatch(prev => ({
      ...prev,
      timeBlocks: prev.timeBlocks.map((block, i) => i === index ? { ...block, [field]: value } : block)
    }));
  };

  const addSlotBatch = async () => {
    const { doctor, startDate, endDate, timeBlocks } = newSlotBatch;
    if (!doctor || !startDate || !endDate || timeBlocks.length === 0) {
      alert("Please fill in doctor, date range, and at least one time slot");
      return;
    }

    try {
      // Create local date range without timezone issues
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T00:00:00');
      const slotsToCreate = [];

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = getLocalDateString(d);

        timeBlocks.forEach(block => {
          slotsToCreate.push({
            doctor,
            date: dateStr,
            startTime: block.startTime,
            endTime: block.endTime,
            capacity: block.capacity,
            booked: 0,
            disabled: false
          });
        });
      }

      const response = await fetch((process.env.REACT_APP_API_URL || "http://127.0.0.1:8080") + "/api/slots/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slotsToCreate),
      });

      if (response.ok) {
        const savedSlots = await response.json();
        setSlots(prev => [...prev, ...savedSlots]);
        setShowAdd(false);
        setNewSlotBatch({
          doctor: "",
          startDate: getLocalDateString(new Date()),
          endDate: getLocalDateString(new Date()),
          timeBlocks: [{ startTime: "08:00", endTime: "12:00", capacity: 8 }],
        });
      }
    } catch (e) {
      console.error("Error adding batch slots:", e);
      alert("Failed to add schedules.");
    }
  };

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
    setShowCalendar(false);
  };

  const toggleDoctorExpand = (doctorName) => {
    setExpandedDoctors(prev => ({
      ...prev,
      [doctorName]: !prev[doctorName]
    }));
  };

  const filteredSlots = slots
    .filter(s => s.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Group slots by doctor
  const groupedTasks = filteredSlots.reduce((groups, slot) => {
    if (!groups[slot.doctor]) {
      groups[slot.doctor] = [];
    }
    groups[slot.doctor].push(slot);
    return groups;
  }, {});

  const renderCalendar = () => {
    const tempDate = new Date(viewDate);
    const daysInMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1).getDay();
    const monthName = tempDate.toLocaleString('default', { month: 'long' });

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === getLocalDateString(new Date());
      const hasSlots = slots.some(s => s.date === dateStr);

      days.push(
        <div
          key={d}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${hasSlots ? 'has-slots' : ''}`}
          onClick={() => handleDateSelect(dateStr)}
        >
          {d}
          {hasSlots && <div className="slot-dot"></div>}
        </div>
      );
    }

    const prevMonth = (e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); };
    const nextMonth = (e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); };

    return (
      <div className="mini-calendar collapsible">
        <div className="calendar-header">
          <button onClick={prevMonth}>
            <ChevronLeft size={18} />
          </button>
          <h4>{monthName} {tempDate.getFullYear()}</h4>
          <button onClick={nextMonth}>
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
      </div>
    );
  };

  const formattedSelectedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="slot-manager glass-card premium-layout">
      <div className="card-header-main">
        <div className="header-left">
          <Clock size={20} className="header-icon" />
          <h3>Schedule Management</h3>
        </div>
        <div className="header-actions">
          <button
            className={`date-picker-btn ${showCalendar ? 'active' : ''}`}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <CalendarIcon size={16} />
            <span>{formattedSelectedDate}</span>
            {showCalendar ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button className="icon-btn-add" onClick={() => setShowAdd(true)} title="Create Batch Slots">
            <Plus size={18} />
          </button>
        </div>
      </div>

      {showCalendar && (
        <div className="calendar-dropdown-wrapper">
          {renderCalendar()}
        </div>
      )}

      <div className="slots-main-content">
        <div className="view-status-bar">
          <span className="current-view-tag">
            {selectedDate === getLocalDateString(new Date()) ? "Today's Schedule" : `${formattedSelectedDate} Schedule`}
          </span>
          <span className="slot-count-pill">{filteredSlots.length} Total Slots</span>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="skeleton-loader"></div>
            <p>Fetching schedules...</p>
          </div>
        ) : Object.keys(groupedTasks).length === 0 ? (
          <div className="no-slots-placeholder simplified">
            <CalendarOff size={32} />
            <p>No schedules for this date.</p>
            <button className="text-btn" onClick={() => setShowCalendar(true)}>Pick another date</button>
          </div>
        ) : (
          <div className="slot-cards-container">
            {Object.entries(groupedTasks).map(([doctorName, doctorSlots], dIndex) => {
              const isExpanded = expandedDoctors[doctorName];
              const availableCount = doctorSlots.filter(s => !s.disabled).length;

              return (
                <div key={doctorName} className={`doctor-group-card ${isExpanded ? 'expanded' : ''}`}>
                  <div className="doctor-card-header" onClick={() => toggleDoctorExpand(doctorName)}>
                    <div className="doctor-header-info">
                      <div className="doctor-avatar">
                        <User size={20} />
                      </div>
                      <div className="doctor-text">
                        <h4 className="doctor-name">{doctorName}</h4>
                        <span className="doctor-status-summary">
                          {doctorSlots.length} Slots • {availableCount} Available
                        </span>
                      </div>
                    </div>
                    <div className="header-expand-icon">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="doctor-details-view">
                      <div className="details-header">
                        <span>Time Windows</span>
                        <span>Capacity</span>
                      </div>
                      {doctorSlots.map((slot, sIndex) => {
                        const remaining = slot.capacity - slot.booked;
                        const pct = (slot.booked / slot.capacity) * 100;
                        const isEditing = editingId === slot.id;

                        return (
                          <div key={slot.id} className={`inner-slot-row ${slot.disabled ? 'disabled' : ''}`}>
                            <div className="slot-time-col">
                              {isEditing ? (
                                <div className="inline-edit-box">
                                  <input type="time" value={editStart} onChange={(e) => setEditStart(e.target.value)} />
                                  <span>-</span>
                                  <input type="time" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} />
                                  <div className="edit-actions">
                                    <button onClick={(e) => saveEdit(e, slot.id)} className="save-btn"><Save size={14} /></button>
                                    <button onClick={() => setEditingId(null)} className="cancel-btn"><X size={14} /></button>
                                  </div>
                                </div>
                              ) : (
                                <div className="time-value" onClick={(e) => startEdit(e, slot)}>
                                  <Clock9 size={14} />
                                  <span>{formatTime(slot.startTime)} – {formatTime(slot.endTime)}</span>
                                </div>
                              )}
                            </div>

                            <div className="slot-cap-col">
                              <div className="cap-mini-bar">
                                <div className="cap-fill" style={{ width: `${pct}%`, background: pct >= 100 ? "#ef4444" : "#6366f1" }} />
                              </div>
                              <span className="cap-label">{remaining} left</span>
                            </div>

                            <div className="slot-actions-col">
                              <button
                                className={`action-toggle ${slot.disabled ? 'enable' : 'disable'}`}
                                onClick={(e) => toggleDisable(e, slot.id)}
                                title={slot.disabled ? "Enable" : "Disable"}
                              >
                                {slot.disabled ? <Plus size={14} /> : <CalendarOff size={14} />}
                              </button>
                              <button
                                className="action-delete"
                                onClick={(e) => deleteSlot(e, slot.id)}
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAdd && (
        <div className="slot-add-overlay">
          <div className="slot-add-form glass-card premium-form">
            <div className="form-header">
              <CalendarRange size={18} />
              <h4>Batch Create Schedules</h4>
              <button className="close-btn" onClick={() => setShowAdd(false)}><X size={18} /></button>
            </div>

            <div className="form-content">
              <div className="form-group">
                <label>Doctor Name</label>
                <input
                  value={newSlotBatch.doctor}
                  onChange={(e) => setNewSlotBatch({ ...newSlotBatch, doctor: e.target.value })}
                  placeholder="Enter doctor name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" value={newSlotBatch.startDate} onChange={(e) => setNewSlotBatch({ ...newSlotBatch, startDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" value={newSlotBatch.endDate} onChange={(e) => setNewSlotBatch({ ...newSlotBatch, endDate: e.target.value })} />
                </div>
              </div>

              <div className="time-blocks-list">
                <div className="list-header">
                  <span>Daily Time Slots</span>
                  <button className="add-block-btn" onClick={addTimeBlock}><Plus size={14} /> Add</button>
                </div>
                {newSlotBatch.timeBlocks.map((block, index) => (
                  <div key={index} className="time-block-row">
                    <input type="time" value={block.startTime} onChange={(e) => updateTimeBlock(index, "startTime", e.target.value)} />
                    <input type="time" value={block.endTime} onChange={(e) => updateTimeBlock(index, "endTime", e.target.value)} />
                    <input type="number" value={block.capacity} onChange={(e) => updateTimeBlock(index, "capacity", Number(e.target.value))} className="cap-input" />
                    <button className="remove-block-btn" onClick={() => removeTimeBlock(index)} disabled={newSlotBatch.timeBlocks.length <= 1}><X size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-footer">
              <button className="btn-save-batch" onClick={addSlotBatch}>Create All Schedules</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotManager;
