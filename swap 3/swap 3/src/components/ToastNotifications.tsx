import React from 'react';
import { useHabitly } from '../context/HabitlyContext';

export const ToastNotifications: React.FC = () => {
  const { toasts, removeToast } = useHabitly();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        let icon = '⚡';
        if (t.type === 'success') icon = '✓';
        if (t.type === 'warning') icon = '⚠️';
        if (t.type === 'achievement') icon = '🏆';

        return (
          <div key={t.id} className={`toast-card toast-${t.type}`} onClick={() => removeToast(t.id)}>
            <div className="toast-icon-box">{icon}</div>
            <div className="toast-content-col">
              <span className="toast-title">{t.title}</span>
              <span className="toast-message">{t.message}</span>
            </div>
            <button className="toast-dismiss" onClick={() => removeToast(t.id)}>
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};
