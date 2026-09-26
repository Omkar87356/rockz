import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  HealthProfile,
  DailyCheckIn,
  HealthGoal,
  PersonalizedPlan,
  AIInsightItem,
  AIChatMessage,
  CalculatedHealthMetrics,
  UnitPreferences,
} from '../types/health';
import {
  computeAllHealthMetrics,
  generateHealthInsights,
  validateHealthProfile,
  validateDailyCheckIn,
} from '../utils/healthCalculations';
import {
  generatePersonalizedDevelopmentPlan,
  generateAIHealthAssistantResponse,
} from '../services/aiHealthService';

export type HealthTabType = 'dashboard' | 'plan' | 'goals' | 'chat' | 'checkins';

interface HealthContextType {
  profile: HealthProfile;
  checkIns: DailyCheckIn[];
  goals: HealthGoal[];
  plan: PersonalizedPlan;
  insights: AIInsightItem[];
  chatMessages: AIChatMessage[];
  metrics: CalculatedHealthMetrics;
  unitPreferences: UnitPreferences;
  activeHealthTab: HealthTabType;
  setActiveHealthTab: (tab: HealthTabType) => void;
  // Modals
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isCheckInModalOpen: boolean;
  setIsCheckInModalOpen: (open: boolean) => void;
  isPrivacyModalOpen: boolean;
  setIsPrivacyModalOpen: (open: boolean) => void;
  isAddGoalModalOpen: boolean;
  setIsAddGoalModalOpen: (open: boolean) => void;
  // Actions
  updateProfile: (updates: Partial<HealthProfile>) => void;
  addCheckIn: (checkIn: Omit<DailyCheckIn, 'id' | 'timestamp'>) => void;
  deleteCheckIn: (id: string) => void;
  addGoal: (goal: Omit<HealthGoal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<HealthGoal>) => void;
  deleteGoal: (id: string) => void;
  toggleGoal: (id: string) => void;
  regeneratePlan: (directive?: string) => void;
  sendChatMessage: (text: string) => void;
  clearChatHistory: () => void;
  setUnitPreferences: (prefs: Partial<UnitPreferences>) => void;
  exportHealthData: () => void;
  deleteEntireHealthProfile: () => void;
}

const STORAGE_KEY = 'habitly_health_data_v1';

// Initial realistic default data
const DEFAULT_UNITS: UnitPreferences = {
  height: 'cm',
  weight: 'kg',
  water: 'L',
  waist: 'cm',
};

const DEFAULT_PROFILE: HealthProfile = {
  id: 'usr-bio-001',
  name: 'Ren Cyberis',
  age: 26,
  sex: 'male',
  heightCm: 178,
  weightKg: 75.8,
  targetWeightKg: 72.5,
  restingHeartRateBpm: 64,
  bloodPressureSystolic: 118,
  bloodPressureDiastolic: 76,
  bodyFatPercentage: 17.5,
  waistCm: 82,
  activityLevel: 'moderate',
  dailyStepTarget: 10000,
  sleepTargetHours: 8.0,
  waterTargetLiters: 3.2,
  fitnessExperience: 'intermediate',
  exerciseFrequencyDays: 4,
  currentFitnessGoal: 'build_muscle',
  dietaryPreference: 'omnivore',
  allergiesIntolerances: 'None reported',
  medicalConsiderations: 'None reported',
  updatedAt: new Date().toISOString(),
  unitPreferences: DEFAULT_UNITS,
};

// Generates 14 realistic chronological check-ins for interactive charts
const generateInitialCheckIns = (): DailyCheckIn[] => {
  const checkIns: DailyCheckIn[] = [];
  const baseDate = new Date();

  const weightProgression = [
    77.4, 77.2, 77.0, 76.8, 76.9, 76.6, 76.5,
    76.4, 76.2, 76.3, 76.1, 76.0, 75.9, 75.8
  ];
  const heartRateList = [68, 67, 69, 66, 68, 65, 66, 64, 65, 63, 64, 65, 63, 64];
  const sleepList = [7.5, 7.8, 6.9, 8.1, 7.4, 8.2, 8.0, 7.6, 7.9, 8.3, 7.8, 8.1, 8.0, 8.2];
  const stepsList = [9400, 10250, 8800, 11200, 9900, 12400, 10800, 9600, 10500, 11800, 10100, 12100, 10900, 11450];
  const waterList = [2.8, 3.2, 2.7, 3.4, 3.0, 3.5, 3.1, 3.0, 3.3, 3.4, 3.2, 3.5, 3.3, 3.4];

  for (let i = 13; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const index = 13 - i;

    checkIns.push({
      id: `checkin-init-${index}`,
      date: dateStr,
      weightKg: weightProgression[index] || 76.0,
      restingHeartRateBpm: heartRateList[index] || 65,
      bloodPressureSystolic: 116 + (index % 4),
      bloodPressureDiastolic: 74 + (index % 3),
      sleepHours: sleepList[index] || 8.0,
      steps: stepsList[index] || 10000,
      waterLiters: waterList[index] || 3.0,
      workoutCompleted: index % 2 === 0,
      workoutDetails: index % 2 === 0 ? 'Resistance Training Session' : undefined,
      energyLevel: 8,
      mood: 'great',
      notes: index === 13 ? 'Hydrated well, crushed the morning workout.' : 'Consistent routine.',
      timestamp: d.toISOString(),
    });
  }

  return checkIns;
};

const DEFAULT_GOALS: HealthGoal[] = [
  {
    id: 'goal-weight-1',
    category: 'weight',
    title: 'Reach 72.5 kg Lean Physique',
    description: 'Target body composition with preserved muscle mass and improved metabolic rate.',
    currentValue: 75.8,
    targetValue: 72.5,
    unit: 'kg',
    deadline: '2026-11-30',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-steps-1',
    category: 'steps',
    title: '10,000 Daily Step Cadence',
    description: 'Maintain cardiovascular base and daily non-exercise physical activity.',
    currentValue: 11450,
    targetValue: 10000,
    unit: 'steps',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-sleep-1',
    category: 'sleep',
    title: '8.0 Hours Nightly Slow-Wave Sleep',
    description: 'Prioritize deep REM and growth hormone pulse for tissue recovery.',
    currentValue: 8.2,
    targetValue: 8.0,
    unit: 'hours',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goal-hydration-1',
    category: 'hydration',
    title: 'Daily 3.2L Hydration Standard',
    description: 'Hydrate with electrolytes to support cellular hydration and endurance.',
    currentValue: 3.4,
    targetValue: 3.2,
    unit: 'Liters',
    completed: true,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_CHAT_MESSAGES: AIChatMessage[] = [
  {
    id: 'msg-welcome-ai',
    sender: 'assistant',
    text: `System Telemetry Online. Greetings! I am your **BIO-AI Personal Body Development & Health Assistant**.

I have synchronized with your biological telemetry (Height: 178 cm, Current Weight: 75.8 kg, BMI: 23.9, Resting HR: 64 BPM).

Feel free to ask me to:
• **"Create a workout for today"**
• **"Why has my weight changed this week?"**
• **"How can I improve my sleep?"**
• **"Give me a beginner leg workout"**
• **"Suggest high-protein snacks for my diet"**

*Disclaimer: I provide general fitness, training, and nutritional education. I am not a physician and do not provide medical diagnoses or prescribe clinical treatments.*`,
    timestamp: new Date().toISOString(),
    category: 'general',
  },
];

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state from localStorage or use defaults
  const [profile, setProfile] = useState<HealthProfile>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_profile`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored health profile:', e);
    }
    return DEFAULT_PROFILE;
  });

  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_checkins`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored check-ins:', e);
    }
    return generateInitialCheckIns();
  });

  const [goals, setGoals] = useState<HealthGoal[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_goals`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored goals:', e);
    }
    return DEFAULT_GOALS;
  });

  const [plan, setPlan] = useState<PersonalizedPlan>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_plan`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored plan:', e);
    }
    return generatePersonalizedDevelopmentPlan(DEFAULT_PROFILE);
  });

  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_chat`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored chat:', e);
    }
    return DEFAULT_CHAT_MESSAGES;
  });

  const [activeHealthTab, setActiveHealthTab] = useState<HealthTabType>('dashboard');

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);

  // Derived metrics & insights
  const metrics = useMemo(() => computeAllHealthMetrics(profile), [profile]);
  const insights = useMemo(() => generateHealthInsights(profile, checkIns), [profile, checkIns]);

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
    } catch (e) {
      console.error('Storage write error (profile):', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_checkins`, JSON.stringify(checkIns));
    } catch (e) {
      console.error('Storage write error (checkins):', e);
    }
  }, [checkIns]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(goals));
    } catch (e) {
      console.error('Storage write error (goals):', e);
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_plan`, JSON.stringify(plan));
    } catch (e) {
      console.error('Storage write error (plan):', e);
    }
  }, [plan]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_chat`, JSON.stringify(chatMessages));
    } catch (e) {
      console.error('Storage write error (chat):', e);
    }
  }, [chatMessages]);

  // Actions
  const updateProfile = (updates: Partial<HealthProfile>) => {
    setProfile((prev) => {
      const updated: HealthProfile = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      // Regenerate plan if goal, activity, or dietary preference changed
      if (
        updates.currentFitnessGoal ||
        updates.activityLevel ||
        updates.dietaryPreference ||
        updates.weightKg ||
        updates.fitnessExperience
      ) {
        setPlan(generatePersonalizedDevelopmentPlan(updated));
      }
      return updated;
    });
  };

  const addCheckIn = (data: Omit<DailyCheckIn, 'id' | 'timestamp'>) => {
    const newEntry: DailyCheckIn = {
      ...data,
      id: `checkin-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setCheckIns((prev) => {
      // Replace existing check-in for the same date or append
      const filtered = prev.filter((c) => c.date !== data.date);
      const updated = [...filtered, newEntry].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      return updated;
    });

    // Update profile current weight and vitals if the check-in is the latest
    setProfile((prev) => ({
      ...prev,
      weightKg: data.weightKg,
      restingHeartRateBpm: data.restingHeartRateBpm || prev.restingHeartRateBpm,
      bloodPressureSystolic: data.bloodPressureSystolic || prev.bloodPressureSystolic,
      bloodPressureDiastolic: data.bloodPressureDiastolic || prev.bloodPressureDiastolic,
      updatedAt: new Date().toISOString(),
    }));

    // Auto update any weight goal
    setGoals((prev) =>
      prev.map((g) => {
        if (g.category === 'weight') {
          const completed =
            (g.targetValue <= g.currentValue && data.weightKg <= g.targetValue) ||
            (g.targetValue >= g.currentValue && data.weightKg >= g.targetValue);
          return { ...g, currentValue: data.weightKg, completed };
        }
        if (g.category === 'steps' && data.steps) {
          return { ...g, currentValue: data.steps, completed: data.steps >= g.targetValue };
        }
        if (g.category === 'sleep' && data.sleepHours) {
          return { ...g, currentValue: data.sleepHours, completed: data.sleepHours >= g.targetValue };
        }
        if (g.category === 'hydration' && data.waterLiters) {
          return { ...g, currentValue: data.waterLiters, completed: data.waterLiters >= g.targetValue };
        }
        return g;
      })
    );
  };

  const deleteCheckIn = (id: string) => {
    setCheckIns((prev) => prev.filter((c) => c.id !== id));
  };

  const addGoal = (goalData: Omit<HealthGoal, 'id' | 'createdAt'>) => {
    const newGoal: HealthGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<HealthGoal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const regeneratePlan = (directive?: string) => {
    const newPlan = generatePersonalizedDevelopmentPlan(profile, directive);
    setPlan(newPlan);
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: `usr-msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Generate intelligent AI response with context
    setTimeout(() => {
      const aiResp = generateAIHealthAssistantResponse(
        text,
        profile,
        metrics,
        checkIns,
        chatMessages
      );

      const aiMsg: AIChatMessage = {
        id: `ai-msg-${Date.now()}`,
        sender: 'assistant',
        text: aiResp.text,
        timestamp: new Date().toISOString(),
        category: aiResp.category,
        disclaimer: aiResp.disclaimer,
      };

      setChatMessages((prev) => [...prev, aiMsg]);
    }, 450);
  };

  const clearChatHistory = () => {
    setChatMessages(DEFAULT_CHAT_MESSAGES);
  };

  const setUnitPreferences = (prefs: Partial<UnitPreferences>) => {
    const updatedUnits: UnitPreferences = {
      ...profile.unitPreferences,
      ...prefs,
    };
    updateProfile({ unitPreferences: updatedUnits });
  };

  const exportHealthData = () => {
    const exportBundle = {
      appName: 'Habitly Pro OS - Bio-Sync AI Health Telemetry',
      exportedAt: new Date().toISOString(),
      profile,
      metrics,
      checkIns,
      goals,
      plan,
      insights,
    };
    const jsonStr = JSON.stringify(exportBundle, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitly_bio_telemetry_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteEntireHealthProfile = () => {
    // Clear all storage keys for full privacy compliance
    localStorage.removeItem(`${STORAGE_KEY}_profile`);
    localStorage.removeItem(`${STORAGE_KEY}_checkins`);
    localStorage.removeItem(`${STORAGE_KEY}_goals`);
    localStorage.removeItem(`${STORAGE_KEY}_plan`);
    localStorage.removeItem(`${STORAGE_KEY}_chat`);

    // Reset in-memory state
    setProfile(DEFAULT_PROFILE);
    setCheckIns(generateInitialCheckIns());
    setGoals(DEFAULT_GOALS);
    setPlan(generatePersonalizedDevelopmentPlan(DEFAULT_PROFILE));
    setChatMessages(DEFAULT_CHAT_MESSAGES);
    setIsPrivacyModalOpen(false);
  };

  return (
    <HealthContext.Provider
      value={{
        profile,
        checkIns,
        goals,
        plan,
        insights,
        chatMessages,
        metrics,
        unitPreferences: profile.unitPreferences || DEFAULT_UNITS,
        activeHealthTab,
        setActiveHealthTab,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isCheckInModalOpen,
        setIsCheckInModalOpen,
        isPrivacyModalOpen,
        setIsPrivacyModalOpen,
        isAddGoalModalOpen,
        setIsAddGoalModalOpen,
        updateProfile,
        addCheckIn,
        deleteCheckIn,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleGoal,
        regeneratePlan,
        sendChatMessage,
        clearChatHistory,
        setUnitPreferences,
        exportHealthData,
        deleteEntireHealthProfile,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
