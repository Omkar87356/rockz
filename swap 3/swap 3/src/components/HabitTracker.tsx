import React, { useState } from 'react';
import { useHabitly } from '../context/HabitlyContext';
import { Habit } from '../types';

export const HabitTracker: React.FC = () => {
  const {
    habits,
    toggleHabit,
    incrementHabitCount,
    decrementHabitCount,
    setHabitCount,
    deleteHabit,
    openSkipModal,
    openPauseModal,
    resumeHabit,
    setIsAddHabitOpen,
  } = useHabitly();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingHabitCount, setEditingHabitCount] = useState<{ id: string; val: string } | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'productivity', label: '⚡ Productivity (FOC)' },
    { id: 'fitness', label: '⚔️ Fitness (STR)' },
    { id: 'health', label: '💚 Health (VIT)' },
    { id: 'learning', label: '🧠 Learning (INT)' },
    { id: 'creativity', label: '🎨 Creativity (DEX)' },
    { id: 'mindfulness', label: '🧘 Mindfulness (MIND)' },
  ];

  const statuses: { id: string; label: string }[] = [
    { id: 'all', label: '◈ All Quests' },
    { id: 'pending', label: '○ Active Quests' },
    { id: 'completed', label: '✓ Completed Quests' },
    { id: 'paused', label: '⏸ Paused Protocols' },
  ];

  const filteredHabits = habits.filter((h) => {
    const matchesCat = selectedCategory === 'all' || h.category === selectedCategory;
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesStatus = true;
    if (selectedStatus === 'completed') matchesStatus = h.completedToday;
    if (selectedStatus === 'pending') matchesStatus = !h.completedToday && h.status !== 'paused';
    if (selectedStatus === 'paused') matchesStatus = h.status === 'paused';

    return matchesCat && matchesSearch && matchesStatus;
  });

  const formatFrequencyBadge = (habit: Habit) => {
    const unit = habit.frequencyUnit ? habit.frequencyUnit.toUpperCase() : 'TIMES';
    if (habit.frequencyType === 'times_per_day') {
      return `🔢 ${habit.frequencyCount} ${unit} / DAY`;
    }
    if (habit.frequencyType === 'days_per_week') {
      return `📅 ${habit.frequencyCount} DAYS / WEEK`;
    }
    if (habit.frequencyType === 'times_per_week') {
      return `📊 ${habit.frequencyCount} ${unit} / WEEK`;
    }
    if (habit.frequencyType === 'days_per_month') {
      return `🗓️ ${habit.frequencyCount} DAYS / MONTH`;
    }
    if (habit.frequencyType === 'interval') {
      return `⏱ EVERY ${habit.frequencyCount} DAYS`;
    }
    if (habit.frequencyType === 'weekdays') {
      return `💼 WEEKDAYS`;
    }
    if (habit.frequencyType === 'weekends') {
      return `🏖 WEEKENDS`;
    }
    return `⚡ DAILY`;
  };

  return (
    <section id="habits" className="dashboard-section section-habit-hub in-view">
      <div className="section-header-row">
        <div>
          <div className="system-tag-eyebrow">◈ SYSTEM / QUEST TERMINAL</div>
          <h2 className="section-main-title">Daily Quests & Protocols</h2>
          <p className="section-subtitle">
            Every habit is a calibrated quest. Complete daily objectives to harvest XP, protect streaks, and enhance character attributes.
          </p>
        </div>
        <div className="section-header-actions">
          <button className="btn-primary-neon" onClick={() => setIsAddHabitOpen(true)}>
            <span className="plus-icon">+</span>
            <span>New Quest Protocol</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="hub-filters-panel system-window">
        <div className="search-bar-row">
          <div className="cyber-search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="cyber-search-input"
              placeholder="Filter active quests by keyword or protocol designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          <div className="category-select-wrapper">
            <select
              className="cyber-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="status-pills-row">
          {statuses.map((s) => (
            <button
              key={s.id}
              className={`filter-pill ${selectedStatus === s.id ? 'active' : ''}`}
              onClick={() => setSelectedStatus(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Habit Cards Grid */}
      <div className="habits-grid">
        {filteredHabits.length === 0 ? (
          <div className="system-window empty-results-card">
            <span className="empty-icon">🔍</span>
            <h3>No Quests Matching Filter</h3>
            <p>Adjust your discipline category or status filters, or calibrate a new quest.</p>
            <button className="btn-primary-neon mt-4" onClick={() => setIsAddHabitOpen(true)}>
              + Calibrate New Quest
            </button>
          </div>
        ) : (
          filteredHabits.map((habit, idx) => {
            const progressPercent = Math.min(100, Math.round((habit.completedDays / habit.targetDays) * 100));
            const isPaused = habit.status === 'paused';
            const isSkipped = habit.status === 'skipped';
            const isMultiTimes =
              habit.frequencyType === 'times_per_day' ||
              (habit.frequencyCount > 1 &&
                habit.frequencyType !== 'interval' &&
                habit.frequencyType !== 'days_per_week' &&
                habit.frequencyType !== 'days_per_month');
            const unitName = habit.frequencyUnit || 'times';
            const todayCount = habit.todayCount || 0;
            const dailyPercent = Math.min(100, Math.round((todayCount / habit.frequencyCount) * 100));

            const isMainQuest = idx === 0 && !habit.completedToday && !isPaused;

            return (
              <div
                key={habit.id}
                className={`system-window quest-card ${habit.completedToday ? 'is-completed' : ''} ${isPaused ? 'is-paused' : ''} ${isSkipped ? 'is-skipped' : ''} ${isMainQuest ? 'is-main-quest' : ''}`}
              >
                <div className="quest-card-top-tag-row">
                  <span className={`quest-rank-tag ${isMainQuest ? 'rank-main' : 'rank-side'}`}>
                    {isMainQuest ? '★ MAIN QUEST' : '◈ SIDE QUEST'}
                  </span>
                  <div className="quest-reward-preview-badge">
                    <span className="reward-xp">+25 XP</span>
                    <span className="reward-sp">+20 SP</span>
                  </div>
                </div>

                <div className="card-top-header">
                  <div className="habit-identity">
                    <div className="habit-icon-hex" style={{ borderColor: habit.color }}>
                      <span>{habit.icon}</span>
                    </div>
                    <div className="habit-title-col">
                      <h3 className="habit-title">{habit.name}</h3>
                      <div className="habit-tags-line">
                        <span className="habit-tag-category">{habit.category.toUpperCase()}</span>
                        <span className="habit-tag-freq">{formatFrequencyBadge(habit)}</span>
                        {isPaused && (
                          <span className="habit-tag-paused">⏸ PAUSED ({habit.pauseReason || 'Life Phase'})</span>
                        )}
                        {isSkipped && (
                          <span className="habit-tag-skipped">🛡️ SKIPPED ({habit.skipReason || 'Rest Day'})</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="habit-header-right">
                    <div className="streak-counter-pill" title={`Best Streak: ${habit.bestStreak} days`}>
                      <span className="flame-icon">🔥</span>
                      <span className="streak-num">{habit.streak}</span>
                      <span className="streak-unit">STREAK</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Target */}
                <div className="habit-progress-section">
                  <div className="progress-label-row">
                    <span className="progress-title">Milestone Horizon</span>
                    <span className="progress-fraction">
                      <strong>{habit.completedDays}</strong> / {habit.targetDays} Days ({progressPercent}%)
                    </span>
                  </div>
                  <div className="neon-progress-track">
                    <div
                      className="neon-progress-fill"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: habit.color,
                        boxShadow: `0 0 12px ${habit.color}80`,
                      }}
                    />
                  </div>
                </div>

                {/* Multi-frequency Daily Stepper Control (If frequencyCount > 1 or times_per_day) */}
                {isMultiTimes && !isPaused && (
                  <div className="daily-frequency-stepper-box">
                    <div className="stepper-header-row">
                      <span className="stepper-label">Today's Quest Progress:</span>
                      <span className="stepper-percent-tag">{dailyPercent}%</span>
                    </div>

                    <div className="stepper-controls-row">
                      <button
                        className="stepper-btn minus"
                        onClick={() =>
                          decrementHabitCount(
                            habit.id,
                            habit.frequencyCount >= 500 ? 100 : habit.frequencyCount >= 50 ? 5 : 1
                          )
                        }
                        disabled={todayCount <= 0}
                        title="Decrement Count"
                      >
                        -
                      </button>

                      <div className="stepper-count-display">
                        {editingHabitCount?.id === habit.id ? (
                          <input
                            type="number"
                            autoFocus
                            className="stepper-inline-input"
                            value={editingHabitCount.val}
                            onChange={(e) =>
                              setEditingHabitCount({ id: habit.id, val: e.target.value })
                            }
                            onBlur={() => {
                              const num = parseInt(editingHabitCount.val, 10);
                              if (!isNaN(num)) setHabitCount(habit.id, num);
                              setEditingHabitCount(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const num = parseInt(editingHabitCount.val, 10);
                                if (!isNaN(num)) setHabitCount(habit.id, num);
                                setEditingHabitCount(null);
                              }
                            }}
                          />
                        ) : (
                          <span
                            className="stepper-current-val"
                            onClick={() =>
                              setEditingHabitCount({ id: habit.id, val: todayCount.toString() })
                            }
                            title="Click to edit value directly"
                          >
                            {todayCount}
                          </span>
                        )}
                        <span className="stepper-slash">/</span>
                        <span className="stepper-target-val">{habit.frequencyCount}</span>
                        <span className="stepper-unit-label">{unitName}</span>
                      </div>

                      <button
                        className="stepper-btn plus"
                        onClick={() =>
                          incrementHabitCount(
                            habit.id,
                            habit.frequencyCount >= 500 ? 100 : habit.frequencyCount >= 50 ? 5 : 1
                          )
                        }
                        disabled={habit.completedToday}
                        title="Increment Count"
                      >
                        +
                      </button>
                    </div>

                    <div className="stepper-mini-bar-track">
                      <div
                        className="stepper-mini-bar-fill"
                        style={{
                          width: `${dailyPercent}%`,
                          backgroundColor: habit.color,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* History Dots (Past 7 Days) */}
                <div className="habit-history-strip">
                  <span className="history-label">RECENT TELEMETRY:</span>
                  <div className="history-dots-row">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() - (6 - i));
                      const dateKey = d.toISOString().split('T')[0];
                      const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
                      const dayStatus = habit.history[dateKey] || 'missed';
                      const isToday = i === 6;

                      return (
                        <div key={dateKey} className="history-dot-col" title={`${dateKey}: ${dayStatus}`}>
                          <div
                            className={`history-dot dot-${dayStatus} ${isToday ? 'is-today-dot' : ''}`}
                            style={{
                              backgroundColor: dayStatus === 'completed' ? habit.color : undefined,
                            }}
                          />
                          <span className="dot-day-letter">{dayName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="habit-card-footer">
                  <div className="footer-left-actions">
                    <button
                      className="btn-card-action skip-btn"
                      onClick={() => openSkipModal(habit.id, habit.name)}
                      title="Skip with Streak Shield Protection"
                    >
                      <span>🛡️ Skip</span>
                    </button>

                    {isPaused ? (
                      <button
                        className="btn-card-action resume-btn"
                        onClick={() => resumeHabit(habit.id)}
                        title="Resume Active Rotation"
                      >
                        <span>▶ Resume</span>
                      </button>
                    ) : (
                      <button
                        className="btn-card-action pause-btn"
                        onClick={() => openPauseModal(habit.id, habit.name)}
                        title="Freeze for Life Phases"
                      >
                        <span>⏸ Pause</span>
                      </button>
                    )}

                    <button
                      className="btn-card-action delete-btn"
                      onClick={() => {
                        if (window.confirm(`Delete habit protocol "${habit.name}"?`)) {
                          deleteHabit(habit.id);
                        }
                      }}
                      title="Delete Protocol"
                    >
                      <span>🗑</span>
                    </button>
                  </div>

                  <div className="footer-right-completion">
                    <button
                      className={`btn-complete-habit ${habit.completedToday ? 'is-done' : ''}`}
                      onClick={() => toggleHabit(habit.id)}
                      disabled={isPaused}
                    >
                      <span className="check-mark-box">{habit.completedToday ? '✓' : '○'}</span>
                      <span className="complete-text">
                        {habit.completedToday ? 'QUEST COMPLETE' : '[ COMPLETE QUEST ]'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
