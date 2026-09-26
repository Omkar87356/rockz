import React, { useState } from 'react';
import { useHealth } from '../../../context/HealthContext';
import {
  HealthProfile,
  SexType,
  ActivityLevel,
  FitnessExperience,
  FitnessGoal,
  DietaryPreference,
} from '../../../types/health';
import {
  validateHealthProfile,
  kgToLb,
  lbToKg,
  cmToFtIn,
  ftInToCm,
  litersToOz,
  ozToLiters,
  cmToIn,
  inToCm,
} from '../../../utils/healthCalculations';

export const HealthProfileModal: React.FC = () => {
  const {
    profile,
    updateProfile,
    isProfileModalOpen,
    setIsProfileModalOpen,
    unitPreferences,
    setUnitPreferences,
  } = useHealth();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Unit preferences local toggles
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>(unitPreferences.weight);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft_in'>(unitPreferences.height);
  const [waterUnit, setWaterUnit] = useState<'L' | 'oz'>(unitPreferences.water);
  const [waistUnit, setWaistUnit] = useState<'cm' | 'in'>(unitPreferences.waist);

  // Form fields
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age.toString());
  const [sex, setSex] = useState<SexType>(profile.sex);

  // Height state
  const ftIn = cmToFtIn(profile.heightCm);
  const [heightCm, setHeightCm] = useState(profile.heightCm.toString());
  const [feet, setFeet] = useState(ftIn.feet.toString());
  const [inches, setInches] = useState(ftIn.inches.toString());

  // Weight state
  const [weight, setWeight] = useState(
    weightUnit === 'lb' ? kgToLb(profile.weightKg).toString() : profile.weightKg.toString()
  );
  const [targetWeight, setTargetWeight] = useState(
    weightUnit === 'lb' ? kgToLb(profile.targetWeightKg).toString() : profile.targetWeightKg.toString()
  );

  // Vitals
  const [restingHeartRate, setRestingHeartRate] = useState(
    profile.restingHeartRateBpm.toString()
  );
  const [bpSystolic, setBpSystolic] = useState(profile.bloodPressureSystolic.toString());
  const [bpDiastolic, setBpDiastolic] = useState(profile.bloodPressureDiastolic.toString());
  const [bodyFat, setBodyFat] = useState(
    profile.bodyFatPercentage ? profile.bodyFatPercentage.toString() : ''
  );
  const [waist, setWaist] = useState(
    profile.waistCm
      ? waistUnit === 'in'
        ? cmToIn(profile.waistCm).toString()
        : profile.waistCm.toString()
      : ''
  );

  // Lifestyle & Targets
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel);
  const [stepTarget, setStepTarget] = useState(profile.dailyStepTarget.toString());
  const [sleepTarget, setSleepTarget] = useState(profile.sleepTargetHours.toString());
  const [waterTarget, setWaterTarget] = useState(
    waterUnit === 'oz'
      ? litersToOz(profile.waterTargetLiters).toString()
      : profile.waterTargetLiters.toString()
  );

  // Fitness & Diet
  const [fitnessExp, setFitnessExp] = useState<FitnessExperience>(profile.fitnessExperience);
  const [frequency, setFrequency] = useState(profile.exerciseFrequencyDays.toString());
  const [goal, setGoal] = useState<FitnessGoal>(profile.currentFitnessGoal);
  const [diet, setDiet] = useState<DietaryPreference>(profile.dietaryPreference);
  const [allergies, setAllergies] = useState(profile.allergiesIntolerances);
  const [medical, setMedical] = useState(profile.medicalConsiderations);

  if (!isProfileModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert values to canonical metric storage
    const parsedHeightCm =
      heightUnit === 'cm'
        ? parseFloat(heightCm)
        : ftInToCm(parseInt(feet) || 5, parseInt(inches) || 10);

    const parsedWeightKg =
      weightUnit === 'lb' ? lbToKg(parseFloat(weight)) : parseFloat(weight);

    const parsedTargetWeightKg =
      weightUnit === 'lb' ? lbToKg(parseFloat(targetWeight)) : parseFloat(targetWeight);

    const parsedWaistCm = waist
      ? waistUnit === 'in'
        ? inToCm(parseFloat(waist))
        : parseFloat(waist)
      : undefined;

    const parsedWaterLiters =
      waterUnit === 'oz' ? ozToLiters(parseFloat(waterTarget)) : parseFloat(waterTarget);

    const draftData: Partial<HealthProfile> = {
      name: name.trim(),
      age: parseInt(age) || 25,
      sex,
      heightCm: parsedHeightCm,
      weightKg: parsedWeightKg,
      targetWeightKg: parsedTargetWeightKg,
      restingHeartRateBpm: parseInt(restingHeartRate) || 70,
      bloodPressureSystolic: parseInt(bpSystolic) || 120,
      bloodPressureDiastolic: parseInt(bpDiastolic) || 80,
      bodyFatPercentage: bodyFat ? parseFloat(bodyFat) : undefined,
      waistCm: parsedWaistCm,
      activityLevel,
      dailyStepTarget: parseInt(stepTarget) || 10000,
      sleepTargetHours: parseFloat(sleepTarget) || 8.0,
      waterTargetLiters: parsedWaterLiters || 3.0,
      fitnessExperience: fitnessExp,
      exerciseFrequencyDays: parseInt(frequency) || 4,
      currentFitnessGoal: goal,
      dietaryPreference: diet,
      allergiesIntolerances: allergies.trim(),
      medicalConsiderations: medical.trim(),
      unitPreferences: {
        height: heightUnit,
        weight: weightUnit,
        water: waterUnit,
        waist: waistUnit,
      },
    };

    const validation = validateHealthProfile(draftData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    updateProfile(draftData);
    setUnitPreferences(draftData.unitPreferences!);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="health-modal-backdrop" onClick={() => setIsProfileModalOpen(false)}>
      <div className="health-modal-card system-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-super-title">BIO-METRIC ONBOARDING & CONFIGURATION</div>
            <h3 className="modal-title">PERSONAL HEALTH & VITAL PROFILE</h3>
          </div>
          <button className="btn-close-modal" onClick={() => setIsProfileModalOpen(false)}>
            ✕
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="wizard-step-tabs">
          <button
            className={`step-tab ${activeStep === 1 ? 'active' : ''}`}
            onClick={() => setActiveStep(1)}
          >
            <span>1. Identity & Physical</span>
          </button>
          <button
            className={`step-tab ${activeStep === 2 ? 'active' : ''}`}
            onClick={() => setActiveStep(2)}
          >
            <span>2. Vitals & Composition</span>
          </button>
          <button
            className={`step-tab ${activeStep === 3 ? 'active' : ''}`}
            onClick={() => setActiveStep(3)}
          >
            <span>3. Lifestyle & Targets</span>
          </button>
          <button
            className={`step-tab ${activeStep === 4 ? 'active' : ''}`}
            onClick={() => setActiveStep(4)}
          >
            <span>4. Goals & Nutrition</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form-body">
          {Object.keys(errors).length > 0 && (
            <div className="modal-validation-error-box">
              <strong>Please correct the following errors:</strong>
              <ul>
                {Object.values(errors).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* STEP 1: IDENTITY & BASIC PHYSICAL */}
          {activeStep === 1 && (
            <div className="wizard-step-content">
              <div className="units-selector-ribbon">
                <span className="unit-ribbon-label">Unit Standards:</span>
                <div className="unit-toggle-buttons">
                  <button
                    type="button"
                    className={`btn-unit ${weightUnit === 'kg' ? 'active' : ''}`}
                    onClick={() => {
                      if (weightUnit === 'lb') {
                        setWeight(lbToKg(parseFloat(weight) || 0).toString());
                        setTargetWeight(lbToKg(parseFloat(targetWeight) || 0).toString());
                      }
                      setWeightUnit('kg');
                    }}
                  >
                    KG / CM
                  </button>
                  <button
                    type="button"
                    className={`btn-unit ${weightUnit === 'lb' ? 'active' : ''}`}
                    onClick={() => {
                      if (weightUnit === 'kg') {
                        setWeight(kgToLb(parseFloat(weight) || 0).toString());
                        setTargetWeight(kgToLb(parseFloat(targetWeight) || 0).toString());
                      }
                      setWeightUnit('lb');
                    }}
                  >
                    LB / FT-IN
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>User Name / Hero Codename</label>
                <input
                  type="text"
                  className="modal-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name or codename"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age (years)</label>
                  <input
                    type="number"
                    className="modal-input"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="12"
                    max="120"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Biological Sex</label>
                  <select
                    className="modal-select"
                    value={sex}
                    onChange={(e) => setSex(e.target.value as SexType)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Non-Binary</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                {heightUnit === 'cm' ? (
                  <div className="form-group">
                    <label>Height (cm)</label>
                    <input
                      type="number"
                      className="modal-input"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      placeholder="e.g. 178"
                      min="50"
                      max="260"
                      required
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Height (ft & in)</label>
                    <div className="dual-inputs">
                      <input
                        type="number"
                        className="modal-input"
                        placeholder="Feet"
                        value={feet}
                        onChange={(e) => setFeet(e.target.value)}
                        min="2"
                        max="8"
                      />
                      <input
                        type="number"
                        className="modal-input"
                        placeholder="Inches"
                        value={inches}
                        onChange={(e) => setInches(e.target.value)}
                        min="0"
                        max="11"
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Current Weight ({weightUnit})</label>
                  <input
                    type="number"
                    step="0.1"
                    className="modal-input"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={weightUnit === 'lb' ? 'e.g. 165' : 'e.g. 75.0'}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Target Weight Goal ({weightUnit})</label>
                <input
                  type="number"
                  step="0.1"
                  className="modal-input"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  placeholder={weightUnit === 'lb' ? 'e.g. 160' : 'e.g. 72.0'}
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2: VITALS & BODY COMPOSITION */}
          {activeStep === 2 && (
            <div className="wizard-step-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Resting Heart Rate (BPM)</label>
                  <input
                    type="number"
                    className="modal-input"
                    value={restingHeartRate}
                    onChange={(e) => setRestingHeartRate(e.target.value)}
                    placeholder="e.g. 64"
                    min="35"
                    max="220"
                    required
                  />
                  <span className="field-hint">Measured upon waking or quiet rest</span>
                </div>

                <div className="form-group">
                  <label>Blood Pressure (Systolic / Diastolic)</label>
                  <div className="dual-inputs">
                    <input
                      type="number"
                      className="modal-input"
                      placeholder="Systolic (120)"
                      value={bpSystolic}
                      onChange={(e) => setBpSystolic(e.target.value)}
                      min="60"
                      max="250"
                      required
                    />
                    <input
                      type="number"
                      className="modal-input"
                      placeholder="Diastolic (80)"
                      value={bpDiastolic}
                      onChange={(e) => setBpDiastolic(e.target.value)}
                      min="40"
                      max="150"
                      required
                    />
                  </div>
                  <span className="field-hint">Standard healthy target &lt;120/80 mmHg</span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Body-Fat Percentage (% optional)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="modal-input"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                    placeholder="e.g. 18.5"
                    min="3"
                    max="65"
                  />
                </div>

                <div className="form-group">
                  <label>Waist Measurement ({waistUnit} optional)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="modal-input"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    placeholder={waistUnit === 'in' ? 'e.g. 32' : 'e.g. 82'}
                  />
                </div>
              </div>

              <div className="callout-card">
                🛡️ <strong>Safety Advisory:</strong> If you record systolic blood pressure &gt;140 mmHg or resting heart rate persistently &gt;100 BPM, we advise having these readings evaluated by a medical doctor.
              </div>
            </div>
          )}

          {/* STEP 3: LIFESTYLE & TARGETS */}
          {activeStep === 3 && (
            <div className="wizard-step-content">
              <div className="form-group">
                <label>Daily Activity Level</label>
                <select
                  className="modal-select"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                >
                  <option value="sedentary">Sedentary (Desk job, little intentional exercise)</option>
                  <option value="light">Light Activity (1-3 light sessions / week)</option>
                  <option value="moderate">Moderate Activity (3-5 workouts / week)</option>
                  <option value="active">Active (6-7 intense training sessions / week)</option>
                  <option value="very_active">Very Active (Physical job + daily athletic training)</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Daily Step Target</label>
                  <input
                    type="number"
                    className="modal-input"
                    value={stepTarget}
                    onChange={(e) => setStepTarget(e.target.value)}
                    placeholder="e.g. 10000"
                    min="1000"
                    max="50000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nightly Sleep Target (hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="modal-input"
                    value={sleepTarget}
                    onChange={(e) => setSleepTarget(e.target.value)}
                    placeholder="e.g. 8.0"
                    min="4"
                    max="14"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Daily Hydration Target ({waterUnit})</label>
                <input
                  type="number"
                  step="0.1"
                  className="modal-input"
                  value={waterTarget}
                  onChange={(e) => setWaterTarget(e.target.value)}
                  placeholder={waterUnit === 'oz' ? 'e.g. 100' : 'e.g. 3.2'}
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 4: GOALS, NUTRITION & MEDICAL */}
          {activeStep === 4 && (
            <div className="wizard-step-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Primary Fitness Goal</label>
                  <select
                    className="modal-select"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value as FitnessGoal)}
                  >
                    <option value="build_muscle">Build Muscle Hypertrophy</option>
                    <option value="lose_weight">Sustainable Fat Loss</option>
                    <option value="increase_strength">Increase Strength & Power</option>
                    <option value="improve_cardio">Improve Aerobic Conditioning</option>
                    <option value="improve_consistency">Improve Habit Consistency</option>
                    <option value="healthy_lifestyle">General Health & Longevity</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Fitness Experience Level</label>
                  <select
                    className="modal-select"
                    value={fitnessExp}
                    onChange={(e) => setFitnessExp(e.target.value as FitnessExperience)}
                  >
                    <option value="beginner">Beginner (&lt;1 year consistent lifting)</option>
                    <option value="intermediate">Intermediate (1-3 years experience)</option>
                    <option value="advanced">Advanced (3+ years structured training)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Training Frequency (days/week)</label>
                  <select
                    className="modal-select"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                  >
                    <option value="2">2 Days per week</option>
                    <option value="3">3 Days per week</option>
                    <option value="4">4 Days per week</option>
                    <option value="5">5 Days per week</option>
                    <option value="6">6 Days per week</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Dietary Preference</label>
                  <select
                    className="modal-select"
                    value={diet}
                    onChange={(e) => setDiet(e.target.value as DietaryPreference)}
                  >
                    <option value="omnivore">Omnivore (Standard balanced)</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan / Plant-Based</option>
                    <option value="pescatarian">Pescatarian</option>
                    <option value="keto">Ketogenic (High fat, low carb)</option>
                    <option value="paleo">Paleo</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="low_carb">Low-Carb</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Food Allergies or Intolerances (optional)</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="e.g. Lactose, Peanuts, Gluten, Shellfish, none"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Medical Conditions or Health Considerations (optional)</label>
                <textarea
                  className="modal-textarea"
                  rows={2}
                  placeholder="e.g. Mild asthma, prior knee surgery, none"
                  value={medical}
                  onChange={(e) => setMedical(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="modal-footer-nav">
            <div className="footer-nav-left">
              {activeStep > 1 && (
                <button
                  type="button"
                  className="btn-modal-back"
                  onClick={() => setActiveStep((prev) => (prev - 1) as any)}
                >
                  ← Back
                </button>
              )}
            </div>

            <div className="footer-nav-right">
              {activeStep < 4 ? (
                <button
                  type="button"
                  className="btn-modal-next"
                  onClick={() => setActiveStep((prev) => (prev + 1) as any)}
                >
                  Continue →
                </button>
              ) : (
                <button type="submit" className="btn-modal-save" id="btn-save-health-profile">
                  ✓ Synchronize Health Telemetry
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
