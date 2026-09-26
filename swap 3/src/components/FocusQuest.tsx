import React, { useState, useEffect } from 'react';
import { useHabitly } from '../context/HabitlyContext';
import { sounds } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';

export const FocusQuest: React.FC = () => {
  const { addToast, triggerQuestNotification } = useHabitly();

  const [questDurationMinutes, setQuestDurationMinutes] = useState<number>(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(3);
  const [selectedObjective, setSelectedObjective] = useState<string>('Deep Work & Core Architecture');

  const totalSeconds = questDurationMinutes * 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - timeLeftSeconds) / totalSeconds : 0;
  const progressPercent = Math.min(100, Math.round(progressRatio * 100));

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeftSeconds === 0) {
      setIsActive(false);
      sounds.playTimerBell();
      fireConfetti();
      setCompletedSessions((c) => c + 1);
      triggerQuestNotification(`FOCUS QUEST COMPLETE: ${selectedObjective}`, 50, 30, 'FOC +2');
      addToast('Focus Quest Cleared! 🎯', '+50 XP & +30 Spark Points awarded for deep flow state!', 'achievement');
      setTimeLeftSeconds(questDurationMinutes * 60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeftSeconds, questDurationMinutes, selectedObjective]);

  const setDuration = (mins: number) => {
    setIsActive(false);
    setQuestDurationMinutes(mins);
    setTimeLeftSeconds(mins * 60);
    sounds.playClick();
  };

  const toggleTimer = () => {
    sounds.playClick();
    setIsActive(!isActive);
  };

  const abandonTimer = () => {
    sounds.playClick();
    setIsActive(false);
    setTimeLeftSeconds(questDurationMinutes * 60);
    addToast('Focus Quest Paused', 'Session reset to initial duration.', 'info');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <section id="focus" className="dashboard-section section-focus-quest">
      <div className="section-header-row">
        <div>
          <div className="system-tag-eyebrow">◈ SYSTEM / ATTENTION ENGINE</div>
          <h2 className="section-main-title">Focus Quest Protocol</h2>
          <p className="section-subtitle">
            Enter the high-immersion flow state chamber. Block external stimuli and accumulate high-tier XP through uninterrupted focus.
          </p>
        </div>
        <div className="focus-sessions-counter-badge">
          <span className="counter-icon">🍅</span>
          <span className="counter-text">{completedSessions} SESSIONS COMPLETED</span>
        </div>
      </div>

      <div className="focus-quest-window system-window">
        {/* Preset Selector */}
        <div className="focus-modes-bar">
          <button
            className={`focus-mode-btn ${questDurationMinutes === 25 ? 'active' : ''}`}
            onClick={() => setDuration(25)}
          >
            <span>◈ 25 MIN FOCUS</span>
          </button>
          <button
            className={`focus-mode-btn ${questDurationMinutes === 50 ? 'active' : ''}`}
            onClick={() => setDuration(50)}
          >
            <span>◈ 50 MIN DEEP BLOCK</span>
          </button>
          <button
            className={`focus-mode-btn ${questDurationMinutes === 90 ? 'active' : ''}`}
            onClick={() => setDuration(90)}
          >
            <span>◈ 90 MIN ULTRADIAN</span>
          </button>
          <button
            className={`focus-mode-btn ${questDurationMinutes === 5 ? 'active' : ''}`}
            onClick={() => setDuration(5)}
          >
            <span>☕ 5 MIN RECHARGE</span>
          </button>
          <button
            className={`focus-mode-btn ${questDurationMinutes === 15 ? 'active' : ''}`}
            onClick={() => setDuration(15)}
          >
            <span>🌿 15 MIN REST</span>
          </button>
        </div>

        {/* Central Holographic Timer Circle */}
        <div className="focus-center-stage">
          <div className="holographic-clock-wrapper">
            <svg className="timer-svg-circle" viewBox="0 0 220 220" width="220" height="220">
              <defs>
                <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
                <filter id="focusGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <circle
                className="timer-track-circle"
                cx="110"
                cy="110"
                r={radius}
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                className="timer-progress-circle"
                cx="110"
                cy="110"
                r={radius}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                filter="url(#focusGlow)"
              />
            </svg>

            <div className="timer-clock-digits-box">
              <span className="timer-quest-tag">
                {isActive ? '● PROTOCOL RUNNING' : '○ STANDBY'}
              </span>
              <h2 className="timer-big-digits">{formatTime(timeLeftSeconds)}</h2>
              <span className="timer-reward-preview">+50 XP & +30 SP AVAILABLE</span>
            </div>
          </div>
        </div>

        {/* Quest Directive Input */}
        <div className="focus-quest-objective-row">
          <span className="objective-label">ACTIVE OBJECTIVE:</span>
          <input
            type="text"
            className="cyber-input objective-input"
            value={selectedObjective}
            onChange={(e) => setSelectedObjective(e.target.value)}
            placeholder="Name your current focus directive..."
          />
        </div>

        {/* Action Controls */}
        <div className="focus-controls-row">
          <button
            className={`btn-primary-neon focus-action-btn ${isActive ? 'btn-active-pause' : 'btn-active-start'}`}
            onClick={toggleTimer}
          >
            <span>{isActive ? '⏸ PAUSE PROTOCOL' : '⚡ ACCEPT QUEST & ENGAGE'}</span>
          </button>

          <button className="btn-secondary-cyber focus-abandon-btn" onClick={abandonTimer}>
            <span>✕ ABANDON / RESET</span>
          </button>
        </div>
      </div>
    </section>
  );
};
