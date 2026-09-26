import React, { useState, useEffect } from 'react';
import { useHabitly } from '../context/HabitlyContext';
import { DayOfWeek } from '../types';

export const ScheduleArchitect: React.FC = () => {
  const { schedule, toggleScheduleBlockToday, deleteScheduleBlock, setIsAddScheduleOpen } = useHabitly();
  const [selectedDay, setSelectedDay] = useState<string>('today');
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  // Update real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTimeStr(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const days: { id: string; label: string }[] = [
    { id: 'today', label: '⚡ Today' },
    { id: 'mon', label: 'Mon' },
    { id: 'tue', label: 'Tue' },
    { id: 'wed', label: 'Wed' },
    { id: 'thu', label: 'Thu' },
    { id: 'fri', label: 'Fri' },
    { id: 'sat', label: 'Sat' },
    { id: 'sun', label: 'Sun' },
  ];

  const getTodayDayCode = (): DayOfWeek => {
    const d = new Date().getDay(); // 0 is Sun, 1 is Mon
    const map: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return map[d];
  };

  const activeFilterDay = selectedDay === 'today' ? getTodayDayCode() : (selectedDay as DayOfWeek);

  const filteredSchedule = schedule.filter((block) => block.days.includes(activeFilterDay));

  const isCurrentBlock = (start: string, end: string) => {
    if (selectedDay !== 'today') return false;
    return currentTimeStr >= start && currentTimeStr <= end;
  };

  return (
    <section id="schedule" className="dashboard-section section-schedule-hub">
      <div className="section-header-row">
        <div>
          <div className="section-eyebrow">CHRONO ARCHITECTURE</div>
          <h2 className="section-main-title">Custom Schedule & Time-Blocking</h2>
          <p className="section-subtitle">
            Architect your ideal daily flow. Align high-energy time blocks with habits and smart alerts.
          </p>
        </div>
        <div className="section-header-actions">
          <div className="current-clock-pill">
            <span className="live-dot" />
            <span className="clock-digits">LOCAL TIME: {currentTimeStr || '--:--'}</span>
          </div>
          <button className="btn-primary-neon" onClick={() => setIsAddScheduleOpen(true)}>
            <span>+ Add Time Block</span>
          </button>
        </div>
      </div>

      {/* Day Filter Bar */}
      <div className="schedule-day-tabs">
        {days.map((d) => (
          <button
            key={d.id}
            className={`schedule-day-tab ${selectedDay === d.id ? 'active' : ''}`}
            onClick={() => setSelectedDay(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Timeline Schedule Stream */}
      <div className="schedule-timeline-stream">
        {filteredSchedule.length === 0 ? (
          <div className="glass-card empty-schedule-card">
            <span className="empty-icon">📅</span>
            <h3>No Scheduled Blocks for this Day</h3>
            <p>Design your custom morning rituals, deep work sprints, or evening routines.</p>
            <button className="btn-primary-neon mt-4" onClick={() => setIsAddScheduleOpen(true)}>
              + Create First Time Block
            </button>
          </div>
        ) : (
          filteredSchedule.map((block) => {
            const isLiveNow = isCurrentBlock(block.startTime, block.endTime);

            return (
              <div
                key={block.id}
                className={`glass-card schedule-block-card ${block.completedToday ? 'is-completed' : ''} ${isLiveNow ? 'is-live-now' : ''}`}
                style={{ borderLeftColor: block.color }}
              >
                {isLiveNow && (
                  <div className="live-now-badge">
                    <span className="pulse-ring" />
                    <span>ACTIVE TIME BLOCK NOW</span>
                  </div>
                )}

                <div className="block-time-col">
                  <div className="time-range-box">
                    <span className="time-start">{block.startTime}</span>
                    <span className="time-sep">to</span>
                    <span className="time-end">{block.endTime}</span>
                  </div>
                  <span className="category-pill" style={{ color: block.color }}>
                    {block.category}
                  </span>
                </div>

                <div className="block-details-col">
                  <div className="block-title-row">
                    <span className="block-icon">{block.icon}</span>
                    <h3 className="block-title">{block.title}</h3>
                  </div>

                  <div className="block-days-pills">
                    {block.days.map((day) => (
                      <span key={day} className={`day-mini-tag ${day === activeFilterDay ? 'current' : ''}`}>
                        {day.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="block-actions-col">
                  <button
                    className={`btn-check-schedule ${block.completedToday ? 'completed' : ''}`}
                    onClick={() => toggleScheduleBlockToday(block.id)}
                  >
                    <span>{block.completedToday ? '✓ Executed' : '○ Mark Done'}</span>
                  </button>

                  <button
                    className="btn-delete-ghost"
                    onClick={() => {
                      if (confirm(`Delete time block "${block.title}"?`)) {
                        deleteScheduleBlock(block.id);
                      }
                    }}
                    title="Delete Time Block"
                  >
                    <span>🗑</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
