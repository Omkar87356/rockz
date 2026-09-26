import React, { useState } from 'react';
import { useHabitly } from '../../context/HabitlyContext';
import { DayOfWeek } from '../../types';

export const AddScheduleModal: React.FC = () => {
  const { isAddScheduleOpen, setIsAddScheduleOpen, addScheduleBlock, habits } = useHabitly();

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(['mon', 'tue', 'wed', 'thu', 'fri']);
  const [category, setCategory] = useState('Productivity');
  const [color, setColor] = useState('#6366F1');
  const [icon, setIcon] = useState('⚡');
  const [linkedHabitId, setLinkedHabitId] = useState('');

  if (!isAddScheduleOpen) return null;

  const dayOptions: { id: DayOfWeek; label: string }[] = [
    { id: 'mon', label: 'M' },
    { id: 'tue', label: 'T' },
    { id: 'wed', label: 'W' },
    { id: 'thu', label: 'T' },
    { id: 'fri', label: 'F' },
    { id: 'sat', label: 'S' },
    { id: 'sun', label: 'S' },
  ];

  const iconOptions = ['⚡', '🧘', '💧', '🏋️', '📚', '🎯', '💻', '🎨', '🏃', '☕', '🧠', '🌿'];
  const colorOptions = ['#6366F1', '#00F59B', '#D4FF00', '#06B6D4', '#F59E0B', '#EC4899', '#3B82F6'];

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

    addScheduleBlock({
      title: title.trim(),
      startTime,
      endTime,
      days: selectedDays,
      category,
      color,
      icon,
      linkedHabitId: linkedHabitId || undefined,
    });

    setTitle('');
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAddScheduleOpen(false)}>
      <div className="glass-modal-card modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">📅</span>
            <h3 className="modal-title">Create Custom Time Block</h3>
          </div>
          <button className="modal-close-btn" onClick={() => setIsAddScheduleOpen(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Time Block Name / Objective</label>
            <input
              type="text"
              className="cyber-input"
              placeholder="e.g. Deep Architecture Coding Sprint"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-row-grid">
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="cyber-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="cyber-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Repeat Days Selection */}
          <div className="form-group">
            <label className="form-label">Active Days of Week</label>
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

          <div className="form-row-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="cyber-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Productivity">⚡ Deep Productivity</option>
                <option value="Mindfulness">🧘 Mindfulness & Flow</option>
                <option value="Fitness">🏋️ Fitness & Body</option>
                <option value="Health">💧 Health & Bio Reset</option>
                <option value="Learning">📚 Learning & Books</option>
                <option value="Creativity">🎨 Creative Session</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Link to Habit (Optional)</label>
              <select
                className="cyber-select"
                value={linkedHabitId}
                onChange={(e) => setLinkedHabitId(e.target.value)}
              >
                <option value="">None (Independent Block)</option>
                {habits.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.icon} {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Icon & Color selector */}
          <div className="form-group">
            <label className="form-label">Select Icon</label>
            <div className="selector-options-row">
              {iconOptions.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  className={`selector-item-btn ${icon === ic ? 'selected' : ''}`}
                  onClick={() => setIcon(ic)}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Accent Theme Color</label>
            <div className="selector-options-row">
              {colorOptions.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`color-item-btn ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-secondary-cyber" onClick={() => setIsAddScheduleOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-neon">
              <span>+ Add to Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
