import React from 'react';
import { useHabitly } from '../context/HabitlyContext';
import { LEVEL_TIERS } from '../utils/storage';

export const ProgressionTimeline: React.FC = () => {
  const { user, rewards } = useHabitly();

  const xpPercent = Math.min(100, Math.round((user.currentXP / user.nextLevelXP) * 100));

  return (
    <section id="progression" className="dashboard-section section-progression-timeline">
      <div className="section-header-row">
        <div>
          <div className="system-tag-eyebrow">◈ SYSTEM / ASCENSION HIERARCHY</div>
          <h2 className="section-main-title">Player Progression Hierarchy</h2>
          <p className="section-subtitle">
            System ascension tiers calibrated to consistency velocity. Earn XP through daily quests to ascend through higher echelons of mastery.
          </p>
        </div>
        <div className="current-level-telemetry-box">
          <span className="telemetry-eyebrow">CURRENT TIER</span>
          <div className="telemetry-tier-name">
            <span className="badge-cyan">LV.{user.level}</span>
            <span className="title-text">{user.levelTitle}</span>
          </div>
          <div className="telemetry-xp-track">
            <div className="telemetry-xp-fill" style={{ width: `${xpPercent}%` }} />
          </div>
          <span className="telemetry-xp-sub">{user.currentXP} / {user.nextLevelXP} XP ({xpPercent}%)</span>
        </div>
      </div>

      <div className="progression-timeline-container">
        {LEVEL_TIERS.map((tier, idx) => {
          const isPassed = user.level > tier.level;
          const isCurrent = user.level === tier.level;
          const isLocked = user.level < tier.level;

          const tierRewards = rewards.filter((r) => r.unlockedLevel === tier.level);

          return (
            <div
              key={tier.level}
              className={`timeline-tier-card ${isCurrent ? 'is-current' : ''} ${isPassed ? 'is-passed' : ''} ${isLocked ? 'is-locked' : ''}`}
            >
              {/* Connector Spine */}
              {idx < LEVEL_TIERS.length - 1 && <div className="timeline-connector-line" />}

              <div className="tier-node-indicator">
                {isPassed ? (
                  <span className="node-icon-passed">✓</span>
                ) : isCurrent ? (
                  <div className="node-current-pulse">
                    <span className="pulse-ring" />
                    <span className="pulse-core">◈</span>
                  </div>
                ) : (
                  <span className="node-icon-locked">🔒</span>
                )}
              </div>

              <div className="tier-card-content system-window">
                <div className="tier-card-header">
                  <div className="tier-level-chip">
                    <span>LEVEL {tier.level}</span>
                  </div>
                  <span className="tier-xp-bracket">
                    {tier.minXP} - {tier.maxXP} XP REQUIRED
                  </span>
                  {isCurrent && <span className="tier-current-tag">CURRENT RANK</span>}
                </div>

                <h3 className="tier-title-name">{tier.title}</h3>

                <p className="tier-narrative">
                  {tier.level === 1 && 'The awakening of intentional discipline. Basic neural pathways begin formation.'}
                  {tier.level === 2 && 'Daily execution solidifies into repeatable habit loops. Resistance begins decaying.'}
                  {tier.level === 3 && 'Cognitive momentum established. Focus periods deepen and consistency shields activate.'}
                  {tier.level === 4 && 'Attentional density reaches optimal state. High-friction tasks are cleared without dread.'}
                  {tier.level === 5 && 'Total architectural synchronization between habit protocols and daily schedules.'}
                  {tier.level === 6 && 'Mental friction eliminated. Flow state becomes baseline cognitive frequency.'}
                  {tier.level === 7 && 'Apex daily mastery. Routine functions autonomously with absolute consistency.'}
                  {tier.level >= 8 && 'Transcendental performance telemetry. System operations operating at maximum velocity.'}
                </p>

                {tierRewards.length > 0 && (
                  <div className="tier-unlocked-rewards-strip">
                    <span className="strip-label">TIER UNLOCKS:</span>
                    {tierRewards.map((r) => (
                      <span key={r.id} className="reward-pill-tag">
                        {r.icon} {r.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
