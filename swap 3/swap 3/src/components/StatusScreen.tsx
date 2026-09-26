import React from 'react';
import { useHabitly } from '../context/HabitlyContext';

export const StatusScreen: React.FC = () => {
  const { user, habits, playerStats, toggleHabit, incrementHabitCount, setIsAddHabitOpen } = useHabitly();

  const xpPercent = Math.min(100, Math.round((user.currentXP / user.nextLevelXP) * 100));
  const activeHabits = habits.filter((h) => h.status !== 'paused');
  const completedToday = activeHabits.filter((h) => h.completedToday).length;

  const attributes = [
    { key: 'STR', label: 'Strength', value: playerStats.str, icon: '⚔️', desc: 'Fitness & Physical Power', color: '#00E5FF' },
    { key: 'INT', label: 'Intelligence', value: playerStats.int, icon: '🧠', desc: 'Learning & Mind Architecture', color: '#7C3AED' },
    { key: 'VIT', label: 'Vitality', value: playerStats.vit, icon: '💚', desc: 'Health & Biological Regeneration', color: '#00FF9C' },
    { key: 'FOC', label: 'Focus', value: playerStats.foc, icon: '🎯', desc: 'Productivity & Flow Density', color: '#3B82F6' },
    { key: 'DEX', label: 'Dexterity', value: playerStats.dex, icon: '⚡', desc: 'Creativity & Precision Execution', color: '#A855F7' },
    { key: 'END', label: 'Endurance', value: playerStats.end, icon: '🛡️', desc: 'Streak Momentum & Consistency', color: '#FFD166' },
  ];

  return (
    <section id="status" className="dashboard-section section-status-screen">
      <div className="section-header-row">
        <div>
          <div className="system-tag-eyebrow">◈ SYSTEM / PLAYER STATUS</div>
          <h2 className="section-main-title">Character Status Matrix</h2>
          <p className="section-subtitle">
            Direct biometric translation of real-life habits into RPG attributes, physiological gauges, and mastery tiers.
          </p>
        </div>
        <div className="section-header-actions">
          <div className="system-pill-chip status-badge-online">
            <span className="pulse-cyan-dot" />
            <span>NEURAL LINK ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="status-screen-grid">
        {/* Left Column: Player Identity & Combat Gauges */}
        <div className="system-window player-identity-card">
          <div className="system-window-header">
            <span className="system-window-title">IDENTIFICATION TELEMETRY</span>
            <span className="system-code-id">UID: PLR-7709</span>
          </div>

          <div className="player-hero-block">
            <div className="player-avatar-hologram">
              <div className="holo-ring-outer" />
              <div className="holo-ring-inner" />
              <div className="player-level-badge">LV.{user.level}</div>
            </div>
            <div className="player-title-meta">
              <span className="player-callsign">DESIGNATION</span>
              <h3 className="player-character-name">PLAYER ONE</h3>
              <div className="player-class-title">◈ {user.levelTitle}</div>
            </div>
          </div>

          {/* Vitals: HP, MP, Fatigue */}
          <div className="player-vitals-stack">
            {/* HP Gauge */}
            <div className="vital-gauge-row">
              <div className="vital-meta">
                <span className="vital-label hp-label">HP (HEALTH INTEGRITY)</span>
                <span className="vital-digits">{playerStats.hp} / 100</span>
              </div>
              <div className="vital-bar-track">
                <div className="vital-bar-fill hp-fill" style={{ width: `${playerStats.hp}%` }} />
              </div>
            </div>

            {/* MP Gauge */}
            <div className="vital-gauge-row">
              <div className="vital-meta">
                <span className="vital-label mp-label">MP (SPARK RESONANCE)</span>
                <span className="vital-digits">{playerStats.mp} / 100</span>
              </div>
              <div className="vital-bar-track">
                <div className="vital-bar-fill mp-fill" style={{ width: `${playerStats.mp}%` }} />
              </div>
            </div>

            {/* EXP Gauge */}
            <div className="vital-gauge-row">
              <div className="vital-meta">
                <span className="vital-label xp-label">EXP (ASCENSION PROGRESS)</span>
                <span className="vital-digits">{user.currentXP} / {user.nextLevelXP} XP ({xpPercent}%)</span>
              </div>
              <div className="vital-bar-track">
                <div className="vital-bar-fill xp-fill" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>

            {/* Fatigue State */}
            <div className="vital-state-banner">
              <div className="state-cell">
                <span className="state-title">FATIGUE INDEX</span>
                <span className={`state-value fatigue-${playerStats.fatigue.toLowerCase()}`}>
                  {playerStats.fatigue}
                </span>
              </div>
              <div className="state-cell">
                <span className="state-title">DAILY CLEAR</span>
                <span className="state-value highlight-cyan">
                  {completedToday} / {activeHabits.length}
                </span>
              </div>
              <div className="state-cell">
                <span className="state-title">STREAK SHIELDS</span>
                <span className="state-value highlight-amber">
                  🛡️ ×{user.streakShields}
                </span>
              </div>
            </div>
          </div>

          {/* Combat Records */}
          <div className="combat-records-grid">
            <div className="combat-stat-box">
              <span className="combat-stat-label">CURRENT STREAK</span>
              <span className="combat-stat-num highlight-flame">🔥 {user.currentStreak} DAYS</span>
            </div>
            <div className="combat-stat-box">
              <span className="combat-stat-label">ALL-TIME PEAK</span>
              <span className="combat-stat-num highlight-gold">⭐ {user.bestStreak} DAYS</span>
            </div>
            <div className="combat-stat-box">
              <span className="combat-stat-label">QUESTS CLEARED</span>
              <span className="combat-stat-num highlight-emerald">⚡ {user.totalHabitsCompleted}</span>
            </div>
            <div className="combat-stat-box">
              <span className="combat-stat-label">SPARK ENERGY</span>
              <span className="combat-stat-num highlight-violet">✦ {user.sparkPoints} SP</span>
            </div>
          </div>
        </div>

        {/* Right Column: RPG Attributes Matrix */}
        <div className="system-window attributes-matrix-card">
          <div className="system-window-header">
            <span className="system-window-title">ATTRIBUTES MATRIX</span>
            <span className="system-window-subtitle">SYNCHRONIZED WITH HABIT CATEGORIES</span>
          </div>

          <div className="attributes-cards-grid">
            {attributes.map((attr) => {
              const maxDisplay = 100;
              const barPercent = Math.min(100, Math.round((attr.value / maxDisplay) * 100));

              return (
                <div key={attr.key} className="attribute-system-tile">
                  <div className="attr-top-row">
                    <div className="attr-key-badge" style={{ borderColor: attr.color, color: attr.color }}>
                      <span className="attr-icon">{attr.icon}</span>
                      <span className="attr-key-name">{attr.key}</span>
                    </div>
                    <div className="attr-numerical-score" style={{ color: attr.color }}>
                      {attr.value}
                    </div>
                  </div>

                  <div className="attr-title-text">{attr.label}</div>
                  <div className="attr-desc-text">{attr.desc}</div>

                  <div className="attr-bar-wrapper">
                    <div
                      className="attr-bar-fill"
                      style={{
                        width: `${barPercent}%`,
                        backgroundColor: attr.color,
                        boxShadow: `0 0 10px ${attr.color}`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Neural Calibrations / Actionable Advice */}
          <div className="status-footer-recommendations">
            <div className="recommendation-header">
              <span className="pulse-violet-dot" />
              <span className="recommendation-title">SYSTEM RECOMMENDATION FOR ATTRIBUTE GROWTH</span>
            </div>
            <p className="recommendation-body">
              Your highest attribute velocity is currently in <strong style={{ color: '#00E5FF' }}>STR</strong> and <strong style={{ color: '#3B82F6' }}>FOC</strong>. To optimize balance, increase daily executions of <strong style={{ color: '#A855F7' }}>Creative</strong> and <strong style={{ color: '#00FF9C' }}>Vitality</strong> protocols.
            </p>
            <div className="recommendation-actions">
              <button className="btn-secondary-cyber" onClick={() => setIsAddHabitOpen(true)}>
                <span>+ Calibrate New Quest</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
