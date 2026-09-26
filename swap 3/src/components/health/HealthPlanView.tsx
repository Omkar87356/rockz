import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { FitnessExperience } from '../../types/health';

type PlanTab = 'workout' | 'nutrition' | 'recovery';

export const HealthPlanView: React.FC = () => {
  const { plan, profile, metrics, regeneratePlan } = useHealth();
  const [activeTab, setActiveTab] = useState<PlanTab>('workout');
  const [selectedExperience, setSelectedExperience] = useState<FitnessExperience>(
    profile.fitnessExperience || 'intermediate'
  );
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptBox, setShowPromptBox] = useState(false);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      regeneratePlan(customPrompt);
      setIsRegenerating(false);
      setShowPromptBox(false);
      setCustomPrompt('');
    }, 600);
  };

  const { workout, nutrition, recovery } = plan;

  return (
    <div className="health-plan-container">
      {/* Plan Header */}
      <div className="plan-header-row system-window">
        <div className="plan-header-info">
          <div className="plan-badge-row">
            <span className="plan-status-pill">AI ACTIVE PROTOCOL</span>
            <span className="plan-goal-pill">MISSION: {workout.goal}</span>
            <span className="plan-date-pill">
              SYNTHESIZED: {new Date(plan.generatedAt).toLocaleDateString()}
            </span>
          </div>
          <h2 className="plan-main-title">PERSONALIZED BODY DEVELOPMENT PROTOCOL</h2>
          <p className="plan-lead-desc">
            Custom-tailored exercise biomechanics, precision nutritional macros, and neuro-recovery
            routines calibrated to your physical profile.
          </p>
        </div>

        <div className="plan-header-actions">
          <button
            className="btn-regenerate-plan"
            onClick={() => setShowPromptBox(!showPromptBox)}
            id="btn-regenerate-plan"
          >
            <span className="refresh-icon">{isRegenerating ? '⏳' : '⚡'}</span>
            <span>{isRegenerating ? 'Synthesizing...' : 'Regenerate Protocol'}</span>
          </button>
        </div>
      </div>

      {/* Optional Custom Directive Input Box */}
      {showPromptBox && (
        <div className="plan-directive-modal system-window">
          <div className="directive-header">
            <h4>CUSTOMIZE PROTOCOL DIRECTIVE</h4>
            <button className="btn-close-directive" onClick={() => setShowPromptBox(false)}>
              ✕
            </button>
          </div>
          <p className="directive-desc">
            Provide specific guidelines (e.g., "Focus more on shoulder hypertrophy", "Only 3 days
            available this week", "Low-carb preference", "Knee-friendly lower body").
          </p>
          <input
            type="text"
            className="directive-input"
            placeholder="E.g. Focus on chest development with dumbbells, vegetarian protein options..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
          <div className="directive-actions">
            <button className="btn-cancel-directive" onClick={() => setShowPromptBox(false)}>
              Cancel
            </button>
            <button className="btn-confirm-directive" onClick={handleRegenerate}>
              Generate Updated Plan
            </button>
          </div>
        </div>
      )}

      {/* Plan Section Navigation Tabs */}
      <div className="plan-nav-tabs">
        <button
          className={`plan-tab-btn ${activeTab === 'workout' ? 'active' : ''}`}
          onClick={() => setActiveTab('workout')}
        >
          <span className="tab-icon">🏋️</span>
          <span>1. Workout Routine</span>
        </button>
        <button
          className={`plan-tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
          onClick={() => setActiveTab('nutrition')}
        >
          <span className="tab-icon">🥗</span>
          <span>2. Nutrition & Macros</span>
        </button>
        <button
          className={`plan-tab-btn ${activeTab === 'recovery' ? 'active' : ''}`}
          onClick={() => setActiveTab('recovery')}
        >
          <span className="tab-icon">🌙</span>
          <span>3. Recovery & Sleep</span>
        </button>
      </div>

      {/* TAB 1: WORKOUT ROUTINE */}
      {activeTab === 'workout' && (
        <div className="workout-plan-view">
          {/* Adaptation Tier Switcher */}
          <div className="adaptation-tier-banner system-window">
            <div className="tier-info">
              <span className="tier-label">EXPERIENCE ADAPTATION LEVEL:</span>
              <span className="tier-current">{selectedExperience.toUpperCase()} TIER</span>
            </div>
            <div className="tier-buttons">
              {(['beginner', 'intermediate', 'advanced'] as FitnessExperience[]).map((exp) => (
                <button
                  key={exp}
                  className={`btn-tier-select ${selectedExperience === exp ? 'active' : ''}`}
                  onClick={() => setSelectedExperience(exp)}
                >
                  {exp.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="tier-guideline-card system-window">
            <span className="tier-cue-icon">💡</span>
            <div className="tier-cue-text">
              <strong>{selectedExperience.toUpperCase()} DIRECTIVE: </strong>
              {workout.adaptations[selectedExperience]}
            </div>
          </div>

          {/* 7-Day Schedule Stream */}
          <div className="weekly-workout-grid">
            {workout.weeklySchedule.map((dayPlan, idx) => (
              <div
                key={idx}
                className={`workout-day-card system-window ${dayPlan.isRest ? 'is-rest-day' : ''}`}
              >
                <div className="day-card-header">
                  <div className="day-name-badge">{dayPlan.day.toUpperCase()}</div>
                  <span className={`day-status-pill ${dayPlan.isRest ? 'rest' : 'training'}`}>
                    {dayPlan.isRest ? 'RECOVERY & MOBILITY' : 'TRAINING MISSION'}
                  </span>
                </div>

                <h3 className="day-session-title">{dayPlan.title}</h3>
                <div className="day-focus-tag">🎯 Focus: {dayPlan.focus}</div>

                {dayPlan.exercises.length > 0 && (
                  <div className="exercises-table-wrapper">
                    <table className="exercises-table">
                      <thead>
                        <tr>
                          <th>Exercise</th>
                          <th>Sets</th>
                          <th>Reps</th>
                          <th>Rest</th>
                          <th>Biomechanics Cue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayPlan.exercises.map((ex, exIdx) => (
                          <tr key={exIdx}>
                            <td className="exercise-name">{ex.name}</td>
                            <td className="exercise-val">{ex.sets}</td>
                            <td className="exercise-val">{ex.reps}</td>
                            <td className="exercise-val">{ex.rest}</td>
                            <td className="exercise-notes">{ex.notes || 'Strict control'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {dayPlan.cardio && (
                  <div className="day-extra-chip cardio">
                    <span className="chip-icon">🏃</span>
                    <span><strong>Cardio Engine:</strong> {dayPlan.cardio}</span>
                  </div>
                )}

                {dayPlan.mobility && (
                  <div className="day-extra-chip mobility">
                    <span className="chip-icon">🧘</span>
                    <span><strong>Mobility Protocol:</strong> {dayPlan.mobility}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Safety & Progressive Overload Rules */}
          <div className="workout-rules-box system-window">
            <h4>WORKOUT EXECUTION SAFETY GUIDELINES</h4>
            <ul>
              {workout.recoveryGuidelines.map((rule, rIdx) => (
                <li key={rIdx}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: NUTRITION & FUELING */}
      {activeTab === 'nutrition' && (
        <div className="nutrition-plan-view">
          {/* Caloric & Macronutrient Overview Ribbon */}
          <div className="nutrition-summary-grid">
            <div className="nutri-stat-card system-window">
              <span className="nutri-label">DAILY CALORIC TARGET</span>
              <div className="nutri-val cyan">
                {nutrition.calorieGuidance.targetCalories}
                <span className="nutri-unit">kcal / day</span>
              </div>
              <p className="nutri-expl">{nutrition.calorieGuidance.explanation}</p>
            </div>

            <div className="nutri-stat-card system-window">
              <span className="nutri-label">PROTEIN TARGET</span>
              <div className="nutri-val emerald">
                {nutrition.macroGuidance.proteinGrams}
                <span className="nutri-unit">g / day</span>
              </div>
              <p className="nutri-expl">
                ~{(nutrition.macroGuidance.proteinGrams / profile.weightKg).toFixed(1)}g per kg body mass
                to protect lean tissue.
              </p>
            </div>

            <div className="nutri-stat-card system-window">
              <span className="nutri-label">COMPLEX CARBOHYDRATES</span>
              <div className="nutri-val purple">
                {nutrition.macroGuidance.carbsGrams}
                <span className="nutri-unit">g / day</span>
              </div>
              <p className="nutri-expl">Glycogen replenishment and training performance fuel.</p>
            </div>

            <div className="nutri-stat-card system-window">
              <span className="nutri-label">ESSENTIAL HEALTHY FATS</span>
              <div className="nutri-val amber">
                {nutrition.macroGuidance.fatsGrams}
                <span className="nutri-unit">g / day</span>
              </div>
              <p className="nutri-expl">Hormonal homeostasis and fat-soluble vitamin absorption.</p>
            </div>
          </div>

          {/* Meal Architecture */}
          <div className="meal-structure-section">
            <h3 className="section-sub-heading">OPTIMAL DAILY MEAL ARCHITECTURE</h3>
            <div className="meals-grid">
              {nutrition.mealStructure.map((meal, mIdx) => (
                <div key={mIdx} className="meal-card system-window">
                  <div className="meal-header">
                    <h4 className="meal-title">{meal.meal}</h4>
                    <div className="meal-targets">
                      <span>~{meal.targetCalories} kcal</span>
                      <span className="dot-sep">•</span>
                      <span>~{meal.targetProteinGrams}g Protein</span>
                    </div>
                  </div>
                  <p className="meal-rec">{meal.recommendation}</p>
                  <div className="meal-options-box">
                    <span className="options-label">SUGGESTED COMBINATIONS:</span>
                    <ul>
                      {meal.suggestions.map((sug, sIdx) => (
                        <li key={sIdx}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hydration & Dietary Adjustments */}
          <div className="nutri-extras-grid">
            <div className="nutri-extra-box system-window">
              <h4>💧 HYDRATION STRATEGY</h4>
              <p>{nutrition.hydrationStrategy}</p>
            </div>
            <div className="nutri-extra-box system-window">
              <h4>🥗 DIETARY PREFERENCE FILTERS</h4>
              <p>{nutrition.dietaryNotes}</p>
            </div>
          </div>

          {/* Nutrition Disclaimer */}
          <div className="nutrition-disclaimer-note system-window">
            <span>ℹ️ <strong>Wellness Disclaimer:</strong> {nutrition.disclaimer}</span>
          </div>
        </div>
      )}

      {/* TAB 3: RECOVERY & SLEEP */}
      {activeTab === 'recovery' && (
        <div className="recovery-plan-view">
          <div className="recovery-hero-card system-window">
            <div className="recovery-hero-left">
              <span className="recovery-badge">CIRCADIAN ARCHITECTURE</span>
              <h3>OPTIMIZE YOUR DEEP SLEEP & SLOW-WAVE PULSE</h3>
              <p>
                Muscular hypertrophy, neurotransmitter re-sensitization, and systemic adaptation
                occur primarily during deep non-REM and REM sleep phases.
              </p>
            </div>
            <div className="recovery-hero-stat">
              <span className="hero-stat-num">{recovery.sleepTargetHours}</span>
              <span className="hero-stat-unit">HOURS TARGET</span>
            </div>
          </div>

          {/* Sleep Optimization Protocols */}
          <div className="recovery-section-block system-window">
            <h4>🌙 SLEEP ARCHITECTURE GUIDELINES</h4>
            <div className="protocols-list">
              {recovery.sleepOptimizationProtocols.map((proto, idx) => (
                <div key={idx} className="protocol-item">
                  <span className="proto-num">0{idx + 1}</span>
                  <span className="proto-text">{proto}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobility Routine */}
          <div className="recovery-section-block system-window">
            <h4>🧘 DAILY DECOMPRESSION & MOBILITY FLOW</h4>
            <div className="protocols-list">
              {recovery.dailyMobilityRoutine.map((mob, idx) => (
                <div key={idx} className="protocol-item">
                  <span className="proto-icon">◈</span>
                  <span className="proto-text">{mob}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Reminders */}
          <div className="recovery-section-block system-window">
            <h4>🔔 RECOVERY CUES & AUTONOMIC BIOFEEDBACK</h4>
            <div className="protocols-list">
              {recovery.recoveryReminders.map((rem, idx) => (
                <div key={idx} className="protocol-item">
                  <span className="proto-icon">⚡</span>
                  <span className="proto-text">{rem}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
