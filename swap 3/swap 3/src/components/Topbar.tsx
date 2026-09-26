import React from 'react';
import { useHabitly } from '../context/HabitlyContext';
import { useHealth } from '../context/HealthContext';

export const Topbar: React.FC = () => {
  const {
    user,
    setIsAddHabitOpen,
    toggleSound,
    setIsWidgetGuideOpen,
    unreadNotificationCount,
    setIsNotificationDrawerOpen,
  } = useHabitly();

  const { profile, metrics, setActiveHealthTab } = useHealth();

  const xpPercent = Math.min(100, Math.round((user.currentXP / user.nextLevelXP) * 100));

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="app-topbar anime-rpg-topbar">
      <div className="topbar-left">
        <div className="system-status-indicator">
          <span className="pulse-cyan-dot" />
          <span className="status-text">SYSTEM ONLINE</span>
        </div>
        <span className="topbar-divider">/</span>
        <div className="current-date-badge">
          <span>◈ {currentDate.toUpperCase()}</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Level & XP progression */}
        <div className="gamification-pill xp-pill" title={`Level ${user.level}: ${user.currentXP}/${user.nextLevelXP} XP`}>
          <div className="pill-badge level-badge">LV.{user.level}</div>
          <div className="pill-content">
            <div className="pill-title">{user.levelTitle}</div>
            <div className="pill-progress-track">
              <div className="pill-progress-fill" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
          <span className="pill-extra">{xpPercent}%</span>
        </div>

        {/* Spark Points */}
        <div className="gamification-pill spark-pill" title="✦ Spark Points available for inventory and skills">
          <span className="pill-icon">✦</span>
          <div className="pill-numeric">{user.sparkPoints.toLocaleString()}</div>
          <span className="pill-unit">SP</span>
        </div>

        {/* Streak Counter */}
        <div className="gamification-pill streak-pill" title={`${user.currentStreak} Day Momentum Active!`}>
          <span className="pill-icon flame-anim">🔥</span>
          <div className="pill-numeric">{user.currentStreak}</div>
          <span className="pill-unit">DAYS</span>
        </div>

        {/* Bio-Sync Health Telemetry Pill */}
        <div
          className="gamification-pill bio-sync-pill"
          title={`Bio-Sync Telemetry: BMI ${metrics.bmi} // ${profile.weightKg} kg // ${profile.restingHeartRateBpm} BPM`}
          onClick={() => {
            const el = document.getElementById('health');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{ cursor: 'pointer' }}
        >
          <span className="pill-icon">🧬</span>
          <div className="pill-numeric">BMI {metrics.bmi}</div>
          <span className="pill-unit" style={{ color: metrics.bmiColor }}>
            {profile.weightKg}kg
          </span>
        </div>

        {/* Action Controls */}
        <div className="topbar-actions">
          <button
            className="action-icon-btn notif-bell-btn"
            onClick={() => setIsNotificationDrawerOpen(true)}
            title="System Telemetry & Notifications"
          >
            <span>🔔</span>
            {unreadNotificationCount > 0 && (
              <span className="notif-badge-count">{unreadNotificationCount}</span>
            )}
          </button>

          <button
            className="action-icon-btn widget-btn"
            onClick={() => setIsWidgetGuideOpen(true)}
            title="HUD PWA Integration Guide"
          >
            <span>📱 +HUD</span>
          </button>

          <button
            className="action-icon-btn sound-btn"
            onClick={toggleSound}
            title={user.soundEnabled ? 'Mute Audio Synthesizer' : 'Unmute Audio Synthesizer'}
          >
            <span>{user.soundEnabled ? '🔊' : '🔇'}</span>
          </button>

          <button
            className="btn-primary-neon topbar-add-btn"
            onClick={() => setIsAddHabitOpen(true)}
          >
            <span className="plus-icon">+</span>
            <span>New Quest</span>
          </button>
        </div>
      </div>
    </header>
  );
};
