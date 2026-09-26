import React, { useState } from 'react';
import { useHealth } from '../../../context/HealthContext';
import { MoodType } from '../../../types/health';
import { kgToLb, lbToKg, litersToOz, ozToLiters, validateDailyCheckIn } from '../../../utils/healthCalculations';

export const DailyCheckInModal: React.FC = () => {
  const {
    profile,
    addCheckIn,
    isCheckInModalOpen,
    setIsCheckInModalOpen,
    unitPreferences,
  } = useHealth();

  const isLb = unitPreferences.weight === 'lb';
  const isOz = unitPreferences.water === 'oz';

  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [weight, setWeight] = useState(
    isLb ? kgToLb(profile.weightKg).toString() : profile.weightKg.toString()
  );
  const [heartRate, setHeartRate] = useState(profile.restingHeartRateBpm.toString());
  const [bpSystolic, setBpSystolic] = useState(profile.bloodPressureSystolic.toString());
  const [bpDiastolic, setBpDiastolic] = useState(profile.bloodPressureDiastolic.toString());
  const [sleep, setSleep] = useState(profile.sleepTargetHours.toString());
  const [steps, setSteps] = useState('10000');
  const [water, setWater] = useState(
    isOz ? litersToOz(profile.waterTargetLiters).toString() : profile.waterTargetLiters.toString()
  );
  const [workoutCompleted, setWorkoutCompleted] = useState(true);
  const [workoutDetails, setWorkoutDetails] = useState('Resistance Training Session');
  const [energyLevel, setEnergyLevel] = useState(8);
  const [mood, setMood] = useState<MoodType>('great');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isCheckInModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedWeightKg = isLb ? lbToKg(parseFloat(weight)) : parseFloat(weight);
    const parsedWaterLiters = isOz ? ozToLiters(parseFloat(water)) : parseFloat(water);

    const checkInData = {
      date,
      weightKg: parsedWeightKg,
      restingHeartRateBpm: heartRate ? parseInt(heartRate) : undefined,
      bloodPressureSystolic: bpSystolic ? parseInt(bpSystolic) : undefined,
      bloodPressureDiastolic: bpDiastolic ? parseInt(bpDiastolic) : undefined,
      sleepHours: parseFloat(sleep) || 8.0,
      steps: parseInt(steps) || 0,
      waterLiters: parsedWaterLiters || 3.0,
      workoutCompleted,
      workoutDetails: workoutCompleted ? workoutDetails.trim() : undefined,
      energyLevel,
      mood,
      notes: notes.trim(),
    };

    const validation = validateDailyCheckIn(checkInData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    addCheckIn(checkInData);
    setIsCheckInModalOpen(false);
  };

  return (
    <div className="health-modal-backdrop" onClick={() => setIsCheckInModalOpen(false)}>
      <div className="health-modal-card system-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-super-title">BIOLOGICAL TELEMETRY LOG</div>
            <h3 className="modal-title">⚡ DAILY BIO-CHECK-IN</h3>
          </div>
          <button className="btn-close-modal" onClick={() => setIsCheckInModalOpen(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="checkin-form-body">
          {Object.keys(errors).length > 0 && (
            <div className="modal-validation-error-box">
              {Object.values(errors).map((err, idx) => (
                <div key={idx}>{err}</div>
              ))}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Check-In Date</label>
              <input
                type="date"
                className="modal-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Morning Scale Weight ({isLb ? 'lb' : 'kg'})</label>
              <input
                type="number"
                step="0.1"
                className="modal-input"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={isLb ? 'e.g. 165' : 'e.g. 75.5'}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Resting Heart Rate (BPM)</label>
              <input
                type="number"
                className="modal-input"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="e.g. 64"
                min="35"
                max="220"
              />
            </div>

            <div className="form-group">
              <label>Blood Pressure (Systolic / Diastolic)</label>
              <div className="dual-inputs">
                <input
                  type="number"
                  className="modal-input"
                  placeholder="Systolic (118)"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  min="60"
                  max="250"
                />
                <input
                  type="number"
                  className="modal-input"
                  placeholder="Diastolic (76)"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  min="40"
                  max="150"
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Last Night's Sleep (hours)</label>
              <input
                type="number"
                step="0.5"
                className="modal-input"
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
                placeholder="e.g. 8.0"
                required
              />
            </div>

            <div className="form-group">
              <label>Daily Step Count</label>
              <input
                type="number"
                className="modal-input"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="e.g. 10450"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Water Consumed ({isOz ? 'oz' : 'Liters'})</label>
              <input
                type="number"
                step="0.1"
                className="modal-input"
                value={water}
                onChange={(e) => setWater(e.target.value)}
                placeholder={isOz ? 'e.g. 100' : 'e.g. 3.2'}
                required
              />
            </div>

            <div className="form-group">
              <label>Subjective Mood</label>
              <select
                className="modal-select"
                value={mood}
                onChange={(e) => setMood(e.target.value as MoodType)}
              >
                <option value="great">🔥 Great (High Drive)</option>
                <option value="good">⚡ Good (Normal Energy)</option>
                <option value="neutral">😐 Neutral (Steady)</option>
                <option value="tired">😴 Tired (Under-rested)</option>
                <option value="stressed">💥 Stressed (High Tension)</option>
              </select>
            </div>
          </div>

          {/* Energy Slider */}
          <div className="form-group">
            <div className="slider-label-row">
              <label>Physical Energy Index: <strong>{energyLevel} / 10</strong></label>
              <span className="slider-val-hint">
                {energyLevel >= 8 ? 'Peak Flow' : energyLevel >= 5 ? 'Steady Baseline' : 'Fatigued'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              className="modal-range-slider"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
            />
          </div>

          {/* Workout Completed Toggle */}
          <div className="workout-toggle-box">
            <label className="toggle-checkbox-label">
              <input
                type="checkbox"
                checked={workoutCompleted}
                onChange={(e) => setWorkoutCompleted(e.target.checked)}
              />
              <span className="custom-box" />
              <span>Did you complete a workout session today?</span>
            </label>

            {workoutCompleted && (
              <input
                type="text"
                className="modal-input workout-input"
                placeholder="Session summary (e.g. Push Hypertrophy, 5km Run, Mobility Flow)"
                value={workoutDetails}
                onChange={(e) => setWorkoutDetails(e.target.value)}
              />
            )}
          </div>

          <div className="form-group">
            <label>Daily Biofeedback Notes (optional)</label>
            <textarea
              className="modal-textarea"
              rows={2}
              placeholder="e.g. Felt great on bench press, slight right shoulder tightness, hydrated with electrolytes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-modal-secondary"
              onClick={() => setIsCheckInModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-modal-primary" id="btn-save-checkin">
              ✓ Log Telemetry Check-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
