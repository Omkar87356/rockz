import React from 'react';
import { useHabitly } from '../context/HabitlyContext';

export const CommandCenter: React.FC = () => {
  const {
    habits,
    tasks,
    user,
    playerStats,
    todayCompletionRate,
    toggleHabit,
    incrementHabitCount,
    openSkipModal,
    openPauseModal,
    resumeHabit,
    setIsAddHabitOpen,
    setActiveSection,
    toggleTask,
  } = useHabitly();

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (todayCompletionRate / 100) * circumference;

  const activeHabits = habits.filter((h) => h.status !== 'paused');
  const pausedHabits = habits.filter((h) => h.status === 'paused');
  const completedCount = activeHabits.filter((h) => h.completedToday).length;
  const remainingCount = activeHabits.length - completedCount;
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 4);

  // Recommended quest logic (AI System Assistant)
  const firstIncompleteHabit = activeHabits.find((h) => !h.completedToday) || activeHabits[0];
  const recommendedHabitName = firstIncompleteHabit ? firstIncompleteHabit.name : 'All Daily Quests Cleared';

  const xpPercent = Math.min(100, Math.round((user.currentXP / user.nextLevelXP) * 100));

  const handleAcceptRecommendation = () => {
    if (firstIncompleteHabit) {
      if (firstIncompleteHabit.frequencyCount > 1) {
        incrementHabitCount(firstIncompleteHabit.id);
      } else {
        toggleHabit(firstIncompleteHabit.id);
      }
    }
  };

  return (
    <section id="command-center" className="dashboard-section section-command-center">
      {/* Top System Welcome Header */}
      <div className="system-welcome-banner system-window">
        <div className="welcome-meta-col">
          <div className="system-status-eyebrow">
            <span className="pulse-cyan-dot" />
            <span>SYSTEM ONLINE // NEURAL LINK ESTABLISHED</span>
          </div>
          <h1 className="system-player-heading">WELCOME, PLAYER ONE</h1>
          <div className="system-player-tier">
            <span className="rank-badge">LEVEL {user.level}</span>
            <span className="rank-title">◈ {user.levelTitle}</span>
          </div>
        </div>

        <div className="system-stat-pills-row">
          <div className="sys-pill xp-sys-pill">
            <span className="sys-pill-label">EXPERIENCE</span>
            <div className="sys-pill-bar">
              <div className="sys-pill-fill" style={{ width: `${xpPercent}%` }} />
            </div>
            <span className="sys-pill-digits">{user.currentXP} / {user.nextLevelXP} XP ({xpPercent}%)</span>
          </div>

          <div className="sys-pill streak-sys-pill">
            <span className="sys-pill-label">STREAK MOMENTUM</span>
            <span className="sys-pill-val highlight-flame">🔥 {user.currentStreak} DAYS</span>
          </div>

          <div className="sys-pill sparks-sys-pill">
            <span className="sys-pill-label">SPARK RESONANCE</span>
            <span className="sys-pill-val highlight-cyan">✦ {user.sparkPoints} SP</span>
          </div>
        </div>
      </div>

      {/* Daily System Brief (Requirement 18) */}
      <div className="daily-system-brief system-window">
        <div className="brief-header">
          <span className="brief-title-tag">◈ DAILY SYSTEM BRIEF</span>
          <span className="brief-timestamp">CYCLE STATUS: ACTIVE</span>
        </div>

        <div className="brief-metrics-grid">
          <div className="brief-metric-tile">
            <span className="tile-label">MOMENTUM</span>
            <span className="tile-value highlight-flame">🔥 {user.currentStreak} DAY STREAK</span>
          </div>

          <div className="brief-metric-tile">
            <span className="tile-label">DAILY QUESTS REMAINING</span>
            <span className="tile-value highlight-cyan">{remainingCount} PENDING</span>
          </div>

          <div className="brief-metric-tile">
            <span className="tile-label">TODAY'S EXECUTION RATE</span>
            <span className="tile-value highlight-emerald">{todayCompletionRate}% CLEAR</span>
          </div>

          <div className="brief-recommendation-tile">
            <div className="rec-text-col">
              <span className="rec-eyebrow">OPTIMAL DIRECTIVE:</span>
              <span className="rec-quest-name">{recommendedHabitName}</span>
            </div>
            {firstIncompleteHabit && (
              <button className="btn-primary-neon btn-sm" onClick={handleAcceptRecommendation}>
                <span>[ ENGAGE QUEST ]</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI System Message (Requirement 14) */}
      <div className="ai-system-message-panel system-window">
        <div className="ai-message-header">
          <div className="ai-header-left">
            <span className="ai-avatar-icon">🤖</span>
            <span className="ai-panel-title">[SYSTEM MESSAGE // AI PROTOCOL]</span>
          </div>
          <span className="ai-confidence-badge">TELEMETRY SYNCHRONIZED</span>
        </div>

        <div className="ai-message-content">
          <p className="ai-message-text">
            ◈ <strong>Attentional Analysis:</strong> Your execution velocity has increased by 14% this cycle.
            <br />
            ◈ <strong>Circadian Window:</strong> Strongest cognitive productivity period is mapped between <strong>09:00 - 12:00</strong>.
            <br />
            ◈ <strong>Priority Directive:</strong> Execute your <span className="highlight-cyan">{recommendedHabitName}</span> quest to reinforce your current <span className="highlight-flame">{user.currentStreak}-day streak</span>.
          </p>

          <div className="ai-message-actions">
            {firstIncompleteHabit ? (
              <button className="btn-primary-neon" onClick={handleAcceptRecommendation}>
                <span>[ ACCEPT RECOMMENDATION ]</span>
              </button>
            ) : (
              <div className="all-clear-badge">
                <span>✓ ALL DAILY DIRECTIVES COMPLETED</span>
              </div>
            )}
            <button
              className="btn-secondary-cyber"
              onClick={() => {
                setActiveSection('status');
                document.getElementById('status')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Inspect Character Status →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Execution Gauge + Quick-Access Quest Strip */}
      <div className="command-center-grid">
        {/* Holographic Circular Execution Gauge */}
        <div className="system-window hero-gauge-card">
          <div className="system-window-header">
            <span className="system-window-title">EXECUTION GAUGE</span>
            <span className="system-code-id">TELEMETRY</span>
          </div>

          <div className="gauge-content">
            <div className="svg-gauge-wrapper">
              <svg className="circular-progress-svg" viewBox="0 0 160 160" width="150" height="150">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#00FF9C" />
                  </linearGradient>
                  <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <circle
                  className="gauge-bg-circle"
                  cx="80"
                  cy="80"
                  r={radius}
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  className="gauge-progress-circle"
                  cx="80"
                  cy="80"
                  r={radius}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  filter="url(#gaugeGlow)"
                />
              </svg>
              <div className="gauge-center-text">
                <span className="gauge-percentage-number">{todayCompletionRate}%</span>
                <span className="gauge-label">CLEARED</span>
              </div>
            </div>

            <div className="gauge-stats-details">
              <div className="gauge-metric-item">
                <span className="metric-title">Active Quests</span>
                <span className="metric-val">{completedCount} / {activeHabits.length} Done</span>
              </div>
              <div className="gauge-metric-item">
                <span className="metric-title">Endurance Streak</span>
                <span className="metric-val highlight-cyan">🔥 {user.currentStreak} Days</span>
              </div>
              <div className="gauge-metric-item">
                <span className="metric-title">Energy Reserves</span>
                <span className="metric-val highlight-violet">✦ {user.sparkPoints} SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick-Access 1-Tap Habit Quest Chips */}
        <div className="system-window quick-habits-card">
          <div className="system-window-header">
            <span className="system-window-title">ACTIVE QUEST STRIP</span>
            <span className="system-code-id">1-TAP EXECUTION</span>
          </div>

          <div className="quick-chips-container">
            {activeHabits.length === 0 ? (
              <div className="empty-state-card">
                <span>No active quests. Click "+ Add Habit" to calibrate a protocol!</span>
              </div>
            ) : (
              activeHabits.map((h) => {
                const isMulti =
                  h.frequencyCount > 1 &&
                  h.frequencyType !== 'interval' &&
                  h.frequencyType !== 'days_per_week' &&
                  h.frequencyType !== 'days_per_month';
                const unitStr = h.frequencyUnit || 'times';

                return (
                  <div
                    key={h.id}
                    className={`quick-habit-chip ${h.completedToday ? 'completed' : ''} ${h.status === 'skipped' ? 'skipped' : ''}`}
                  >
                    <div
                      className="chip-left"
                      onClick={() => (isMulti ? incrementHabitCount(h.id) : toggleHabit(h.id))}
                    >
                      <div className="chip-icon-box" style={{ borderColor: h.color }}>
                        <span>{h.icon}</span>
                      </div>
                      <div className="chip-text-meta">
                        <span className="chip-name">{h.name}</span>
                        <div className="chip-subline">
                          <span className="chip-streak">🔥 {h.streak}d streak</span>
                          {isMulti ? (
                            <span className="chip-freq-count-badge">
                              {h.todayCount || 0}/{h.frequencyCount} {unitStr}
                            </span>
                          ) : (
                            <span className="chip-category-text">• {h.category}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="chip-actions">
                      {isMulti && !h.completedToday ? (
                        <button
                          className="chip-increment-btn"
                          onClick={() => incrementHabitCount(h.id)}
                          title={`+1 ${unitStr}`}
                        >
                          <span>+</span>
                        </button>
                      ) : null}

                      <button
                        className={`chip-check-btn ${h.completedToday ? 'checked' : ''}`}
                        onClick={() => toggleHabit(h.id)}
                        title={h.completedToday ? 'Mark Incomplete' : 'Complete Quest'}
                      >
                        <span>{h.completedToday ? '✓' : '○'}</span>
                      </button>

                      <button
                        className="chip-skip-btn"
                        onClick={() => openSkipModal(h.id, h.name)}
                        title="Skip for today (Preserve Streak)"
                      >
                        <span>Skip</span>
                      </button>

                      <button
                        className="chip-pause-btn"
                        onClick={() => openPauseModal(h.id, h.name)}
                        title="Pause Habit for life phases"
                      >
                        <span>⏸</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Paused Habits Notice */}
            {pausedHabits.length > 0 && (
              <div className="paused-habits-notice">
                <span className="notice-icon">⏸️</span>
                <span className="notice-text">
                  {pausedHabits.length} habit(s) in Life-Phase Freeze: {pausedHabits.map((p) => p.name).join(', ')}
                </span>
                <button
                  className="btn-link-chartreuse"
                  onClick={() => {
                    setActiveSection('habits');
                    document.getElementById('habits')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Manage Hub
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mini RPG Attributes Strip on Dashboard */}
      <div className="dashboard-stats-strip system-window">
        <div className="system-window-header">
          <span className="system-window-title">PLAYER ATTRIBUTES MATRIX</span>
          <button
            className="btn-link-chartreuse"
            onClick={() => {
              setActiveSection('status');
              document.getElementById('status')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Detailed Character Sheet →
          </button>
        </div>
        <div className="stats-strip-grid">
          <div className="strip-stat-item">
            <span className="strip-attr-icon">⚔️</span>
            <div className="strip-attr-info">
              <span className="strip-attr-label">STR (POWER)</span>
              <span className="strip-attr-val highlight-cyan">{playerStats.str}</span>
            </div>
          </div>
          <div className="strip-stat-item">
            <span className="strip-attr-icon">🧠</span>
            <div className="strip-attr-info">
              <span className="strip-attr-label">INT (MIND)</span>
              <span className="strip-attr-val highlight-violet">{playerStats.int}</span>
            </div>
          </div>
          <div className="strip-stat-item">
            <span className="strip-attr-icon">💚</span>
            <div className="strip-attr-info">
              <span className="strip-attr-label">VIT (HEALTH)</span>
              <span className="strip-attr-val highlight-emerald">{playerStats.vit}</span>
            </div>
          </div>
          <div className="strip-stat-item">
            <span className="strip-attr-icon">🎯</span>
            <div className="strip-attr-info">
              <span className="strip-attr-label">FOC (ATTENTION)</span>
              <span className="strip-attr-val highlight-blue">{playerStats.foc}</span>
            </div>
          </div>
          <div className="strip-stat-item">
            <span className="strip-attr-icon">⚡</span>
            <div className="strip-attr-info">
              <span className="strip-attr-label">DEX (AGILITY)</span>
              <span className="strip-attr-val highlight-purple">{playerStats.dex}</span>
            </div>
          </div>
          <div className="strip-stat-item">
            <span className="strip-attr-icon">🛡️</span>
            <div className="strip-attr-info">
              <span className="strip-attr-label">END (STAMINA)</span>
              <span className="strip-attr-val highlight-amber">{playerStats.end}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Directives + Telemetry */}
      <div className="command-subgrid">
        <div className="system-window home-priorities-card">
          <div className="system-window-header">
            <span className="system-window-title">HIGH-PRIORITY DIRECTIVES</span>
            <button
              className="btn-link-chartreuse"
              onClick={() => {
                setActiveSection('todos');
                document.getElementById('todos')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              All Quests & Directives →
            </button>
          </div>

          <div className="home-tasks-list">
            {pendingTasks.length === 0 ? (
              <div className="tasks-all-clear">
                <span className="clear-icon">🎉</span>
                <span>All priority directives cleared! Flawless execution.</span>
              </div>
            ) : (
              pendingTasks.map((t) => (
                <div key={t.id} className="home-task-item">
                  <button className="task-checkbox" onClick={() => toggleTask(t.id)}>
                    <span className="check-box-frame">{t.completed && '✓'}</span>
                  </button>
                  <div className="task-content-block">
                    <span className="task-text-title">{t.title}</span>
                    <div className="task-sub-tags">
                      <span className={`priority-pill priority-${t.priority}`}>{t.priority.toUpperCase()}</span>
                      {t.dueTime && <span className="time-badge">⏰ {t.dueTime}</span>}
                      <span className="cat-badge">📁 {t.category}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="system-window telemetry-card">
          <div className="system-window-header">
            <span className="system-window-title">SYSTEM TELEMETRY</span>
            <span className="system-code-id">DIAGNOSTICS</span>
          </div>
          <div className="telemetry-stat-boxes">
            <div className="stat-box">
              <span className="stat-num">{user.totalHabitsCompleted}</span>
              <span className="stat-desc">Lifetime Quests Completed</span>
            </div>
            <div className="stat-box">
              <span className="stat-num highlight-flame">{user.bestStreak} Days</span>
              <span className="stat-desc">All-Time Peak Momentum</span>
            </div>
            <div className="stat-box">
              <span className="stat-num highlight-violet">{user.levelTitle}</span>
              <span className="stat-desc">Current Ascension Rank</span>
            </div>
            <div className="stat-box">
              <span className="stat-num highlight-cyan">🛡️ {user.streakShields} Active</span>
              <span className="stat-desc">Streak Shields Charged</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
