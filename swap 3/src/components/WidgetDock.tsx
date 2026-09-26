import React, { useState, useEffect } from 'react';
import { useHabitly } from '../context/HabitlyContext';
import { STOIC_QUOTES } from '../utils/storage';
import { sounds } from '../utils/sound';

export const WidgetDock: React.FC = () => {
  const { habits, toggleHabit, user, setIsWidgetGuideOpen, addToast } = useHabitly();

  // Pomodoro state
  const [pomoMode, setPomoMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [pomoTimeLeft, setPomoTimeLeft] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(false);
  const [pomoSessionsCompleted, setPomoSessionsCompleted] = useState(2);

  // Quote state
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Quick 1-tap select state
  const [selectedHabitId, setSelectedHabitId] = useState(habits[0]?.id || '');

  // Pomodoro timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPomoRunning && pomoTimeLeft > 0) {
      timer = setInterval(() => {
        setPomoTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPomoRunning && pomoTimeLeft === 0) {
      setIsPomoRunning(false);
      sounds.playTimerBell();
      if (pomoMode === 'focus') {
        setPomoSessionsCompleted((c) => c + 1);
        addToast('Focus Session Crushed! 🍅', 'Take a 5-minute break. Great flow state!', 'achievement');
        setPomoMode('shortBreak');
        setPomoTimeLeft(5 * 60);
      } else {
        addToast('Break Complete! ⚡', 'Ready to begin your next deep focus block?', 'info');
        setPomoMode('focus');
        setPomoTimeLeft(25 * 60);
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPomoRunning, pomoTimeLeft, pomoMode]);

  const switchPomoMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsPomoRunning(false);
    setPomoMode(mode);
    if (mode === 'focus') setPomoTimeLeft(25 * 60);
    if (mode === 'shortBreak') setPomoTimeLeft(5 * 60);
    if (mode === 'longBreak') setPomoTimeLeft(15 * 60);
    sounds.playClick();
  };

  const togglePomo = () => {
    sounds.playClick();
    setIsPomoRunning(!isPomoRunning);
  };

  const resetPomo = () => {
    sounds.playClick();
    setIsPomoRunning(false);
    if (pomoMode === 'focus') setPomoTimeLeft(25 * 60);
    if (pomoMode === 'shortBreak') setPomoTimeLeft(5 * 60);
    if (pomoMode === 'longBreak') setPomoTimeLeft(15 * 60);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const nextQuote = () => {
    sounds.playClick();
    setQuoteIndex((prev) => (prev + 1) % STOIC_QUOTES.length);
  };

  const handleQuickLog = () => {
    if (!selectedHabitId) return;
    toggleHabit(selectedHabitId);
  };

  const activeHabits = habits.filter((h) => h.status !== 'paused');

  return (
    <section id="widgets" className="dashboard-section section-widget-dock">
      <div className="section-header-row">
        <div>
          <div className="section-eyebrow">MODULAR PRODUCTIVITY</div>
          <h2 className="section-main-title">Quick-Access Widget Dock</h2>
          <p className="section-subtitle">Tactical micro-tools designed for rapid execution and phone/desktop home screen embedding.</p>
        </div>
        <div className="section-header-actions">
          <button className="btn-secondary-cyber" onClick={() => setIsWidgetGuideOpen(true)}>
            <span>📱 Install Widget to Phone</span>
          </button>
        </div>
      </div>

      <div className="widgets-grid-container">
        {/* Widget 1: Pomodoro Deep Focus Timer */}
        <div className="glass-card widget-card pomodoro-widget">
          <div className="widget-header">
            <div className="widget-title-wrap">
              <span className="widget-icon">⏱️</span>
              <span className="widget-heading">POMODORO FOCUS</span>
            </div>
            <span className="widget-badge">{pomoSessionsCompleted} Sessions Done</span>
          </div>

          <div className="pomo-modes-bar">
            <button
              className={`pomo-mode-btn ${pomoMode === 'focus' ? 'active' : ''}`}
              onClick={() => switchPomoMode('focus')}
            >
              25m Focus
            </button>
            <button
              className={`pomo-mode-btn ${pomoMode === 'shortBreak' ? 'active' : ''}`}
              onClick={() => switchPomoMode('shortBreak')}
            >
              5m Rest
            </button>
            <button
              className={`pomo-mode-btn ${pomoMode === 'longBreak' ? 'active' : ''}`}
              onClick={() => switchPomoMode('longBreak')}
            >
              15m Rest
            </button>
          </div>

          <div className="pomo-display">
            <div className={`pomo-digits ${isPomoRunning ? 'pulsing' : ''}`}>
              {formatTime(pomoTimeLeft)}
            </div>
            <span className="pomo-subtext">
              {isPomoRunning ? '⚡ Focus State Active • Zero Distractions' : 'Paused / Ready'}
            </span>
          </div>

          <div className="pomo-controls">
            <button
              className={`pomo-main-btn ${isPomoRunning ? 'running' : ''}`}
              onClick={togglePomo}
            >
              <span>{isPomoRunning ? '⏸ Pause Focus' : '▶ Start Focus'}</span>
            </button>
            <button className="pomo-reset-btn" onClick={resetPomo} title="Reset Timer">
              <span>↺</span>
            </button>
          </div>
        </div>

        {/* Widget 2: 1-Tap Quick Logger */}
        <div className="glass-card widget-card quick-log-widget">
          <div className="widget-header">
            <div className="widget-title-wrap">
              <span className="widget-icon">⚡</span>
              <span className="widget-heading">1-TAP QUICK LOGGER</span>
            </div>
            <span className="widget-badge neon-green">Instant Check-in</span>
          </div>

          <p className="widget-body-text">Select any active habit below to toggle check-in immediately:</p>

          <div className="quick-logger-form">
            <select
              className="cyber-select"
              value={selectedHabitId}
              onChange={(e) => setSelectedHabitId(e.target.value)}
            >
              {activeHabits.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.icon} {h.name} {h.completedToday ? '(Completed Today)' : ''}
                </option>
              ))}
            </select>

            <button className="btn-primary-neon quick-log-submit" onClick={handleQuickLog}>
              <span>⚡ Execute 1-Tap Log</span>
            </button>
          </div>

          <div className="quick-logger-status">
            {selectedHabitId && (
              <span className="status-note">
                Status:{' '}
                {habits.find((h) => h.id === selectedHabitId)?.completedToday ? (
                  <strong className="text-chartreuse">Completed Today (Crushed!)</strong>
                ) : (
                  <strong className="text-amber">Pending Check-in</strong>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Widget 3: Streak Shield & Resilience */}
        <div className="glass-card widget-card streak-shield-widget">
          <div className="widget-header">
            <div className="widget-title-wrap">
              <span className="widget-icon">🛡️</span>
              <span className="widget-heading">STREAK SHIELD ARMOR</span>
            </div>
            <span className="widget-badge active-shield-tag">{user.streakShields} Available</span>
          </div>

          <div className="shield-card-body">
            <div className="shield-icon-visual">
              <span className="shield-big-icon">🛡️</span>
              <div className="shield-aura" />
            </div>
            <div className="shield-text-col">
              <h4 className="shield-title">Streak Protection Active</h4>
              <p className="shield-desc">
                If you encounter unavoidable travel, sick days, or life transitions, use the <strong>Skip</strong> or <strong>Pause</strong> feature. Your streaks stay 100% frozen and protected.
              </p>
            </div>
          </div>

          <div className="shield-stats-row">
            <div className="shield-stat">
              <span className="s-label">Current Streak</span>
              <span className="s-val text-chartreuse">🔥 {user.currentStreak} Days</span>
            </div>
            <div className="shield-stat">
              <span className="s-label">Streak Status</span>
              <span className="s-val text-cyan">Protected</span>
            </div>
          </div>
        </div>

        {/* Widget 4: Stoic Mindset & Philosophy */}
        <div className="glass-card widget-card stoic-quote-widget">
          <div className="widget-header">
            <div className="widget-title-wrap">
              <span className="widget-icon">📜</span>
              <span className="widget-heading">STOIC PROTOCOL</span>
            </div>
            <button className="quote-refresh-btn" onClick={nextQuote} title="Next Wisdom Quote">
              <span>↻ New Quote</span>
            </button>
          </div>

          <div className="quote-body">
            <span className="quote-marks">“</span>
            <p className="quote-text">{STOIC_QUOTES[quoteIndex].text}</p>
            <span className="quote-author">— {STOIC_QUOTES[quoteIndex].author}</span>
          </div>

          <div className="widget-footer-action">
            <button className="btn-link-chartreuse" onClick={() => setIsWidgetGuideOpen(true)}>
              Pin widgets to iOS / Android / Mac screen →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
