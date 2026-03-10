import React, { useState } from "react";
import { Clock, Plus, Save, X, CalendarOff } from "lucide-react";
import "./SlotManager.css";

const initialSlots = [
  {
    id: 1,
    doctor: "Dr. Santos",
    date: "March 7, 2026",
    startTime: "07:30",
    endTime: "10:30",
    capacity: 10,
    booked: 6,
    disabled: false,
  },
  {
    id: 2,
    doctor: "Dr. Reyes",
    date: "March 7, 2026",
    startTime: "08:00",
    endTime: "12:00",
    capacity: 12,
    booked: 8,
    disabled: false,
  },
  {
    id: 3,
    doctor: "Dr. Johnson",
    date: "March 7, 2026",
    startTime: "09:00",
    endTime: "11:00",
    capacity: 6,
    booked: 6,
    disabled: false,
  },
  {
    id: 4,
    doctor: "Dr. Cruz",
    date: "March 8, 2026",
    startTime: "13:00",
    endTime: "16:00",
    capacity: 8,
    booked: 2,
    disabled: false,
  },
  {
    id: 5,
    doctor: "Dr. Lim",
    date: "March 8, 2026",
    startTime: "07:30",
    endTime: "09:30",
    capacity: 6,
    booked: 0,
    disabled: true,
  },
];

const formatTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2, "0")} ${ampm}`;
};

const SlotManager = () => {
  const [slots, setSlots] = useState(initialSlots);
  const [editingId, setEditingId] = useState(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newSlot, setNewSlot] = useState({
    doctor: "",
    date: "",
    startTime: "08:00",
    endTime: "12:00",
    capacity: 8,
  });

  const startEdit = (slot) => {
    setEditingId(slot.id);
    setEditStart(slot.startTime);
    setEditEnd(slot.endTime);
  };

  const saveEdit = (id) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, startTime: editStart, endTime: editEnd } : s
      )
    );
    setEditingId(null);
    alert("✅ Slot updated successfully!");
  };

  const toggleDisable = (id) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, disabled: !s.disabled } : s))
    );
  };

  const addSlot = () => {
    if (!newSlot.doctor || !newSlot.date) {
      alert("Please fill in doctor and date");
      return;
    }
    const id = Math.max(...slots.map((s) => s.id)) + 1;
    setSlots((prev) => [
      ...prev,
      { ...newSlot, id, booked: 0, disabled: false },
    ]);
    setShowAdd(false);
    setNewSlot({
      doctor: "",
      date: "",
      startTime: "08:00",
      endTime: "12:00",
      capacity: 8,
    });
    alert("✅ New slot added!");
  };

  return (
    <div className="slot-manager glass-card">
      <div className="card-header">
        <Clock size={22} />
        <h3>Slot / Schedule Management</h3>
      </div>

      <div className="slot-list">
        {slots.map((slot) => {
          const remaining = slot.capacity - slot.booked;
          const pct = (slot.booked / slot.capacity) * 100;
          const isEditing = editingId === slot.id;

          return (
            <div
              key={slot.id}
              className={`slot-item ${slot.disabled ? "slot-item--disabled" : ""}`}
            >
              <div className="slot-item-top">
                <div>
                  <h4 className="slot-doctor">{slot.doctor}</h4>
                  <span className="slot-date">{slot.date}</span>
                </div>
                {slot.disabled && (
                  <span className="slot-badge slot-badge--off">Unavailable</span>
                )}
              </div>

              {isEditing ? (
                <div className="slot-edit-row">
                  <input
                    type="time"
                    value={editStart}
                    onChange={(e) => setEditStart(e.target.value)}
                    className="slot-time-input"
                  />
                  <span className="slot-time-sep">–</span>
                  <input
                    type="time"
                    value={editEnd}
                    onChange={(e) => setEditEnd(e.target.value)}
                    className="slot-time-input"
                  />
                  <button
                    className="slot-btn slot-btn--save"
                    onClick={() => saveEdit(slot.id)}
                  >
                    <Save size={14} /> Save
                  </button>
                  <button
                    className="slot-btn slot-btn--cancel"
                    onClick={() => setEditingId(null)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="slot-time-row">
                  <span className="slot-time">
                    {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                  </span>
                </div>
              )}

              <div className="slot-capacity">
                <div className="slot-capacity-bar">
                  <div
                    className="slot-capacity-fill"
                    style={{
                      width: `${pct}%`,
                      background:
                        pct >= 100 ? "#ef4444" : pct >= 75 ? "#f59e0b" : "#3b82f6",
                    }}
                  />
                </div>
                <span className="slot-capacity-text">
                  {remaining > 0
                    ? `${remaining} / ${slot.capacity} remaining`
                    : "Full"}
                </span>
              </div>

              <div className="slot-actions">
                {!isEditing && (
                  <button
                    className="slot-btn slot-btn--edit"
                    onClick={() => startEdit(slot)}
                  >
                    Edit Times
                  </button>
                )}
                <button
                  className={`slot-btn ${
                    slot.disabled ? "slot-btn--enable" : "slot-btn--disable"
                  }`}
                  onClick={() => toggleDisable(slot.id)}
                >
                  <CalendarOff size={14} />
                  {slot.disabled ? "Enable" : "Disable Date"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd ? (
        <div className="slot-add-form glass-card">
          <h4 className="slot-add-title">Add New Slot</h4>
          <div className="slot-add-fields">
            <input
              placeholder="Doctor name"
              value={newSlot.doctor}
              onChange={(e) => setNewSlot({ ...newSlot, doctor: e.target.value })}
              className="slot-input"
            />
            <input
              type="date"
              value={newSlot.date}
              onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
              className="slot-input"
            />
            <div className="slot-add-times">
              <input
                type="time"
                value={newSlot.startTime}
                onChange={(e) =>
                  setNewSlot({ ...newSlot, startTime: e.target.value })
                }
                className="slot-time-input"
              />
              <span className="slot-time-sep">–</span>
              <input
                type="time"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                className="slot-time-input"
              />
            </div>
            <input
              type="number"
              placeholder="Capacity"
              value={newSlot.capacity}
              onChange={(e) =>
                setNewSlot({ ...newSlot, capacity: Number(e.target.value) })
              }
              className="slot-input"
              min={1}
            />
          </div>
          <div className="slot-add-actions">
            <button className="slot-btn slot-btn--save" onClick={addSlot}>
              <Save size={14} /> Add Slot
            </button>
            <button
              className="slot-btn slot-btn--cancel"
              onClick={() => setShowAdd(false)}
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="slot-btn slot-btn--add" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add New Slot
        </button>
      )}
    </div>
  );
};

export default SlotManager;
