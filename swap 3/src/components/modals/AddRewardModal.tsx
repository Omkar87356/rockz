import React, { useState } from 'react';
import { useHabitly } from '../../context/HabitlyContext';

export const AddRewardModal: React.FC = () => {
  const { isAddRewardOpen, setIsAddRewardOpen, addReward } = useHabitly();

  const [title, setTitle] = useState('');
  const [cost, setCost] = useState(200);
  const [icon, setIcon] = useState('🎁');
  const [category, setCategory] = useState('Lifestyle');
  const [description, setDescription] = useState('');

  if (!isAddRewardOpen) return null;

  const iconOptions = ['🎁', '🎮', '☕', '📖', '🧖', '⌨️', '🍔', '✈️', '🎬', '🎧', '🎸', '👟'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addReward({
      title: title.trim(),
      cost: Number(cost) || 100,
      icon,
      category,
      description: description.trim() || 'Custom earned reward for habit consistency.',
    });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAddRewardOpen(false)}>
      <div className="glass-modal-card modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">🏆</span>
            <h3 className="modal-title">Mint Custom Reward Token</h3>
          </div>
          <button className="modal-close-btn" onClick={() => setIsAddRewardOpen(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Reward Name / Experience</label>
            <input
              type="text"
              className="cyber-input"
              placeholder="e.g. Weekend Camping Trip"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-row-grid">
            <div className="form-group">
              <label className="form-label">Spark Point Cost (⚡)</label>
              <input
                type="number"
                className="cyber-input"
                min="50"
                max="10000"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="cyber-input"
                placeholder="e.g. Wellness, Gear, Fun"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Motivation</label>
            <textarea
              className="cyber-textarea"
              rows={2}
              placeholder="Why this reward will fuel your discipline..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Reward Icon</label>
            <div className="selector-options-row">
              {iconOptions.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  className={`selector-item-btn ${icon === ic ? 'selected' : ''}`}
                  onClick={() => setIcon(ic)}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-secondary-cyber" onClick={() => setIsAddRewardOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-neon">
              <span>+ Add to Reward Vault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
