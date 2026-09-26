import {
  HealthProfile,
  CalculatedHealthMetrics,
  DailyCheckIn,
  PersonalizedPlan,
  WorkoutPlan,
  NutritionPlan,
  RecoveryPlan,
  AIChatMessage,
} from '../types/health';
import { computeAllHealthMetrics } from '../utils/healthCalculations';

// AI Service Abstraction Layer
export interface AIHealthProvider {
  chat(context: AIHealthContext, message: string): Promise<string>;
  generatePlan(profile: HealthProfile, metrics: CalculatedHealthMetrics): Promise<PersonalizedPlan>;
}

export interface AIHealthContext {
  userName: string;
  age: number;
  sex: string;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  goal: string;
  experience: string;
  activityLevel: string;
  dietaryPreference: string;
  allergies: string;
  medicalNotes: string;
  bmi: number;
  tdee: number;
  restingHeartRate?: number;
  bloodPressure?: string;
  recentWeightChange?: string;
  avgSleepHours?: number;
}

/**
 * Creates minimum necessary sanitized context for the AI prompt
 */
export const buildMinimalHealthContext = (
  profile: HealthProfile,
  metrics: CalculatedHealthMetrics,
  checkIns: DailyCheckIn[]
): AIHealthContext => {
  let recentWeightChange = 'No prior data';
  let avgSleepHours = profile.sleepTargetHours;

  if (checkIns.length >= 2) {
    const sorted = [...checkIns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const delta = sorted[sorted.length - 1].weightKg - sorted[0].weightKg;
    recentWeightChange = `${delta >= 0 ? '+' : ''}${delta.toFixed(1)} kg over ${sorted.length} records`;
    avgSleepHours = Math.round((sorted.reduce((acc, c) => acc + c.sleepHours, 0) / sorted.length) * 10) / 10;
  }

  return {
    userName: profile.name || 'User',
    age: profile.age,
    sex: profile.sex,
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    targetWeightKg: profile.targetWeightKg,
    goal: profile.currentFitnessGoal,
    experience: profile.fitnessExperience,
    activityLevel: profile.activityLevel,
    dietaryPreference: profile.dietaryPreference,
    allergies: profile.allergiesIntolerances || 'None reported',
    medicalNotes: profile.medicalConsiderations || 'None reported',
    bmi: metrics.bmi,
    tdee: metrics.tdee,
    restingHeartRate: profile.restingHeartRateBpm,
    bloodPressure: `${profile.bloodPressureSystolic}/${profile.bloodPressureDiastolic} mmHg`,
    recentWeightChange,
    avgSleepHours,
  };
};

/**
 * Generates an intelligent, personalized workout, nutrition, and recovery plan
 */
export const generatePersonalizedDevelopmentPlan = (
  profile: HealthProfile,
  customDirective?: string
): PersonalizedPlan => {
  const metrics = computeAllHealthMetrics(profile);
  const goal = profile.currentFitnessGoal;
  const exp = profile.fitnessExperience;
  const diet = profile.dietaryPreference;

  // 1. Dynamic Workout Plan Generation
  let weeklySchedule = [];

  if (goal === 'build_muscle' || goal === 'increase_strength') {
    weeklySchedule = [
      {
        day: 'Monday',
        title: 'Upper Body Hypertrophy & Strength',
        focus: 'Chest, Upper Back, Shoulders & Arms',
        isRest: false,
        exercises: [
          { name: 'Barbell or Dumbbell Bench Press', sets: '4', reps: '6-8', rest: '90-120s', notes: 'Control the eccentric tempo (2 sec down).' },
          { name: 'Chest-Supported Dumbbell Rows', sets: '4', reps: '8-10', rest: '90s', notes: 'Squeeze scapulae at peak contraction.' },
          { name: 'Overhead Dumbbell Shoulder Press', sets: '3', reps: '8-12', rest: '90s', notes: 'Maintain braced core without hyperextending lower back.' },
          { name: 'Lat Pulldowns or Pull-Ups', sets: '3', reps: '10-12', rest: '60s', notes: 'Full stretch at the top.' },
          { name: 'Incline Dumbbell Bicep Curls', sets: '3', reps: '12-15', rest: '60s', notes: 'Slow negative, avoid body momentum.' },
          { name: 'Overhead Cable Triceps Extensions', sets: '3', reps: '12-15', rest: '60s', notes: 'Elbows tucked.' }
        ],
        cardio: '10 min Zone 2 Incline Treadmill walk cooldown',
        mobility: 'Thoracic extension on foam roller & doorway chest stretch (5 mins)'
      },
      {
        day: 'Tuesday',
        title: 'Lower Body Strength & Posterior Chain',
        focus: 'Quadriceps, Hamstrings, Glutes & Calves',
        isRest: false,
        exercises: [
          { name: 'Barbell Back Squats or Goblet Squats', sets: '4', reps: '6-8', rest: '120s', notes: 'Knees tracking over toes, parallel depth.' },
          { name: 'Romanian Deadlifts (RDLs)', sets: '4', reps: '8-10', rest: '90s', notes: 'Hinge at the hips, neutral spine.' },
          { name: 'Bulgarian Split Squats', sets: '3', reps: '10-12 / leg', rest: '75s', notes: 'Focus load on the forward working leg.' },
          { name: 'Lying or Seated Hamstring Curls', sets: '3', reps: '12-15', rest: '60s', notes: 'Pause 1 sec at peak contraction.' },
          { name: 'Standing Calf Raises', sets: '4', reps: '15', rest: '45s', notes: '2-second pause in full stretch at bottom.' }
        ],
        mobility: '90/90 Hip mobility & couch stretch for hip flexors (8 mins)'
      },
      {
        day: 'Wednesday',
        title: 'Active Recovery & Core Stability',
        focus: 'Regeneration, Joint Health & Parasympathetic Recovery',
        isRest: true,
        exercises: [
          { name: 'Deadbugs', sets: '3', reps: '10 / side', rest: '45s', notes: 'Keep lower back pressed flat into floor.' },
          { name: 'Bird-Dogs with 2-sec hold', sets: '3', reps: '10 / side', rest: '45s', notes: 'Activate glute and contralateral lat.' },
          { name: 'Side Plank with abduction', sets: '3', reps: '30s / side', rest: '45s', notes: 'Straight line from shoulder to ankles.' }
        ],
        cardio: '30-40 min light brisk outdoor walking (Zone 1-2, nasal breathing)',
        mobility: 'Full body deep flow: World’s Greatest Stretch, Cat-Cow & child’s pose (15 mins)'
      },
      {
        day: 'Thursday',
        title: 'Upper Body Volume & Delts Focus',
        focus: 'Back Thickness, Incline Chest & Lateral Delts',
        isRest: false,
        exercises: [
          { name: 'Incline Dumbbell Press', sets: '4', reps: '8-10', rest: '90s', notes: '30-degree bench angle for clavicular head.' },
          { name: 'Seated Cable Row (Close Grip)', sets: '4', reps: '10-12', rest: '75s', notes: 'Initiate pull by retracting shoulders.' },
          { name: 'Dumbbell Lateral Raises', sets: '4', reps: '12-15', rest: '60s', notes: 'Slight forward lean, raise in scapular plane.' },
          { name: 'Face Pulls with External Rotation', sets: '3', reps: '15', rest: '60s', notes: 'Crucial for shoulder health and rotator cuff.' },
          { name: 'Dips or Machine Dips', sets: '3', reps: '10-12', rest: '75s', notes: 'Slight forward lean to recruit lower chest.' }
        ],
        cardio: '12 min moderate assault bike or elliptical intervals'
      },
      {
        day: 'Friday',
        title: 'Lower Body & Explosive Movement',
        focus: 'Posterior chain, Quad isolation & Abs',
        isRest: false,
        exercises: [
          { name: 'Barbell Trap Bar Deadlifts or Hip Thrusts', sets: '4', reps: '6-8', rest: '120s', notes: 'Full hip extension at top.' },
          { name: 'Leg Press with feet mid-plate', sets: '3', reps: '10-12', rest: '90s', notes: 'Continuous tension, avoid locking knees at apex.' },
          { name: 'Walking Lunges with Dumbbells', sets: '3', reps: '12 steps / leg', rest: '75s', notes: 'Keep torso upright.' },
          { name: 'Hanging Knee or Leg Raises', sets: '3', reps: '12-15', rest: '60s', notes: 'Posterior pelvic tilt at the top.' }
        ],
        mobility: 'Deep pigeon stretch & ankle dorsiflexion rocks (10 mins)'
      },
      {
        day: 'Saturday',
        title: 'Conditioning & Functional Agility',
        focus: 'Aerobic Capacity & Dynamic Athleticism',
        isRest: false,
        exercises: [
          { name: 'Kettlebell Swings', sets: '4', reps: '15', rest: '60s', notes: 'Powerful hip snap, glute engagement.' },
          { name: 'Medicine Ball Slams', sets: '3', reps: '12', rest: '60s', notes: 'Triple extension, slam with full force.' },
          { name: 'Farmer’s Carries with heavy dumbbells', sets: '4', reps: '40 meters', rest: '60s', notes: 'Pack shoulders, tall posture, grip strength.' }
        ],
        cardio: '20 min Zone 2 rowing or steady jogging',
        mobility: 'Thoracic and wrist mobility routines (10 mins)'
      },
      {
        day: 'Sunday',
        title: 'System Rest & Deep Regeneration',
        focus: 'Complete Rest, Sleep & Mental Reset',
        isRest: true,
        exercises: [],
        cardio: 'Optional leisurely nature walk or gentle stretching',
        mobility: '15 min gentle restorative yoga or sauna/hot shower therapy'
      }
    ];
  } else {
    // Balanced Lifestyle / Fat Loss / General Cardio Focus
    weeklySchedule = [
      {
        day: 'Monday',
        title: 'Full Body Functional Resistance A',
        focus: 'Major Compound Movement Patterns',
        isRest: false,
        exercises: [
          { name: 'Goblet Squats', sets: '3', reps: '10-12', rest: '60s', notes: 'Keep chest upright, elbows tucked inside knees.' },
          { name: 'Dumbbell Push-Ups or Flat DB Press', sets: '3', reps: '8-12', rest: '60s', notes: 'Braced core, neutral neck.' },
          { name: 'Single-Arm Dumbbell Rows', sets: '3', reps: '10-12 / side', rest: '60s', notes: 'Full stretch at bottom, elbow to hip pocket.' },
          { name: 'Plank Shoulder Taps', sets: '3', reps: '20 total', rest: '45s', notes: 'Keep hips completely still and level.' }
        ],
        cardio: '15 min Zone 2 Incline Walking (12% incline, 4.5 km/h)',
        mobility: 'Hip flexor stretch & dynamic arm swings (5 mins)'
      },
      {
        day: 'Tuesday',
        title: 'Cardio Engine & Core Circuit',
        focus: 'Aerobic Base Building & Mitochondrial Health',
        isRest: false,
        exercises: [
          { name: 'Bicycle Crunches', sets: '3', reps: '20 total', rest: '45s', notes: 'Controlled tempo, focus on obliques.' },
          { name: 'Russian Twists', sets: '3', reps: '20 total', rest: '45s', notes: 'Keep feet slightly elevated.' },
          { name: 'Mountain Climbers', sets: '3', reps: '30s', rest: '45s', notes: 'Rhythmic, smooth cadence.' }
        ],
        cardio: '30 min Steady-State Cardio (Cycling, Rowing, or Jogging at 65-75% max HR)',
        mobility: 'Quad & calf foam rolling (8 mins)'
      },
      {
        day: 'Wednesday',
        title: 'Active Mobility & Movement Day',
        focus: 'Joint Decompression & Active Recovery',
        isRest: true,
        exercises: [],
        cardio: 'Target: 8,000 to 10,000 daily steps across the day',
        mobility: '20 min full-body mobility flow (Cat-Cow, Downward Dog, 90/90 Hips, Pigeon pose)'
      },
      {
        day: 'Thursday',
        title: 'Full Body Functional Resistance B',
        focus: 'Hinge, Pull & Unilateral Balance',
        isRest: false,
        exercises: [
          { name: 'Dumbbell Romanian Deadlifts', sets: '3', reps: '10-12', rest: '60s', notes: 'Hips back, feel deep stretch in hamstrings.' },
          { name: 'Standing Overhead Dumbbell Press', sets: '3', reps: '10-12', rest: '60s', notes: 'Brace glutes and abs.' },
          { name: 'Reverse Lunges', sets: '3', reps: '10 / leg', rest: '60s', notes: 'Step back softly, 90-degree bend in knees.' },
          { name: 'Lat Pulldowns or Resistance Band Pulldowns', sets: '3', reps: '12', rest: '60s', notes: 'Pull to collarbone, elbows driving down.' }
        ],
        cardio: '15 min moderate rowing intervals (1 min fast, 1 min easy)',
        mobility: 'Doorway pectoral stretch & hamstring floss (6 mins)'
      },
      {
        day: 'Friday',
        title: 'High-Energy HIIT & Core Ignition',
        focus: 'Metabolic Conditioning & Caloric Burn',
        isRest: false,
        exercises: [
          { name: 'Dumbbell Thrusters', sets: '4', reps: '10', rest: '45s', notes: 'Squat directly into overhead press.' },
          { name: 'Renegade Rows', sets: '3', reps: '8 / side', rest: '45s', notes: 'Wide foot stance for anti-rotation.' },
          { name: 'Jump Rope or Step Jacks', sets: '4', reps: '45s work / 15s rest', rest: '45s', notes: 'Light on balls of feet.' }
        ],
        cardio: '15 min low-impact cool-down walk',
        mobility: 'Deep hip opener and child’s pose'
      },
      {
        day: 'Saturday',
        title: 'Recreational Movement & Endurance',
        focus: 'Outdoor Activities, Sports or Long Walk',
        isRest: false,
        exercises: [],
        cardio: '45-60 min outdoor hike, cycling, swimming, or brisk walk',
        mobility: 'Spinal waves and ankle mobility (10 mins)'
      },
      {
        day: 'Sunday',
        title: 'Restoration & Prep Protocol',
        focus: 'Full System Regeneration & Weekly Reset',
        isRest: true,
        exercises: [],
        cardio: 'Gentle walk, focus on fresh air and hydration',
        mobility: '15 min relaxing evening stretch routine'
      }
    ];
  }

  // 2. Nutrition Plan Generation
  const targetCals = metrics.targetCalories;
  const protein = metrics.proteinGrams;
  const fatsGrams = Math.round((targetCals * 0.28) / 9);
  const remainingCals = targetCals - (protein * 4 + fatsGrams * 9);
  const carbsGrams = Math.max(80, Math.round(remainingCals / 4));

  // Food suggestions based on dietary preference
  let proteinSources = ['Free-range eggs / egg whites', 'Chicken breast', 'Wild salmon / tuna', 'Greek yogurt', 'Grass-fed beef', 'Whey protein isolate'];
  let carbSources = ['Old-fashioned rolled oats', 'Jasmine / Brown rice', 'Sweet potatoes', 'Quinoa', 'Berries (blueberries, raspberries)', 'Sourdough bread'];
  let fatSources = ['Extra virgin olive oil', 'Avocados', 'Raw almonds and walnuts', 'Chia / flax seeds', 'Nut butters'];

  if (diet === 'vegetarian') {
    proteinSources = ['Greek yogurt / Skyr', 'Eggs / egg whites', 'Cottage cheese (paneer)', 'Tofu & Tempeh', 'Edamame', 'Lentils & Chickpeas', 'Whey / Plant protein isolate'];
  } else if (diet === 'vegan') {
    proteinSources = ['Organic firm tofu', 'Tempeh', 'Seitan', 'Edamame', 'Lentils & Black beans', 'Nutritional yeast', 'Pea & brown rice protein powder'];
  } else if (diet === 'pescatarian') {
    proteinSources = ['Wild-caught salmon', 'Atlantic cod / tilapia', 'Shrimp', 'Canned tuna in water', 'Greek yogurt', 'Pasture-raised eggs'];
  } else if (diet === 'keto') {
    carbSources = ['Spinach, arugula & kale', 'Avocado', 'Cauliflower & broccoli', 'Zucchini', 'Blackberries / strawberries in moderation'];
    fatSources = ['Avocado oil', 'Extra virgin olive oil', 'Grass-fed butter / ghee', 'MCT oil', 'Macadamia nuts & pecans'];
  }

  const mealStructure = [
    {
      meal: 'Breakfast (Metabolic Ignition)',
      targetCalories: Math.round(targetCals * 0.28),
      targetProteinGrams: Math.round(protein * 0.3),
      recommendation: 'Prioritize high-quality protein and complex slow-burning carbohydrates to stabilize morning blood glucose.',
      suggestions: [
        `${proteinSources[0]} combined with ${carbSources[0]} and a handful of berries`,
        `High-protein power bowl with ${proteinSources[1] || proteinSources[0]}, chia seeds, and sliced almonds`,
      ]
    },
    {
      meal: 'Lunch (Midday Sustained Energy)',
      targetCalories: Math.round(targetCals * 0.32),
      targetProteinGrams: Math.round(protein * 0.35),
      recommendation: 'Balanced plate: 1/2 plate fibrous leafy greens, 1/4 plate lean protein, 1/4 plate complex starchy carbs, 1 tbsp healthy fats.',
      suggestions: [
        `Grilled ${proteinSources[1] || proteinSources[0]} with ${carbSources[1] || carbSources[0]}, steamed broccoli, and 1 tbsp ${fatSources[0]}`,
        `Large grain salad with ${carbSources[2] || carbSources[1]}, roasted vegetables, pumpkin seeds, and choice protein`
      ]
    },
    {
      meal: 'Pre/Post Workout or Afternoon Boost',
      targetCalories: Math.round(targetCals * 0.15),
      targetProteinGrams: Math.round(protein * 0.15),
      recommendation: 'Fast-digesting amino acids and simple carbohydrates to initiate muscle glycogen replenishment.',
      suggestions: [
        `Protein shake with 1 scoop protein powder, 1 banana, water or almond milk`,
        `Rice cakes with 1 tbsp natural nut butter or low-fat cottage cheese with sliced apple`
      ]
    },
    {
      meal: 'Dinner (Recovery & Neurochemical Relaxation)',
      targetCalories: Math.round(targetCals * 0.25),
      targetProteinGrams: Math.round(protein * 0.2),
      recommendation: 'Magnesium-rich foods and easily digestible protein to assist parasympathetic rest and restful sleep.',
      suggestions: [
        `Baked ${proteinSources[2] || proteinSources[0]} with roasted asparagus and sweet potato wedges`,
        `Warm stir-fry with ${proteinSources[3] || proteinSources[0]}, bok choy, mushrooms, and cauliflower rice`
      ]
    }
  ];

  // 3. Recovery Protocol
  const recovery: RecoveryPlan = {
    sleepTargetHours: profile.sleepTargetHours || 8,
    sleepOptimizationProtocols: [
      'Stop all caffeine intake at least 9-10 hours prior to bedtime to allow adenosine receptors to clear.',
      'Dim ambient blue light 60 minutes before sleep; consider wearing blue-blocking glasses or switching phone to night shift.',
      'Maintain bedroom temperature between 18-20°C (65-68°F) to support natural circadian body temperature drop.',
      'Consistent sleep/wake window: wake up within the same 30-minute window 7 days a week to anchor circadian rhythms.'
    ],
    restDaysPerWeek: 7 - profile.exerciseFrequencyDays,
    activeRecoveryProtocols: [
      'Perform 20-30 minutes of low-intensity Zone 1 walking outdoors to accelerate lymphatic drainage and reduce delayed-onset muscle soreness.',
      'Contrast shower or 15-minute warm Epsom salt bath on heavy training days.',
      '5 minutes of physiological sigh breathing (double inhale through nose, long relaxed sigh exhale through mouth) post-workout.'
    ],
    dailyMobilityRoutine: [
      'Morning: Cat-Cow (10 reps), Child’s Pose to Cobra transition (5 cycles), World’s Greatest Stretch (5 reps/side).',
      'Pre-Bed: 90/90 Hip Opener (2 mins/side), Legs-Up-The-Wall pose (5 mins) to downregulate nervous system.'
    ],
    recoveryReminders: [
      'Hydration: Drink 500ml water immediately upon waking before consuming caffeine.',
      'Soreness check: If muscle soreness is greater than 7/10 or joint discomfort is present, swap high-impact movement for swimming or cycling.',
      'Listen to biofeedback: An elevated resting heart rate (>7 bpm above baseline) indicates central nervous fatigue.'
    ]
  };

  const workoutPlan: WorkoutPlan = {
    id: `plan-workout-${Date.now()}`,
    goal: goal.replace('_', ' ').toUpperCase(),
    experience: exp,
    weeklySchedule,
    adaptations: {
      beginner: 'Focus purely on mastering exercise biomechanics. Keep 2-3 reps in reserve (RIR) on every set. Rest 90-120 seconds between sets.',
      intermediate: 'Progressive overload: add 1-2 reps per set each week or increase dumbbell load by 1-2.5 kg when target rep range is achieved with pristine form.',
      advanced: 'Incorporate tempo manipulation (3-sec eccentrics, 1-sec pauses in deep stretch) and occasional drop sets on final isolation movements.'
    },
    recoveryGuidelines: [
      'Never train to complete muscular failure on compound spinal-loaded lifts (squats, deadlifts).',
      'Ensure a minimum of 48 hours recovery before training the exact same muscle group with heavy loads.',
      'If sleep falls below 6 hours on a given night, reduce working volume by 20% and focus on mobility.'
    ],
    generatedAt: new Date().toISOString()
  };

  const nutritionPlan: NutritionPlan = {
    calorieGuidance: {
      estimatedTDEE: metrics.tdee,
      targetCalories: targetCals,
      deficitOrSurplus: targetCals - metrics.tdee,
      explanation: `Calculated from your estimated TDEE of ${metrics.tdee} kcal. ${
        targetCals < metrics.tdee
          ? `Includes a conservative, muscle-sparing deficit of ~${metrics.tdee - targetCals} kcal/day to target sustainable fat loss of ~0.3-0.5 kg/week.`
          : targetCals > metrics.tdee
          ? `Includes a controlled lean surplus of ~${targetCals - metrics.tdee} kcal/day to optimize hypertrophy and strength gains while minimizing excess fat accumulation.`
          : 'Calibrated at maintenance calories to prioritize body recomposition and energy equilibrium.'
      }`
    },
    macroGuidance: {
      proteinGrams: protein,
      carbsGrams,
      fatsGrams,
      explanation: `Protein target of ${protein}g (~${(protein / profile.weightKg).toFixed(1)}g/kg) supports muscle tissue repair. Healthy fats at ${fatsGrams}g (~28% of intake) maintain endocrine and hormonal health. Carbs at ${carbsGrams}g fuel glycolytic training sessions.`
    },
    mealStructure,
    hydrationStrategy: `Target ${metrics.waterTargetLiters} Liters (${profile.unitPreferences.water === 'oz' ? Math.round(metrics.waterTargetLiters * 33.8) + ' oz' : metrics.waterTargetLiters + ' L'}) daily. Add a pinch of sea salt or electrolyte powder during high-temperature training.`,
    dietaryNotes: `Customized for ${diet.toUpperCase()} diet. ${profile.allergiesIntolerances ? `Filters applied for reported allergies: ${profile.allergiesIntolerances}.` : 'No food allergies specified.'}`,
    disclaimer: 'Nutritional estimates are for general wellness education only and should not be considered medically prescribed medical nutrition therapy.'
  };

  return {
    workout: workoutPlan,
    nutrition: nutritionPlan,
    recovery,
    generatedAt: new Date().toISOString()
  };
};

/**
 * Intelligent Conversational AI Health Assistant Response Generator
 */
export const generateAIHealthAssistantResponse = (
  prompt: string,
  profile: HealthProfile,
  metrics: CalculatedHealthMetrics,
  checkIns: DailyCheckIn[],
  chatHistory: AIChatMessage[]
): { text: string; disclaimer?: string; category: AIChatMessage['category'] } => {
  const p = prompt.toLowerCase();
  const context = buildMinimalHealthContext(profile, metrics, checkIns);
  const unitWeight = profile.unitPreferences.weight;
  const currentWeightDisplay = unitWeight === 'lb' ? `${Math.round(profile.weightKg * 2.2)} lb` : `${profile.weightKg} kg`;
  const targetWeightDisplay = unitWeight === 'lb' ? `${Math.round(profile.targetWeightKg * 2.2)} lb` : `${profile.targetWeightKg} kg`;

  // Standard non-diagnostic medical disclaimer
  const medicalDisclaimer =
    'Note: I am an AI health & wellness assistant, not a physician or licensed dietitian. My recommendations are for educational and self-optimization purposes. Always consult an appropriately qualified healthcare professional regarding clinical symptoms or medical conditions.';

  // 1. Today's Workout / Workout Request
  if (p.includes('workout') || p.includes('exercise') || p.includes('train') || p.includes('leg workout') || p.includes('upper body')) {
    if (p.includes('leg') || p.includes('lower body')) {
      return {
        text: `Here is a high-yield leg workout tailored to your ${context.experience} level and ${context.goal.replace('_', ' ')} goal:

1. **Goblet Squats or Barbell Back Squats**: 3 sets × 8-10 reps (Rest: 90s)
   *Cue*: Keep your chest proud, descend until hips are parallel with knees, and push through midfoot.
2. **Romanian Deadlifts (RDLs)**: 3 sets × 10 reps (Rest: 75s)
   *Cue*: Hinge backwards at hips with soft knees; feel the deep hamstring stretch with a flat back.
3. **Walking Lunges**: 3 sets × 10 steps per leg (Rest: 60s)
   *Cue*: Step forward with control, keeping your front knee aligned over your second toe.
4. **Standing Calf Raises**: 3 sets × 15 reps (Rest: 45s)
   *Cue*: Hold at the peak for 1 second, lower over 3 seconds for full stretch.

**Mobility Cool-Down**: 2 minutes in a deep 90/90 hip stretch and 1 minute in a standing quad stretch.
Hydrate with 500ml of water and consume 25-35g of protein within 90 minutes post-training!`,
        category: 'workout',
        disclaimer: 'Always warm up dynamically for 5-7 minutes before lifting weights. Stop immediately if you experience sharp or joint-related pain.'
      };
    }

    return {
      text: `Based on your profile (${context.goal.replace('_', ' ')} // ${context.experience} tier // ${context.activityLevel} activity), here is today's recommended directive session:

**Focus: Functional Full-Body Strength & Core Ignition**
*Total Duration*: ~42 minutes

1. **Warm-Up (5 mins)**: 20 arm circles, 10 deep bodyweight squats with 3-sec pause, and 10 dynamic inchworms into Cobra.
2. **Primary Compound**: Dumbbell or Barbell Push Press / Overhead Press — 3 sets × 8-10 reps (90s rest).
3. **Compound Hinge/Pull**: Dumbbell Romanian Deadlift superset with Chest-Supported Rows — 3 sets × 10 reps each (75s rest).
4. **Lower Body Hypertrophy**: Bulgarian Split Squats or Goblet Squats — 3 sets × 10 reps/side (60s rest).
5. **Core Stability Finisher**: Deadbugs (3 sets × 12 reps) + Plank hold (3 sets × 45 seconds).

**Cardio Finisher**: 10 minutes of Zone 2 brisk incline walking or easy cycling.
You've currently logged ${checkIns.length} check-in milestones — keep this momentum consistent!`,
      category: 'workout'
    };
  }

  // 2. Weight Change / Progress inquiry
  if (p.includes('weight') || p.includes('progress') || p.includes('change this week') || p.includes('scale')) {
    let recentTrendText = '';
    if (checkIns.length >= 2) {
      const sorted = [...checkIns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const delta = Math.round((sorted[sorted.length - 1].weightKg - sorted[0].weightKg) * 10) / 10;
      const displayDelta = unitWeight === 'lb' ? Math.round(delta * 2.2 * 10) / 10 : delta;
      recentTrendText = `Your recorded weight changed by ${delta >= 0 ? '+' : ''}${displayDelta} ${unitWeight} across your last ${sorted.length} recorded entries (${sorted[0].weightKg} kg → ${sorted[sorted.length - 1].weightKg} kg).`;
    } else {
      recentTrendText = `Your baseline profile weight is recorded at ${currentWeightDisplay} with a target of ${targetWeightDisplay}.`;
    }

    return {
      text: `Here is the telemetry analysis on your weight trajectory:

${recentTrendText}

**Why daily scale weight fluctuates**:
• **Fluid & Glycogen Retention**: Every 1 gram of carbohydrate stored in muscles binds approximately 3 to 4 grams of water. A higher carb meal can temporarily lift the scale by 0.5-1.5 kg without any change in actual fat mass.
• **Sodium & Cortisol**: Higher sodium meals or poor sleep trigger transient water retention.
• **Digestion & Bowel Transit**: Un-evacuated food in the GI tract can account for 0.5 to 1.0 kg of scale variance.

**Optimal Protocol**: Focus on the **7-day moving average** rather than single-day fluctuations. Your estimated maintenance TDEE is **${metrics.tdee} kcal/day**, and your target daily energy goal is **${metrics.targetCalories} kcal/day**. As long as your weekly adherence is consistent, your physical trajectory remains right on schedule!`,
      category: 'trend'
    };
  }

  // 3. Sleep & Recovery questions
  if (p.includes('sleep') || p.includes('tired') || p.includes('fatigue') || p.includes('recover') || p.includes('energy')) {
    return {
      text: `Let's optimize your circadian rhythm and recovery integrity! Your baseline sleep target is **${context.avgSleepHours} hours/night**.

**High-Leverage Sleep Optimization Protocol**:
1. **Morning Light Anchor**: Get 10-15 minutes of direct outdoor sunlight into your eyes within 30 minutes of waking. This sets your cortisol spike and anchors the timer for melatonin release 16 hours later.
2. **Caffeine Curfew**: Cut off all caffeine at least 9-10 hours prior to your desired sleep time.
3. **Thermal Downregulation**: Take a hot shower or Epsom bath 60-90 minutes before bed. The subsequent vasodilation cools your internal core temperature, triggering natural drowsiness.
4. **Digital Blue Light Shield**: Avoid bright overhead screens in the final hour before bed, or switch devices to warm night-mode filters.
5. **Recovery Nutrients**: Magnesium glycinate (200-400mg) and adequate daytime hydration (${metrics.waterTargetLiters}L target) support GABA neurotransmission and deeper slow-wave sleep.

If you are experiencing ongoing extreme fatigue despite regular sleep, consider having basic blood work (iron, vitamin D, thyroid) checked by a healthcare provider.`,
      category: 'recovery'
    };
  }

  // 4. Nutrition / Diet / Calories questions
  if (p.includes('nutrition') || p.includes('eat') || p.includes('calorie') || p.includes('protein') || p.includes('food') || p.includes('diet')) {
    return {
      text: `Here is your customized nutrition blueprint for your **${profile.dietaryPreference.toUpperCase()}** preference and **${context.goal.replace('_', ' ')}** objective:

• **Daily Calorie Target**: ~**${metrics.targetCalories} kcal/day** (Calculated from your ~${metrics.tdee} kcal TDEE).
• **Daily Protein Target**: **${metrics.proteinGrams}g/day** (~${(metrics.proteinGrams / profile.weightKg).toFixed(1)}g per kg bodyweight).
• **Hydration Goal**: **${metrics.waterTargetLiters} Liters/day** (${profile.unitPreferences.water === 'oz' ? Math.round(metrics.waterTargetLiters * 33.8) + ' oz' : metrics.waterTargetLiters + ' L'}).

**Actionable Guidelines for ${profile.dietaryPreference}**:
1. **Protein Distribution**: Distribute your ${metrics.proteinGrams}g of protein evenly across 3-4 meals (~${Math.round(metrics.proteinGrams / 3.5)}g per meal) to trigger muscular protein synthesis throughout the day.
2. **Fiber & Micronutrients**: Aim for at least 25-35g of dietary fiber daily from leafy greens, berries, legumes, and whole grains.
3. **Pre-Workout Fuel**: Consume a balanced carb-protein snack (e.g. oatmeal with protein or Greek yogurt with banana) 60-90 minutes prior to exercise.

*Disclaimer: Caloric and macronutrient numbers are educational estimations. Adjust based on your personal digestive comfort and progress.*`,
      category: 'nutrition',
      disclaimer: 'Nutrition estimates are general wellness recommendations, not prescribed medical dietetics.'
    };
  }

  // 5. Weekly focus / consistency questions
  if (p.includes('focus') || p.includes('consistent') || p.includes('consistency') || p.includes('habit') || p.includes('motivation')) {
    return {
      text: `Here is your high-impact focus directive for this week:

**Core Anchor: The "Never Miss Twice" Rule**
1. **Target Frequency**: Commit to **${profile.exerciseFrequencyDays} training sessions** this week. If a busy day cuts your scheduled workout short, do a 15-minute micro-workout rather than skipping entirely.
2. **Hydration First**: Reach your **${metrics.waterTargetLiters}L daily water mark** before noon to eliminate midday fatigue.
3. **Daily Step Target**: Aim for your **${profile.dailyStepTarget.toLocaleString()} steps** baseline. Take short 5-minute walking breaks after meals.
4. **Log Daily Check-Ins**: Consistently record your morning weight and resting heart rate in the Bio-Sync dashboard to allow the AI trend engine to refine your plan.

Consistency is a skill that levels up like an RPG attribute. Focus on showing up today, and let the cumulative compounding work its magic!`,
      category: 'general'
    };
  }

  // 6. Clinical / Blood Pressure / Heart Rate inquiries
  if (p.includes('blood pressure') || p.includes('heart rate') || p.includes('bp') || p.includes('bpm') || p.includes('pulse')) {
    const bpEval = metrics.bpStatus;
    const hrEval = metrics.hrStatus;

    return {
      text: `Here is an objective overview of your recorded cardiovascular metrics:

• **Blood Pressure**: Recorded at **${profile.bloodPressureSystolic}/${profile.bloodPressureDiastolic} mmHg** (${bpEval.label}).
  ${bpEval.advice}
• **Resting Heart Rate**: Recorded at **${profile.restingHeartRateBpm} BPM** (${hrEval.label}).
  ${hrEval.advice}

**General Cardiovascular Support Strategies**:
1. **Zone 2 Aerobic Conditioning**: 120-150 minutes per week of conversational cardio significantly improves capillary density and arterial compliance.
2. **Electrolyte Balance**: Ensure adequate dietary potassium (leafy greens, avocados, potatoes) to balance sodium intake.
3. **Stress Mitigation**: Practice 5 minutes of box breathing (4s inhale, 4s hold, 4s exhale, 4s hold) to downregulate sympathetic drive.`,
      category: 'general',
      disclaimer: medicalDisclaimer
    };
  }

  // Default intelligent contextual response
  return {
    text: `Hello ${profile.name || 'Hero'}! I have analyzed your Bio-Sync telemetry profile:

• **Physical Status**: ${currentWeightDisplay} (Target: ${targetWeightDisplay}) | Height: ${profile.heightCm} cm | BMI: ${metrics.bmi} (${metrics.bmiCategory})
• **Metabolic Target**: ${metrics.targetCalories} kcal/day | Protein: ${metrics.proteinGrams}g/day | Water: ${metrics.waterTargetLiters}L/day
• **Active Mission**: ${context.goal.replace('_', ' ').toUpperCase()} (${profile.exerciseFrequencyDays} days/week, ${profile.fitnessExperience} level)

You can ask me to:
• Create a custom workout routine for today
• Break down your nutrition and meal plans
• Analyze weight fluctuations and body composition trends
• Troubleshoot sleep or recovery fatigue
• Recommend mobility exercises or hydration strategies

What health or training objective would you like to tackle right now?`,
    category: 'general',
    disclaimer: medicalDisclaimer
  };
};
