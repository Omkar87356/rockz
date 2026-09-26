import React from 'react';
import { useHabitly } from '../context/HabitlyContext';

export const SmartReminderCenter: React.FC = () => {
  const {
    reminders,
    toggleReminder,
    deleteReminder,
    setIsAddReminderOpen,
    user,
    requestNotificationPermission,
    testNotification,
  } = useHabitly();

  const handleToggleNotifications = async () => {
    if (!user.notificationsEnabled) {
      await requestNotificationPermission();
    } else {
      testNotification('Smart Notification Test ⚡', 'All telemetry and reminder triggers are functioning optimally.');
    }
  };

  return (
    <div className="glass-card smart-reminders-panel">
      <div className="card-top-tag-row">
        <div className="flex-align-center gap-8">
          <span className="card-top-tag">SMART NOTIFICATIONS & REMINDERS</span>
          <span className="badge-live-pulse">REAL-TIME</span>
        </div>

        <div className="flex-align-center gap-10">
          <button
            className={`btn-notification-toggle ${user.notificationsEnabled ? 'enabled' : 'disabled'}`}
            onClick={handleToggleNotifications}
          >
            <span>{user.notificationsEnabled ? '🔔 Web Alerts: Active' : '🔕 Enable Browser Alerts'}</span>
          </button>

          <button className="btn-secondary-cyber" onClick={() => setIsAddReminderOpen(true)}>
            <span>+ Add Reminder</span>
          </button>
        </div>
      </div>

      <p className="reminders-intro-text">
        Habitly continuously evaluates your daily streak horizon and schedules intelligent micro-reminders to eliminate missed routines.
      </p>

      {/* Reminders List */}
      <div className="reminders-grid-list">
        {reminders.map((rem) => (
          <div key={rem.id} className={`reminder-item-card ${rem.isActive ? 'is-active' : 'is-inactive'}`}>
            <div className="reminder-header-row">
              <div className="reminder-time-badge">
                <span className="time-clock-icon">⏰</span>
                <span className="time-digits">{rem.triggerTime}</span>
              </div>
              <span className={`reminder-type-tag type-${rem.type}`}>
                {rem.type.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <h4 className="reminder-title">{rem.title}</h4>
            <p className="reminder-message">"{rem.message}"</p>

            <div className="reminder-footer-row">
              <div className="days-mini-pills">
                {rem.days.map((d) => (
                  <span key={d} className="mini-day-pill">
                    {d.toUpperCase()}
                  </span>
                ))}
              </div>

              <div className="reminder-actions">
                <button
                  className={`btn-toggle-switch ${rem.isActive ? 'on' : 'off'}`}
                  onClick={() => toggleReminder(rem.id)}
                  title={rem.isActive ? 'Deactivate Reminder' : 'Activate Reminder'}
                >
                  <span className="switch-knob" />
                </button>

                <button
                  className="btn-delete-ghost"
                  onClick={() => deleteReminder(rem.id)}
                  title="Delete Reminder"
                >
                  <span>✕</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
