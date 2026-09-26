import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { HealthGoal, HealthGoalCategory } from '../../types/health';

export const HealthGoalsView: React.FC = () => {
  const { goals, addGoal, deleteGoal, toggleGoal, isAddGoalModalOpen, setIsAddGoalModalOpen } = useHealth();
  const [selectedCategory, setSelectedCategory] = useState<'all' | HealthGoalCategory>('all');

  // Form state for creating a new goal
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HealthGoalCategory>('weight');
  const [newDescription, setNewDescription] = useState('');
  const [newCurrent, setNewCurrent] = useState<string>('');
  const [newTarget, setNewTarget] = useState<string>('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newDeadline, setNewDeadline] = useState('');
  const [validationError, setValidationError] = useState('');

  const filteredGoals = selectedCategory === 'all'
    ? goals
    : goals.filter((g) => g.category === selectedCategory);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    const curr = parseFloat(newCurrent);
    const targ = parseFloat(newTarget);

    if (!newTitle.trim()) {
      setValidationError('Please enter a goal title.');
      return;
    }
    if (isNaN(curr) || isNaN(targ)) {
      setValidationError('Please enter valid numeric current and target values.');
      return;
    }

    // Safety checks against dangerous body-composition practices
    if (newCategory === 'weight') {
      const delta = Math.abs(curr - targ);
      if (delta > 30) {
        setValidationError('Large weight shifts should be broken into sequential milestones of 5-10 kg.');
        return;
      }
      if (targ < 35) {
        setValidationError('Safety Alert: Target weight is dangerously low. Please prioritize a healthy, sustainable body composition.');
        return;
      }
    }

    addGoal({
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || 'Custom health & fitness milestone.',
      currentValue: curr,
      targetValue: targ,
      unit: newUnit,
      deadline: newDeadline || undefined,
      completed: curr >= targ && newCategory !== 'weight',
    });

    // Reset and close
    setNewTitle('');
    setNewDescription('');
    setNewCurrent('');
    setNewTarget('');
    setNewDeadline('');
    setIsAddGoalModalOpen(false);
  };

  const getCategoryIcon = (cat: HealthGoalCategory) => {
    switch (cat) {
      case 'weight': return '⚖️';
      case 'steps': return '👟';
      case 'sleep': return '🌙';
      case 'hydration': return '💧';
      case 'strength': return '💪';
      case 'muscle': return '🦾';
      case 'cardio': return '🏃';
      case 'consistency': return '🔥';
    }
  };

  return (
    <div className="health-goals-container">
      {/* Goals Header */}
      <div className="goals-header-row system-window">
        <div>
          <h3 className="goals-section-title">
            <span className="goals-icon">🎯</span> STRATEGIC HEALTH MILESTONES & TARGETS
          </h3>
          <p className="goals-section-subtitle">
            Progress indicators and safe milestones. Sustainable consistency over extreme measures.
          </p>
        </div>

        <button
          className="btn-create-goal"
          onClick={() => setIsAddGoalModalOpen(true)}
          id="btn-open-create-goal"
        >
          <span className="plus-icon">+</span>
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="goals-filter-bar">
        {[
          { id: 'all', label: 'All Goals' },
          { id: 'weight', label: 'Weight' },
          { id: 'steps', label: 'Steps' },
          { id: 'sleep', label: 'Sleep' },
          { id: 'hydration', label: 'Hydration' },
          { id: 'strength', label: 'Strength' },
          { id: 'muscle', label: 'Muscle' },
          { id: 'cardio', label: 'Cardio' },
          { id: 'consistency', label: 'Consistency' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`btn-goal-filter ${selectedCategory === tab.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(tab.id as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Goals Cards Grid */}
      <div className="goals-cards-grid">
        {filteredGoals.length === 0 ? (
          <div className="goals-empty-state system-window">
            <span className="empty-icon">🎯</span>
            <p>No active goals in this category. Click "+ Create New Goal" to establish a target!</p>
          </div>
        ) : (
          filteredGoals.map((goal) => {
            const isWeightGoal = goal.category === 'weight';
            let progressPct = 0;

            if (isWeightGoal) {
              const totalToMove = Math.abs(goal.currentValue - goal.targetValue);
              progressPct = totalToMove <= 0.2 ? 100 : Math.max(10, Math.min(100, Math.round((goal.targetValue / goal.currentValue) * 100)));
            } else {
              progressPct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
            }

            return (
              <div
                key={goal.id}
                className={`goal-card system-window ${goal.completed ? 'is-completed' : ''}`}
              >
                <div className="goal-card-top">
                  <div className="goal-cat-badge">
                    <span className="cat-icon">{getCategoryIcon(goal.category)}</span>
                    <span className="cat-text">{goal.category.toUpperCase()}</span>
                  </div>

                  <div className="goal-actions">
                    <button
                      className={`btn-toggle-goal ${goal.completed ? 'completed' : ''}`}
                      onClick={() => toggleGoal(goal.id)}
                      title={goal.completed ? 'Mark as Active' : 'Mark as Achieved'}
                    >
                      {goal.completed ? '✓ Achieved' : 'Mark Complete'}
                    </button>
                    <button
                      className="btn-delete-goal"
                      onClick={() => deleteGoal(goal.id)}
                      title="Delete goal"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <h4 className="goal-card-title">{goal.title}</h4>
                <p className="goal-card-desc">{goal.description}</p>

                <div className="goal-progress-box">
                  <div className="progress-numbers">
                    <span>
                      Current: <strong>{goal.currentValue} {goal.unit}</strong>
                    </span>
                    <span>
                      Target: <strong>{goal.targetValue} {goal.unit}</strong>
                    </span>
                  </div>
                  <div className="goal-progress-track">
                    <div
                      className={`goal-progress-fill ${goal.completed ? 'emerald' : 'cyan'}`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="goal-progress-meta">
                    <span>{progressPct}% Completion</span>
                    {goal.deadline && (
                      <span className="deadline-text">Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Goal Modal */}
      {isAddGoalModalOpen && (
        <div className="health-modal-backdrop" onClick={() => setIsAddGoalModalOpen(false)}>
          <div className="health-modal-card system-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🎯 ESTABLISH NEW STRATEGIC MILESTONE</h3>
              <button className="btn-close-modal" onClick={() => setIsAddGoalModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="goal-form">
              {validationError && (
                <div className="modal-validation-error">{validationError}</div>
              )}

              <div className="form-group">
                <label>Goal Title</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="E.g. Reach 72.0 kg Lean Physique, Run 5k, etc."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    className="modal-select"
                    value={newCategory}
                    onChange={(e) => {
                      const cat = e.target.value as HealthGoalCategory;
                      setNewCategory(cat);
                      if (cat === 'weight') setNewUnit('kg');
                      else if (cat === 'steps') setNewUnit('steps');
                      else if (cat === 'sleep') setNewUnit('hours');
                      else if (cat === 'hydration') setNewUnit('Liters');
                      else if (cat === 'strength') setNewUnit('reps');
                      else setNewUnit('pts');
                    }}
                  >
                    <option value="weight">Body Weight</option>
                    <option value="muscle">Muscle Hypertrophy</option>
                    <option value="strength">Strength & Reps</option>
                    <option value="cardio">Cardiovascular Endurance</option>
                    <option value="steps">Daily Step Cadence</option>
                    <option value="sleep">Sleep Duration</option>
                    <option value="hydration">Hydration</option>
                    <option value="consistency">Routine Consistency</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Unit Label</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Current Value</label>
                  <input
                    type="number"
                    step="any"
                    className="modal-input"
                    placeholder="E.g. 76.5"
                    value={newCurrent}
                    onChange={(e) => setNewCurrent(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Target Value</label>
                  <input
                    type="number"
                    step="any"
                    className="modal-input"
                    placeholder="E.g. 72.0"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Target Target Date (Optional)</label>
                <input
                  type="date"
                  className="modal-input"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Strategic Description & Motivation</label>
                <textarea
                  className="modal-textarea"
                  rows={2}
                  placeholder="Explain why this goal is important to your health progression..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div className="safety-note-callout">
                🛡️ <strong>Safety Protocol:</strong> We advocate sustainable progressive adaptation. Extreme caloric restriction, rapid dehydration cuts, or unsafe exercise volumes are discouraged.
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-secondary"
                  onClick={() => setIsAddGoalModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-primary">
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
