import React from 'react';
import { useHabitly } from '../context/HabitlyContext';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    testNotification,
  } = useHabitly();

  if (!isNotificationDrawerOpen) return null;

  return (
    <div className="notification-drawer-backdrop" onClick={() => setIsNotificationDrawerOpen(false)}>
      <div className="glass-modal-card notification-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header-row">
          <div className="drawer-title-wrap">
            <span className="drawer-bell-icon">🔔</span>
            <h3 className="drawer-title">Notifications & Smart Reminders</h3>
          </div>
          <div className="drawer-actions-top">
            <button className="btn-link-chartreuse" onClick={() => testNotification('Test Pulse ⚡', 'Notification stream active.')}>
              Test Alert
            </button>
            <button className="btn-delete-ghost" onClick={clearAllNotifications} title="Clear All">
              Clear All
            </button>
            <button className="modal-close-btn" onClick={() => setIsNotificationDrawerOpen(false)}>
              ✕
            </button>
          </div>
        </div>

        <div className="notification-items-stream">
          {notifications.length === 0 ? (
            <div className="empty-notifs">
              <span className="empty-bell">🔕</span>
              <p>No new notifications. Everything is on schedule!</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`drawer-notif-card notif-${n.type} ${n.isRead ? 'read' : 'unread'}`}
                onClick={() => markNotificationRead(n.id)}
              >
                <div className="notif-top">
                  <span className="notif-title">{n.title}</span>
                  <span className="notif-time">{n.timestamp}</span>
                </div>
                <p className="notif-body">{n.message}</p>
                {!n.isRead && <span className="unread-dot-badge" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
