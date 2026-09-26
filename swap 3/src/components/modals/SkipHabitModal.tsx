import React, { useState } from 'react';
import { useHabitly } from '../../context/HabitlyContext';

export const SkipHabitModal: React.FC = () => {
  const { skipModal, closeSkipModal, confirmSkipHabit } = useHabitly();
  const [selectedReason, setSelectedReason] = useState('Sick / Physical Recovery');
  const [customReason, setCustomReason] = useState('');

  if (!skipModal.isOpen) return null;

  const reasons = [
    'Sick / Physical Recovery',
    'Unavoidable Travel / In Flight',
    'Cognitive Overload / Rest Day',
    'Family / Emergency Priority',
    'Scheduled Rest Day',
    'Custom Reason...',
  ];

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Custom Reason...' ? customReason.trim() || 'Rest Day' : selectedReason;
    confirmSkipHabit(finalReason);
  };

  return (
    <div className="modal-backdrop" onClick={closeSkipModal}>
      <div className="glass-modal-card modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">🛡️</span>
            <h3 className="modal-title">Skip Habit (Streak Armor)</h3>
          </div>
          <button className="modal-close-btn" onClick={closeSkipModal}>
            ✕
          </button>
        </div>

        <div className="modal-body-content">
          <p className="modal-desc-highlight">
            Skipping <strong>"{skipModal.habitName}"</strong> for today activates your Streak Shield. Your current streak will be preserved without penalization.
          </p>

          <div className="form-group">
            <label className="form-label">Select Valid Skip Reason</label>
            <div className="reason-options-list">
              {reasons.map((r) => (
                <button
                  type="button"
                  key={r}
                  className={`reason-select-btn ${selectedReason === r ? 'active' : ''}`}
                  onClick={() => setSelectedReason(r)}
                >
                  <span className="reason-radio-circle">{selectedReason === r && '●'}</span>
                  <span className="reason-text">{r}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedReason === 'Custom Reason...' && (
            <div className="form-group animate-fade-in">
              <label className="form-label">Enter Custom Reason</label>
              <input
                type="text"
                className="cyber-input"
                placeholder="Describe your situation..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                autoFocus
              />
            </div>
          )}
        </div>

        <div className="modal-actions-row">
          <button type="button" className="btn-secondary-cyber" onClick={closeSkipModal}>
            Cancel
          </button>
          <button type="button" className="btn-primary-neon" onClick={handleConfirm}>
            <span>🛡️ Protect Streak & Skip Today</span>
          </button>
        </div>
      </div>
    </div>
  );
};
