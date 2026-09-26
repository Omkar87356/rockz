import {
  HealthProfile,
  DailyCheckIn,
  CalculatedHealthMetrics,
  AIInsightItem,
  SexType,
  ActivityLevel,
  FitnessGoal,
} from '../types/health';

// ==========================================
// UNIT CONVERSION UTILITIES
// ==========================================

export const kgToLb = (kg: number): number => {
  return Math.round(kg * 2.20462 * 10) / 10;
};

export const lbToKg = (lb: number): number => {
  return Math.round((lb / 2.20462) * 10) / 10;
};

export const cmToFtIn = (cm: number): { feet: number; inches: number; label: string } => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return {
    feet,
    inches,
    label: `${feet}'${inches}"`,
  };
};

export const ftInToCm = (feet: number, inches: number): number => {
  return Math.round((feet * 12 + inches) * 2.54);
};

export const litersToOz = (liters: number): number => {
  return Math.round(liters * 33.814);
};

export const ozToLiters = (oz: number): number => {
  return Math.round((oz / 33.814) * 10) / 10;
};

export const cmToIn = (cm: number): number => {
  return Math.round((cm / 2.54) * 10) / 10;
};

export const inToCm = (inches: number): number => {
  return Math.round(inches * 2.54 * 10) / 10;
};

// ==========================================
// CLINICAL & HEALTH METRICS CALCULATIONS
// ==========================================

/**
 * Calculates Body Mass Index (BMI).
 * Important: BMI is an epidemiological screening metric and does not directly measure body fat or muscle mass.
 */
export const calculateBMI = (weightKg: number, heightCm: number): {
  value: number;
  category: string;
  color: string;
  disclaimer: string;
} => {
  if (heightCm <= 0 || weightKg <= 0) {
    return {
      value: 0,
      category: 'Unknown',
      color: '#7890A8',
      disclaimer: 'Invalid height or weight measurements.',
    };
  }

  const heightMeters = heightCm / 100;
  const rawBMI = weightKg / (heightMeters * heightMeters);
  const value = Math.round(rawBMI * 10) / 10;

  let category = 'Normal Weight';
  let color = '#00FF9C'; // Emerald green

  if (value < 18.5) {
    category = 'Underweight';
    color = '#00E5FF'; // Cyan
  } else if (value < 25) {
    category = 'Normal Weight';
    color = '#00FF9C'; // Emerald
  } else if (value < 30) {
    category = 'Overweight';
    color = '#FFB800'; // Amber
  } else if (value < 35) {
    category = 'Obesity Class I';
    color = '#FF8400'; // Orange
  } else {
    category = 'Obesity Class II+';
    color = '#FF3366'; // Red/Flame
  }

  return {
    value,
    category,
    color,
    disclaimer:
      'BMI is a standardized screening metric based on height and weight. It does not differentiate between skeletal muscle and adipose tissue and is not a medical diagnosis.',
  };
};

/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.
 */
export const calculateBMR = (
  weightKg: number,
  heightCm: number,
  age: number,
  sex: SexType
): number => {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 1600;

  // Mifflin-St Jeor formula
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === 'male') {
    return Math.round(base + 5);
  } else if (sex === 'female') {
    return Math.round(base - 161);
  }
  return Math.round(base - 78); // Average for other / non-specified
};

/**
 * Calculates Total Daily Energy Expenditure (TDEE) based on activity level multiplier.
 */
export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.375));
};

/**
 * Evaluates Blood Pressure measurements according to standard clinical ranges (AHA / ACC guidelines).
 * Non-diagnostic: highlights values requiring clinical evaluation.
 */
export const evaluateBloodPressure = (
  systolic: number,
  diastolic: number
): {
  label: string;
  level: 'normal' | 'elevated' | 'stage1' | 'stage2' | 'crisis' | 'low';
  color: string;
  advice: string;
  isConcerning: boolean;
} => {
  if (!systolic || !diastolic) {
    return {
      label: 'Not Recorded',
      level: 'normal',
      color: '#7890A8',
      advice: 'No recent blood pressure data.',
      isConcerning: false,
    };
  }

  if (systolic > 180 || diastolic > 120) {
    return {
      label: 'Hypertensive Urgency Alert',
      level: 'crisis',
      color: '#FF3366',
      advice:
        'Measurement is unusually high (>180/>120 mmHg). Please rest and re-test. If confirmed or accompanied by symptoms (headache, chest pain, vision changes), seek prompt medical attention from a healthcare provider.',
      isConcerning: true,
    };
  }

  if (systolic < 90 || diastolic < 60) {
    return {
      label: 'Low Blood Pressure',
      level: 'low',
      color: '#00E5FF',
      advice:
        'Measurement is in the lower range (<90/<60 mmHg). If you experience dizziness or fatigue, consult a qualified healthcare professional.',
      isConcerning: true,
    };
  }

  if (systolic >= 140 || diastolic >= 90) {
    return {
      label: 'Stage 2 Range',
      level: 'stage2',
      color: '#FF3366',
      advice:
        'Readings are elevated into Stage 2 range (>=140 or >=90 mmHg). We recommend reviewing these readings with your physician for formal clinical evaluation.',
      isConcerning: true,
    };
  }

  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      label: 'Stage 1 Range',
      level: 'stage1',
      color: '#FF8400',
      advice:
        'Readings are in the Stage 1 range (130-139 / 80-89 mmHg). Healthy sodium intake, regular cardiovascular exercise, and stress management can help.',
      isConcerning: false,
    };
  }

  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      label: 'Elevated',
      level: 'elevated',
      color: '#FFB800',
      advice:
        'Systolic pressure is slightly elevated (120-129 mmHg). Ideal lifestyle habits help prevent progression to higher stages.',
      isConcerning: false,
    };
  }

  return {
    label: 'Optimal / Normal',
    level: 'normal',
    color: '#00FF9C',
    advice: 'Blood pressure is within the healthy standard range (<120 and <80 mmHg).',
    isConcerning: false,
  };
};

/**
 * Evaluates Resting Heart Rate (BPM).
 */
export const evaluateHeartRate = (
  bpm: number
): {
  label: string;
  level: 'normal' | 'athlete' | 'elevated' | 'low';
  color: string;
  advice: string;
  isConcerning: boolean;
} => {
  if (!bpm) {
    return {
      label: 'Not Recorded',
      level: 'normal',
      color: '#7890A8',
      advice: 'No resting heart rate recorded.',
      isConcerning: false,
    };
  }

  if (bpm > 100) {
    return {
      label: 'Elevated (>100 BPM)',
      level: 'elevated',
      color: '#FF3366',
      advice:
        'Resting heart rate exceeds 100 BPM. Ensure you are well hydrated, rested, and not under acute caffeine or stress. If resting rate remains persistently elevated, consult a healthcare provider.',
      isConcerning: true,
    };
  }

  if (bpm < 50) {
    return {
      label: 'Athletic / Low (<50 BPM)',
      level: 'athlete',
      color: '#00E5FF',
      advice:
        'Lower resting heart rates are common in endurance athletes. If you feel dizzy, lightheaded, or fatigued, consider having it evaluated by a doctor.',
      isConcerning: false,
    };
  }

  if (bpm >= 50 && bpm <= 80) {
    return {
      label: 'Optimal (50-80 BPM)',
      level: 'normal',
      color: '#00FF9C',
      advice: 'Your resting heart rate indicates strong cardiovascular efficiency.',
      isConcerning: false,
    };
  }

  return {
    label: 'Standard (81-100 BPM)',
    level: 'normal',
    color: '#FFB800',
    advice: 'Within normal clinical resting limits (60-100 BPM). Regular aerobic activity can help lower resting heart rate over time.',
    isConcerning: false,
  };
};

/**
 * Computes all consolidated health metrics from the profile.
 */
export const computeAllHealthMetrics = (profile: HealthProfile): CalculatedHealthMetrics => {
  const bmiInfo = calculateBMI(profile.weightKg, profile.heightCm);
  const bmr = calculateBMR(profile.weightKg, profile.heightCm, profile.age, profile.sex);
  const tdee = calculateTDEE(bmr, profile.activityLevel);

  // Target calories based on goal
  let targetCalories = tdee;
  if (profile.currentFitnessGoal === 'lose_weight') {
    targetCalories = Math.max(1300, Math.round(tdee - 450)); // Safe, sustainable deficit
  } else if (profile.currentFitnessGoal === 'build_muscle') {
    targetCalories = Math.round(tdee + 275); // Lean surplus
  } else if (profile.currentFitnessGoal === 'increase_strength') {
    targetCalories = Math.round(tdee + 150);
  }

  // Protein targets (g/kg bodyweight)
  let proteinMultiplier = 1.6;
  if (profile.currentFitnessGoal === 'build_muscle' || profile.currentFitnessGoal === 'increase_strength') {
    proteinMultiplier = 2.0;
  } else if (profile.currentFitnessGoal === 'lose_weight') {
    proteinMultiplier = 1.8; // High protein helps preserve lean muscle during deficit
  }
  const proteinGrams = Math.round(profile.weightKg * proteinMultiplier);

  // Water calculation: ~35ml per kg bodyweight + activity
  const waterTargetLiters = Math.max(2.0, Math.round((profile.weightKg * 0.035 + (profile.activityLevel === 'active' || profile.activityLevel === 'very_active' ? 0.7 : 0.2)) * 10) / 10);

  const bpStatus = evaluateBloodPressure(profile.bloodPressureSystolic, profile.bloodPressureDiastolic);
  const hrStatus = evaluateHeartRate(profile.restingHeartRateBpm);

  return {
    bmi: bmiInfo.value,
    bmiCategory: bmiInfo.category,
    bmiColor: bmiInfo.color,
    bmr,
    tdee,
    targetCalories,
    proteinGrams,
    waterTargetLiters,
    bpStatus,
    hrStatus,
  };
};

// ==========================================
// INPUT VALIDATION HELPERS
// ==========================================

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateHealthProfile = (data: Partial<HealthProfile>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Please provide your name or codename.';
  }

  if (!data.age || data.age < 12 || data.age > 120) {
    errors.age = 'Age must be between 12 and 120 years.';
  }

  if (!data.heightCm || data.heightCm < 50 || data.heightCm > 260) {
    errors.heightCm = 'Height must be between 50 cm and 260 cm (approx 1ft 8in to 8ft 6in).';
  }

  if (!data.weightKg || data.weightKg < 25 || data.weightKg > 350) {
    errors.weightKg = 'Weight must be between 25 kg and 350 kg (approx 55 lb to 770 lb).';
  }

  if (data.targetWeightKg && (data.targetWeightKg < 25 || data.targetWeightKg > 350)) {
    errors.targetWeightKg = 'Target weight must be between 25 kg and 350 kg.';
  }

  if (data.restingHeartRateBpm && (data.restingHeartRateBpm < 35 || data.restingHeartRateBpm > 220)) {
    errors.restingHeartRateBpm = 'Resting heart rate must be between 35 and 220 BPM.';
  }

  if (data.bloodPressureSystolic && (data.bloodPressureSystolic < 60 || data.bloodPressureSystolic > 250)) {
    errors.bloodPressureSystolic = 'Systolic pressure must be between 60 and 250 mmHg.';
  }

  if (data.bloodPressureDiastolic && (data.bloodPressureDiastolic < 40 || data.bloodPressureDiastolic > 150)) {
    errors.bloodPressureDiastolic = 'Diastolic pressure must be between 40 and 150 mmHg.';
  }

  if (data.bloodPressureSystolic && data.bloodPressureDiastolic && data.bloodPressureSystolic <= data.bloodPressureDiastolic) {
    errors.bloodPressureSystolic = 'Systolic pressure must be higher than diastolic pressure.';
  }

  if (data.bodyFatPercentage !== undefined && data.bodyFatPercentage !== null && (data.bodyFatPercentage < 3 || data.bodyFatPercentage > 65)) {
    errors.bodyFatPercentage = 'Body fat percentage must be between 3% and 65%.';
  }

  if (data.waistCm && (data.waistCm < 40 || data.waistCm > 200)) {
    errors.waistCm = 'Waist circumference must be between 40 cm and 200 cm.';
  }

  if (data.dailyStepTarget && (data.dailyStepTarget < 1000 || data.dailyStepTarget > 50000)) {
    errors.dailyStepTarget = 'Daily step target must be between 1,000 and 50,000 steps.';
  }

  if (data.sleepTargetHours && (data.sleepTargetHours < 4 || data.sleepTargetHours > 14)) {
    errors.sleepTargetHours = 'Sleep target must be between 4 and 14 hours.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateDailyCheckIn = (data: Partial<DailyCheckIn>): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.date) {
    errors.date = 'Date is required.';
  }

  if (!data.weightKg || data.weightKg < 25 || data.weightKg > 350) {
    errors.weightKg = 'Weight must be between 25 kg and 350 kg.';
  }

  if (data.restingHeartRateBpm && (data.restingHeartRateBpm < 35 || data.restingHeartRateBpm > 220)) {
    errors.restingHeartRateBpm = 'Heart rate must be between 35 and 220 BPM.';
  }

  if (data.bloodPressureSystolic && (data.bloodPressureSystolic < 60 || data.bloodPressureSystolic > 250)) {
    errors.bloodPressureSystolic = 'Systolic must be 60-250 mmHg.';
  }

  if (data.bloodPressureDiastolic && (data.bloodPressureDiastolic < 40 || data.bloodPressureDiastolic > 150)) {
    errors.bloodPressureDiastolic = 'Diastolic must be 40-150 mmHg.';
  }

  if (data.sleepHours !== undefined && (data.sleepHours < 0 || data.sleepHours > 24)) {
    errors.sleepHours = 'Sleep hours must be between 0 and 24.';
  }

  if (data.steps !== undefined && (data.steps < 0 || data.steps > 100000)) {
    errors.steps = 'Steps must be between 0 and 100,000.';
  }

  if (data.waterLiters !== undefined && (data.waterLiters < 0 || data.waterLiters > 15)) {
    errors.waterLiters = 'Water intake must be between 0 and 15 Liters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ==========================================
// AUTOMATED AI INSIGHTS GENERATOR
// ==========================================

export const generateHealthInsights = (
  profile: HealthProfile,
  checkIns: DailyCheckIn[]
): AIInsightItem[] => {
  const insights: AIInsightItem[] = [];
  const metrics = computeAllHealthMetrics(profile);
  const now = new Date().toISOString();

  // 1. Weight Trends (Recorded Data)
  if (checkIns.length >= 2) {
    const sorted = [...checkIns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const latest = sorted[sorted.length - 1];
    const earliest = sorted[0];
    const diff = Math.round((latest.weightKg - earliest.weightKg) * 10) / 10;
    const daysDiff = Math.max(1, Math.round((new Date(latest.date).getTime() - new Date(earliest.date).getTime()) / (1000 * 60 * 60 * 24)));

    const unit = profile.unitPreferences.weight === 'lb' ? 'lb' : 'kg';
    const displayDiff = profile.unitPreferences.weight === 'lb' ? kgToLb(Math.abs(diff)) : Math.abs(diff);

    if (Math.abs(diff) >= 0.1) {
      insights.push({
        id: 'insight-weight-trend',
        category: 'recorded',
        title: 'Body Mass Trajectory',
        message: `Your recorded weight has changed by ${diff > 0 ? '+' : '-'}${displayDiff} ${unit} over the recorded ${daysDiff}-day window (${earliest.weightKg} kg → ${latest.weightKg} kg).`,
        metricReference: `${diff > 0 ? '+' : ''}${displayDiff} ${unit}`,
        type: diff < 0 && profile.currentFitnessGoal === 'lose_weight' ? 'positive' : diff > 0 && profile.currentFitnessGoal === 'build_muscle' ? 'positive' : 'neutral',
        timestamp: now,
      });
    }
  }

  // 2. Calculated Metric (BMR / TDEE)
  insights.push({
    id: 'insight-calculated-tdee',
    category: 'calculated',
    title: 'Metabolic Energy Baseline',
    message: `Based on the Mifflin-St Jeor metabolic model, your Basal Metabolic Rate is ~${metrics.bmr} kcal/day. Factoring in your ${profile.activityLevel.replace('_', ' ')} routine, estimated Total Daily Energy Expenditure (TDEE) is ~${metrics.tdee} kcal/day.`,
    metricReference: `TDEE: ${metrics.tdee} kcal`,
    type: 'neutral',
    timestamp: now,
  });

  // 3. Sleep & Recovery Insights (Recorded / AI Suggestion)
  if (checkIns.length > 0) {
    const recentCheckIns = checkIns.slice(-7);
    const avgSleep = Math.round((recentCheckIns.reduce((sum, c) => sum + c.sleepHours, 0) / recentCheckIns.length) * 10) / 10;
    const sleepDelta = Math.round((avgSleep - profile.sleepTargetHours) * 10) / 10;

    if (sleepDelta < -0.8) {
      insights.push({
        id: 'insight-sleep-deficit',
        category: 'ai_suggestion',
        title: 'Sleep Optimization Window',
        message: `Your 7-day average sleep duration (${avgSleep}h) is currently ${Math.abs(sleepDelta)}h below your target (${profile.sleepTargetHours}h). Prioritizing an extra 45 minutes of sleep can dramatically enhance muscle recovery and insulin sensitivity.`,
        metricReference: `Avg: ${avgSleep}h / ${profile.sleepTargetHours}h`,
        type: 'caution',
        timestamp: now,
      });
    } else {
      insights.push({
        id: 'insight-sleep-optimal',
        category: 'ai_suggestion',
        title: 'Recovery Integrity High',
        message: `Your recent average sleep duration of ${avgSleep} hours is consistently meeting your target. This supports optimal hormone balance and central nervous system recovery.`,
        metricReference: `${avgSleep} hrs/night`,
        type: 'positive',
        timestamp: now,
      });
    }
  }

  // 4. Cardiovascular / Vitals Check (Recorded & Medical Notice)
  if (metrics.bpStatus.isConcerning) {
    insights.push({
      id: 'insight-bp-notice',
      category: 'medical_notice',
      title: 'Blood Pressure Observation',
      message: `${metrics.bpStatus.advice} (Recorded: ${profile.bloodPressureSystolic}/${profile.bloodPressureDiastolic} mmHg).`,
      metricReference: `${profile.bloodPressureSystolic}/${profile.bloodPressureDiastolic} mmHg`,
      type: 'caution',
      timestamp: now,
    });
  } else if (profile.bloodPressureSystolic && profile.bloodPressureDiastolic) {
    insights.push({
      id: 'insight-bp-optimal',
      category: 'recorded',
      title: 'Blood Pressure Status',
      message: `Your latest recorded blood pressure (${profile.bloodPressureSystolic}/${profile.bloodPressureDiastolic} mmHg) falls within the healthy standard range (<120/<80 mmHg).`,
      metricReference: `${profile.bloodPressureSystolic}/${profile.bloodPressureDiastolic} mmHg`,
      type: 'positive',
      timestamp: now,
    });
  }

  // 5. Resting Heart Rate Trend
  if (metrics.hrStatus.isConcerning) {
    insights.push({
      id: 'insight-hr-notice',
      category: 'medical_notice',
      title: 'Heart Rate Observation',
      message: `${metrics.hrStatus.advice} (Recorded: ${profile.restingHeartRateBpm} BPM).`,
      metricReference: `${profile.restingHeartRateBpm} BPM`,
      type: 'caution',
      timestamp: now,
    });
  } else if (profile.restingHeartRateBpm) {
    insights.push({
      id: 'insight-hr-optimal',
      category: 'recorded',
      title: 'Cardiovascular Efficiency',
      message: `Your resting heart rate of ${profile.restingHeartRateBpm} BPM reflects healthy cardiac stroke volume and autonomic regulation.`,
      metricReference: `${profile.restingHeartRateBpm} BPM`,
      type: 'positive',
      timestamp: now,
    });
  }

  // 6. Protein & Nutrition Guideline (AI Suggestion)
  insights.push({
    id: 'insight-protein-target',
    category: 'ai_suggestion',
    title: 'Protein Synthesis Target',
    message: `For your goal of ${profile.currentFitnessGoal.replace('_', ' ')}, aim for approximately ${metrics.proteinGrams}g of daily dietary protein (~${(metrics.proteinGrams / profile.weightKg).toFixed(1)}g/kg) spread across 3-4 meals to maximize muscle protein synthesis.`,
    metricReference: `Target: ${metrics.proteinGrams}g / day`,
    type: 'tip',
    timestamp: now,
  });

  return insights;
};
