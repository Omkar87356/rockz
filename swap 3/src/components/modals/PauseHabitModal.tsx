import React, { useState } from 'react';
import { useHabitly } from '../../context/HabitlyContext';

export const PauseHabitModal: React.FC = () => {
  const { pauseModal, closePauseModal, confirmPauseHabit } = useHabitly();
  const [lifePhaseReason, setLifePhaseReason] = useState('Final Exams / Academic Sprint');
  const [customPhase, setCustomPhase] = useState('');
  const [durationDays, setDurationDays] = useState(14);

  if (!pauseModal.isOpen) return null;

  const phases = [
    'Final Exams / Academic Sprint',
    'Major Career Transition / New Role',
    'Injury Rehabilitation / Medical Rest',
    'Relocating / Moving Homes',
    'Maternity / Paternity / Family Transition',
    'Extended Travel / Expedition',
    'Other Life Transition...',
  ];

  const handleConfirm = () => {
    const finalReason = lifePhaseReason === 'Other Life Transition...' ? customPhase.trim() || 'Life Transition' : lifePhaseReason;
    confirmPauseHabit(finalReason, Number(durationDays) || 14);
  };

  return (
    <div className="modal-backdrop" onClick={closePauseModal}>
      <div className="glass-modal-card modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">⏸️</span>
            <h3 className="modal-title">Life-Phase Habit Freeze</h3>
          </div>
          <button className="modal-close-btn" onClick={closePauseModal}>
            ✕
          </button>
        </div>

        <div className="modal-body-content">
          <p className="modal-desc-highlight">
            Life moves in distinct phases. Pausing <strong>"{pauseModal.habitName}"</strong> freezes your progress without guilt or broken streaks. You can resume at any time.
          </p>

          <div className="form-group">
            <label className="form-label">What life phase are you currently navigating?</label>
            <div className="reason-options-list">
              {phases.map((p) => (
                <button
                  type="button"
                  key={p}
                  className={`reason-select-btn ${lifePhaseReason === p ? 'active' : ''}`}
                  onClick={() => setLifePhaseReason(p)}
                >
                  <span className="reason-radio-circle">{lifePhaseReason === p && '●'}</span>
                  <span className="reason-text">{p}</span>
                </button>
              ))}
            </div>
          </div>

          {lifePhaseReason === 'Other Life Transition...' && (
            <div className="form-group animate-fade-in">
              <label className="form-label">Describe Life Phase</label>
              <input
                type="text"
                className="cyber-input"
                placeholder="e.g. Starting a new company..."
                value={customPhase}
                onChange={(e) => setCustomPhase(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <div className="form-group mt-3">
            <label className="form-label">Estimated Freeze Duration (Days)</label>
            <div className="duration-pill-bar">
              {[7, 14, 30, 60].map((d) => (
                <button
                  type="button"
                  key={d}
                  className={`filter-pill ${durationDays === d ? 'active' : ''}`}
                  onClick={() => setDurationDays(d)}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-actions-row">
          <button type="button" className="btn-secondary-cyber" onClick={closePauseModal}>
            Cancel
          </button>
          <button type="button" className="btn-primary-neon" onClick={handleConfirm}>
            <span>⏸ Freeze & Protect Habit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
