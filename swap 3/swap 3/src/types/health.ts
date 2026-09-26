export type SexType = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type FitnessExperience = 'beginner' | 'intermediate' | 'advanced';

export type FitnessGoal =
  | 'lose_weight'
  | 'build_muscle'
  | 'improve_cardio'
  | 'increase_strength'
  | 'improve_consistency'
  | 'boost_energy'
  | 'healthy_lifestyle';

export type DietaryPreference =
  | 'omnivore'
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'keto'
  | 'paleo'
  | 'mediterranean'
  | 'low_carb'
  | 'halal'
  | 'kosher';

export type MoodType = 'great' | 'good' | 'neutral' | 'tired' | 'stressed';

export interface UnitPreferences {
  height: 'cm' | 'ft_in';
  weight: 'kg' | 'lb';
  water: 'L' | 'oz';
  waist: 'cm' | 'in';
}

export interface HealthProfile {
  id: string;
  name: string;
  age: number;
  sex: SexType;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  restingHeartRateBpm: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bodyFatPercentage?: number;
  waistCm?: number;
  activityLevel: ActivityLevel;
  dailyStepTarget: number;
  sleepTargetHours: number;
  waterTargetLiters: number;
  fitnessExperience: FitnessExperience;
  exerciseFrequencyDays: number;
  currentFitnessGoal: FitnessGoal;
  dietaryPreference: DietaryPreference;
  allergiesIntolerances: string;
  medicalConsiderations: string;
  updatedAt: string;
  unitPreferences: UnitPreferences;
}

export interface DailyCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  restingHeartRateBpm?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  sleepHours: number;
  steps: number;
  waterLiters: number;
  workoutCompleted: boolean;
  workoutDetails?: string;
  energyLevel: number; // 1-10
  mood: MoodType;
  notes: string;
  timestamp: string;
}

export type HealthGoalCategory =
  | 'weight'
  | 'muscle'
  | 'cardio'
  | 'strength'
  | 'consistency'
  | 'steps'
  | 'sleep'
  | 'hydration';

export interface HealthGoal {
  id: string;
  category: HealthGoalCategory;
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline?: string;
  completed: boolean;
  createdAt: string;
}

export interface ExerciseItem {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes?: string;
}

export interface WorkoutDaySchedule {
  day: string;
  title: string;
  focus: string;
  isRest: boolean;
  exercises: ExerciseItem[];
  cardio?: string;
  mobility?: string;
}

export interface WorkoutPlan {
  id: string;
  goal: string;
  experience: FitnessExperience;
  weeklySchedule: WorkoutDaySchedule[];
  adaptations: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  recoveryGuidelines: string[];
  generatedAt: string;
}

export interface MealOption {
  meal: string;
  targetCalories: number;
  targetProteinGrams: number;
  recommendation: string;
  suggestions: string[];
}

export interface NutritionPlan {
  calorieGuidance: {
    estimatedTDEE: number;
    targetCalories: number;
    deficitOrSurplus: number;
    explanation: string;
  };
  macroGuidance: {
    proteinGrams: number;
    carbsGrams: number;
    fatsGrams: number;
    explanation: string;
  };
  mealStructure: MealOption[];
  hydrationStrategy: string;
  dietaryNotes: string;
  disclaimer: string;
}

export interface RecoveryPlan {
  sleepTargetHours: number;
  sleepOptimizationProtocols: string[];
  restDaysPerWeek: number;
  activeRecoveryProtocols: string[];
  dailyMobilityRoutine: string[];
  recoveryReminders: string[];
}

export interface PersonalizedPlan {
  workout: WorkoutPlan;
  nutrition: NutritionPlan;
  recovery: RecoveryPlan;
  generatedAt: string;
}

export type InsightCategory = 'recorded' | 'calculated' | 'ai_suggestion' | 'medical_notice';

export interface AIInsightItem {
  id: string;
  category: InsightCategory;
  title: string;
  message: string;
  metricReference?: string;
  type: 'positive' | 'neutral' | 'caution' | 'tip';
  timestamp: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  category?: 'workout' | 'nutrition' | 'recovery' | 'trend' | 'general';
  disclaimer?: string;
}

export interface CalculatedHealthMetrics {
  bmi: number;
  bmiCategory: string;
  bmiColor: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  waterTargetLiters: number;
  bpStatus: {
    label: string;
    level: 'normal' | 'elevated' | 'stage1' | 'stage2' | 'crisis' | 'low';
    color: string;
    advice: string;
    isConcerning: boolean;
  };
  hrStatus: {
    label: string;
    level: 'normal' | 'athlete' | 'elevated' | 'low';
    color: string;
    advice: string;
    isConcerning: boolean;
  };
}
