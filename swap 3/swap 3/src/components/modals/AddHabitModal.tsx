import React, { useState } from 'react';
import { useHabitly } from '../../context/HabitlyContext';
import { HabitCategory, HabitFrequencyType } from '../../types';

export const AddHabitModal: React.FC = () => {
  const { isAddHabitOpen, setIsAddHabitOpen, addHabit } = useHabitly();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('mindfulness');
  const [frequencyType, setFrequencyType] = useState<HabitFrequencyType>('daily');
  const [frequencyCount, setFrequencyCount] = useState<number>(3);
  const [frequencyUnit, setFrequencyUnit] = useState<string>('times');
  const [customUnit, setCustomUnit] = useState<string>('');
  const [targetDays, setTargetDays] = useState(30);
  const [icon, setIcon] = useState('🧘');
  const [color, setColor] = useState('#00F59B');

  if (!isAddHabitOpen) return null;

  const iconOptions = ['🧘', '⚡', '💧', '🏋️', '📚', '🎨', '🎸', '🏃', '🥗', '💻', '🧠', '🌿'];
  const colorOptions = ['#00F59B', '#D4FF00', '#6366F1', '#06B6D4', '#EC4899', '#F59E0B', '#3B82F6'];

  const unitPresets = [
    { label: 'times', value: 'times' },
    { label: '💧 glasses', value: 'glasses' },
    { label: '📚 pages', value: 'pages' },
    { label: '🏋️ reps', value: 'reps' },
    { label: '⏱️ mins', value: 'mins' },
    { label: '🧪 ml', value: 'ml' },
    { label: '🥛 liters', value: 'liters' },
    { label: '🍅 blocks', value: 'blocks' },
    { label: '🏃 km', value: 'km' },
    { label: '✏️ custom', value: 'custom' },
  ];

  const countPresets = [1, 2, 3, 5, 8, 10, 20, 30, 50, 100, 2000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let finalCount = Math.max(1, Number(frequencyCount) || 1);
    if (frequencyType === 'daily') finalCount = 1;
    if (frequencyType === 'days_per_week') finalCount = Math.min(7, Math.max(1, finalCount));
    if (frequencyType === 'days_per_month') finalCount = Math.min(31, Math.max(1, finalCount));

    const finalUnit = frequencyUnit === 'custom' ? (customUnit.trim() || 'units') : frequencyUnit;

    addHabit({
      name: name.trim(),
      category,
      frequencyType,
      frequencyCount: finalCount,
      frequencyUnit: finalUnit,
      targetDays: Number(targetDays) || 30,
      icon,
      color,
    });

    setName('');
  };

  const getPreviewText = () => {
    const activeUnit = frequencyUnit === 'custom' ? (customUnit.trim() || 'units') : frequencyUnit;
    if (frequencyType === 'daily') return 'Execute 1 time every single day';
    if (frequencyType === 'times_per_day') return `Execute ${frequencyCount} ${activeUnit} every single day`;
    if (frequencyType === 'days_per_week') return `Execute on ${frequencyCount} days each week`;
    if (frequencyType === 'times_per_week') return `Execute ${frequencyCount} ${activeUnit} per week`;
    if (frequencyType === 'days_per_month') return `Execute on ${frequencyCount} days each month`;
    if (frequencyType === 'interval') return `Execute every ${frequencyCount} days`;
    if (frequencyType === 'weekdays') return 'Execute every weekday (Mon - Fri)';
    if (frequencyType === 'weekends') return 'Execute every weekend (Sat - Sun)';
    return 'Custom frequency';
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAddHabitOpen(false)}>
      <div className="glass-modal-card modal-medium" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">🎯</span>
            <h3 className="modal-title">Create Custom Habit Protocol</h3>
          </div>
          <button className="modal-close-btn" onClick={() => setIsAddHabitOpen(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Habit Name</label>
            <input
              type="text"
              className="cyber-input"
              placeholder="e.g. Drink 8 Glasses of Water, Read 20 Pages, 50 Pushups..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-row-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="cyber-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
              >
                <option value="mindfulness">🧘 Mindfulness & Peace</option>
                <option value="productivity">⚡ Deep Productivity</option>
                <option value="health">💧 Physical Health & Vitals</option>
                <option value="fitness">🏋️ Fitness & Strength</option>
                <option value="learning">📚 Learning & Books</option>
                <option value="creativity">🎨 Creative Output</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Frequency Model</label>
              <select
                className="cyber-select"
                value={frequencyType}
                onChange={(e) => {
                  const val = e.target.value as HabitFrequencyType;
                  setFrequencyType(val);
                  if (val === 'times_per_day' && frequencyCount <= 1) setFrequencyCount(3);
                }}
              >
                <option value="daily">⚡ Daily (1x / Day)</option>
                <option value="times_per_day">🔢 Any Target Amount / Day (e.g. 8 glasses, 50 reps, 2000 ml)</option>
                <option value="days_per_week">📅 Days Per Week (e.g. 3, 5, or 6 days/week)</option>
                <option value="times_per_week">📊 Times Per Week (e.g. 10 times/week)</option>
                <option value="days_per_month">🗓️ Days Per Month (e.g. 15 or 20 days/month)</option>
                <option value="interval">⏱ Every N Days (e.g. every 2, 3, or 5 days)</option>
                <option value="weekdays">💼 Weekdays Only (Mon-Fri)</option>
                <option value="weekends">🏖 Weekends Only (Sat-Sun)</option>
              </select>
            </div>
          </div>

          {/* Dynamic Custom Frequency Amount & Unit Section */}
          {frequencyType !== 'daily' && frequencyType !== 'weekdays' && frequencyType !== 'weekends' && (
            <div className="form-group animate-fade-in custom-frequency-box">
              <div className="frequency-box-header">
                <label className="form-label highlight-chartreuse">
                  {frequencyType === 'times_per_day' && 'Daily Target Amount & Unit'}
                  {frequencyType === 'days_per_week' && 'Target Days Per Week'}
                  {frequencyType === 'times_per_week' && 'Weekly Target Executions'}
                  {frequencyType === 'days_per_month' && 'Target Days Per Month'}
                  {frequencyType === 'interval' && 'Interval Cadence (Every N Days)'}
                </label>
                <span className="live-preview-pill">✨ {getPreviewText()}</span>
              </div>

              <div className="frequency-input-row">
                <input
                  type="number"
                  className="cyber-input frequency-number-input"
                  min="1"
                  max="99999"
                  value={frequencyCount}
                  onChange={(e) => setFrequencyCount(Math.max(1, Number(e.target.value)))}
                  required
                />
                
                {(frequencyType === 'times_per_day' || frequencyType === 'times_per_week') && (
                  <div className="unit-selector-wrap">
                    {frequencyUnit === 'custom' ? (
                      <input
                        type="text"
                        className="cyber-input unit-custom-input"
                        placeholder="e.g. pushups, ml, sets"
                        value={customUnit}
                        onChange={(e) => setCustomUnit(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span className="input-unit-tag">{frequencyUnit.toUpperCase()}</span>
                    )}
                  </div>
                )}

                {frequencyType === 'days_per_week' && <span className="input-unit-tag">DAYS / WEEK</span>}
                {frequencyType === 'days_per_month' && <span className="input-unit-tag">DAYS / MONTH</span>}
                {frequencyType === 'interval' && <span className="input-unit-tag">DAYS INTERVAL</span>}
              </div>

              {/* Quick Amount Chips */}
              <div className="quick-amount-presets">
                <span className="preset-label">Quick amounts:</span>
                <div className="preset-chips-list">
                  {countPresets
                    .filter((p) => {
                      if (frequencyType === 'days_per_week') return p <= 7;
                      if (frequencyType === 'days_per_month') return p <= 31;
                      if (frequencyType === 'interval') return p >= 2 && p <= 30;
                      return true;
                    })
                    .map((num) => (
                      <button
                        type="button"
                        key={num}
                        className={`preset-chip ${frequencyCount === num ? 'active' : ''}`}
                        onClick={() => setFrequencyCount(num)}
                      >
                        {num}
                      </button>
                    ))}
                </div>
              </div>

              {/* Quick Unit Presets for custom targets */}
              {(frequencyType === 'times_per_day' || frequencyType === 'times_per_week') && (
                <div className="quick-unit-presets mt-2">
                  <span className="preset-label">Measurement Unit:</span>
                  <div className="preset-chips-list">
                    {unitPresets.map((u) => (
                      <button
                        type="button"
                        key={u.value}
                        className={`preset-chip ${frequencyUnit === u.value ? 'active' : ''}`}
                        onClick={() => setFrequencyUnit(u.value)}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Target Milestone Horizon (Days)</label>
            <input
              type="number"
              className="cyber-input"
              min="7"
              max="365"
              value={targetDays}
              onChange={(e) => setTargetDays(Number(e.target.value))}
            />
          </div>

          {/* Icon Selector */}
          <div className="form-group">
            <label className="form-label">Select Icon</label>
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

          {/* Color Selector */}
          <div className="form-group">
            <label className="form-label">Accent Theme Color</label>
            <div className="selector-options-row">
              {colorOptions.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`color-item-btn ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions-row">
            <button type="button" className="btn-secondary-cyber" onClick={() => setIsAddHabitOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-neon">
              <span>+ Create Habit Protocol</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

