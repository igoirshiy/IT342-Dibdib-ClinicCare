import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Activity, Droplets, Footprints, Pill, StretchHorizontal, Moon } from "lucide-react";
import "./HealthChecklist.css";

const HealthChecklist = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  const userSuffix = user?.email ? `_${user.email}` : "";
  const TASKS_KEY = `healthTasks${userSuffix}`;
  const RESET_KEY = `healthTasksLastReset${userSuffix}`;

  // Load from localStorage on mount and check for daily reset
  useEffect(() => {
    if (!user?.email) return;

    const savedTasks = localStorage.getItem(TASKS_KEY);
    const lastResetDate = localStorage.getItem(RESET_KEY);
    const today = new Date().toDateString();

    if (savedTasks) {
      let parsedTasks = JSON.parse(savedTasks);
      
      // If today is a new day, reset all completed statuses
      if (lastResetDate !== today) {
        parsedTasks = parsedTasks.map(task => ({ ...task, completed: false }));
        localStorage.setItem(TASKS_KEY, JSON.stringify(parsedTasks));
        localStorage.setItem(RESET_KEY, today);
      }
      
      setTasks(parsedTasks);
    } else {
      // First time initialization for this user
      localStorage.setItem(RESET_KEY, today);
      setTasks([
        { id: 1, text: "Drink 8 glasses of water", completed: false, icon: "water" },
        { id: 2, text: "Walk for 20 minutes", completed: false, icon: "walk" },
        { id: 3, text: "Take vitamins", completed: false, icon: "vitamins" },
        { id: 4, text: "Stretch for 10 minutes", completed: false, icon: "stretch" },
        { id: 5, text: "Get 7-8 hours of sleep", completed: false, icon: "sleep" },
      ]);
    }
    setHasLoaded(true);
  }, [TASKS_KEY, RESET_KEY, user?.email]);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    if (user?.email && hasLoaded) {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }
  }, [tasks, TASKS_KEY, hasLoaded, user?.email]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask = {
        id: Date.now(),
        text: newTaskText.trim(),
        completed: false,
        icon: "activity"
      };
      setTasks([...tasks, newTask]);
      setNewTaskText("");
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'water': return <Droplets size={22} className="icon-blue" />;
      case 'walk': return <Footprints size={22} className="icon-green" />;
      case 'vitamins': return <Pill size={22} className="icon-orange" />;
      case 'stretch': return <StretchHorizontal size={22} className="icon-purple" />;
      case 'sleep': return <Moon size={22} className="icon-indigo" />;
      default: return <Activity size={22} className="icon-green" />;
    }
  };

  return (
    <div className="health-checklist-card design-ref">
      <div className="checklist-info-row">
        <p className="subtitle">Small tasks to do every day to stay healthy.</p>
        <div className="progress-label">
          Daily Progress: {completedCount} of {tasks.length}
        </div>
      </div>

      <div className="main-progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="checklist-container">
        {tasks.map(task => (
          <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
            <div className="task-left">
              <div className={`icon-box bg-${task.icon}`}>
                {renderIcon(task.icon)}
              </div>
              <span className="task-name">{task.text}</span>
            </div>
            
            <div className="task-right">
              {isEditing ? (
                <button className="remove-btn" onClick={() => deleteTask(task.id)}>
                  <Trash2 size={18} />
                </button>
              ) : (
                <button 
                  className={`check-action-btn ${task.completed ? 'is-done' : ''}`}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed ? "Done" : "Check"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="checklist-footer">
        {isEditing ? (
          <div className="edit-form">
            <input 
              type="text" 
              placeholder="Add new task..." 
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button className="add-btn" onClick={addTask}><Plus size={20} /></button>
            <button className="close-edit" onClick={() => setIsEditing(false)}><X size={20} /></button>
          </div>
        ) : (
          <button className="edit-mode-btn" onClick={() => setIsEditing(true)}>
            <Edit2 size={16} /> Edit Checklist
          </button>
        )}
      </div>
    </div>
  );
};

export default HealthChecklist;
