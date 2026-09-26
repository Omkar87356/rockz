import React, { useEffect } from 'react';
import { useHabitly } from '../../context/HabitlyContext';

export const QuestCompleteModal: React.FC = () => {
  const { questNotification, closeQuestNotification } = useHabitly();

  useEffect(() => {
    if (questNotification?.isOpen) {
      const timer = setTimeout(() => {
        closeQuestNotification();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [questNotification, closeQuestNotification]);

  if (!questNotification || !questNotification.isOpen) return null;

  return (
    <div className="quest-notification-overlay" onClick={closeQuestNotification}>
      <div className="quest-complete-system-window" onClick={(e) => e.stopPropagation()}>
        <div className="window-corner-tl" />
        <div className="window-corner-tr" />
        <div className="window-corner-bl" />
        <div className="window-corner-br" />

        <div className="system-top-banner">
          <span className="banner-icon">◈</span>
          <span className="banner-text">SYSTEM NOTIFICATION</span>
          <span className="banner-icon">◈</span>
        </div>

        <div className="quest-complete-content">
          <div className="quest-badge-hexagon">
            <span className="badge-check">✓</span>
          </div>

          <h2 className="quest-complete-headline">QUEST COMPLETE</h2>
          <h4 className="quest-target-name">"{questNotification.questName}"</h4>

          <div className="quest-rewards-bar">
            <div className="reward-chip xp-chip">
              <span className="chip-icon">⚡</span>
              <span className="chip-val">+{questNotification.xpGained} XP</span>
            </div>
            {questNotification.spGained > 0 && (
              <div className="reward-chip sp-chip">
                <span className="chip-icon">✦</span>
                <span className="chip-val">+{questNotification.spGained} SP</span>
              </div>
            )}
          </div>

          {/* Animated System Progress Arc */}
          <div className="quest-system-progress-meter">
            <div className="meter-track">
              <div className="meter-fill-animated" />
            </div>
          </div>

          {questNotification.statBoost && (
            <div className="quest-stat-boost-tag">
              <span className="boost-icon">▲</span>
              <span className="boost-text">{questNotification.statBoost}</span>
            </div>
          )}

          <button className="btn-primary-neon btn-sm mt-3" onClick={closeQuestNotification}>
            <span>DISMISS [ESC]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
