import React, { useState } from 'react';
import { useHabitly } from '../../context/HabitlyContext';
import { DayOfWeek } from '../../types';

export const AddReminderModal: React.FC = () => {
  const { isAddReminderOpen, setIsAddReminderOpen, addReminder } = useHabitly();

  const [title, setTitle] = useState('');
  const [triggerTime, setTriggerTime] = useState('08:00');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
  const [type, setType] = useState<'habit' | 'schedule' | 'streak_shield' | 'hydration' | 'custom'>('custom');
  const [message, setMessage] = useState('');

  if (!isAddReminderOpen) return null;

  const dayOptions: { id: DayOfWeek; label: string }[] = [
    { id: 'mon', label: 'M' },
    { id: 'tue', label: 'T' },
    { id: 'wed', label: 'W' },
    { id: 'thu', label: 'T' },
    { id: 'fri', label: 'F' },
    { id: 'sat', label: 'S' },
    { id: 'sun', label: 'S' },
  ];

  const toggleDay = (d: DayOfWeek) => {
    if (selectedDays.includes(d)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((x) => x !== d));
      }
    } else {
      setSelectedDays([...selectedDays, d]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder({
      title: title.trim(),
      triggerTime,
      days: selectedDays,
      type,
      message: message.trim() || 'Focus protocol reminder activated.',
      isActive: true,
    });

    setTitle('');
    setMessage('');
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAddReminderOpen(false)}>
      <div className="glass-modal-card modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">🔔</span>
            <h3 className="modal-title">Create Smart Reminder</h3>
          </div>
          <button className="modal-close-btn" onClick={() => setIsAddReminderOpen(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Reminder Name / Alert Label</label>
            <input
              type="text"
              className="cyber-input"
              placeholder="e.g. Afternoon Energy Reset & Water"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-row-grid">
            <div className="form-group">
              <label className="form-label">Alert Trigger Time</label>
              <input
                type="time"
                className="cyber-input"
                value={triggerTime}
                onChange={(e) => setTriggerTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Alert Intelligence Type</label>
              <select
                className="cyber-select"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="custom">⚡ Custom Routine Reminder</option>
                <option value="habit">🎯 Pre-Habit Prompt (15m before)</option>
                <option value="schedule">📅 Schedule Block Start</option>
                <option value="streak_shield">🛡️ Streak Defense Warning</option>
                <option value="hydration">💧 Hydration & Bio Check</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Active Days</label>
            <div className="day-selector-row">
              {dayOptions.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  className={`day-toggle-btn ${selectedDays.includes(d.id) ? 'selected' : ''}`}
                  onClick={() => toggleDay(d.id)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Motivational Push Notification Text</label>
            <textarea
              className="cyber-textarea"
              rows={2}
              placeholder="What message should appear on your screen?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-secondary-cyber" onClick={() => setIsAddReminderOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-neon">
              <span>+ Set Smart Reminder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
