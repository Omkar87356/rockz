export type HabitCategory = 'health' | 'productivity' | 'mindfulness' | 'fitness' | 'learning' | 'creativity';

export type HabitFrequencyType =
  | 'daily'
  | 'times_per_day'
  | 'days_per_week'
  | 'times_per_week'
  | 'days_per_month'
  | 'weekdays'
  | 'weekends'
  | 'interval';

export type HabitStatus = 'active' | 'skipped' | 'paused';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  frequencyType: HabitFrequencyType;
  frequencyCount: number; // Any amount e.g. 1, 8, 2000, 50
  frequencyUnit?: string; // e.g. 'times', 'glasses', 'reps', 'pages', 'ml', 'mins'
  todayCount: number;     // e.g. 2 / 8 glasses completed today
  streak: number;
  bestStreak: number;
  targetDays: number;
  completedDays: number;
  completedToday: boolean;
  status: HabitStatus;
  skipReason?: string;
  pauseReason?: string;
  pausedUntil?: string;
  icon: string;
  color: string;
  history: Record<string, 'completed' | 'skipped' | 'missed'>;
  createdAt: string;
}

export type PriorityLevel = 'urgent' | 'high' | 'medium' | 'low';

export interface TaskItem {
  id: string;
  title: string;
  priority: PriorityLevel;
  completed: boolean;
  dueDate: string;
  dueTime?: string;
  category: string;
  createdAt: string;
}

export interface RewardItem {
  id: string;
  title: string;
  cost: number;
  icon: string;
  category: string;
  description: string;
  claimedCount: number;
  unlockedLevel: number;
}

export interface UserProfile {
  level: number;
  levelTitle: string;
  currentXP: number;
  nextLevelXP: number;
  sparkPoints: number;
  totalHabitsCompleted: number;
  currentStreak: number;
  bestStreak: number;
  streakShields: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface ScheduleBlock {
  id: string;
  title: string;
  startTime: string; // "07:00"
  endTime: string;   // "08:30"
  days: DayOfWeek[];
  category: string;
  color: string;
  icon: string;
  linkedHabitId?: string;
  completedToday?: boolean;
}

export interface SmartReminder {
  id: string;
  title: string;
  triggerTime: string; // "08:00"
  days: DayOfWeek[];
  type: 'habit' | 'schedule' | 'streak_shield' | 'hydration' | 'custom';
  message: string;
  isActive: boolean;
  linkedHabitId?: string;
  lastTriggered?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'reminder' | 'streak' | 'achievement' | 'schedule';
  isRead: boolean;
  actionUrl?: string;
}

export interface ActivityLog {
  date: string;
  count: number;
  percentage: number;
}

export type ActiveSection =
  | 'command-center'
  | 'status'
  | 'health'
  | 'quests'
  | 'skills'
  | 'inventory'
  | 'progression'
  | 'analytics'
  | 'schedule'
  | 'focus'
  | 'widgets'
  | 'habits'
  | 'todos'
  | 'rewards';

export interface PlayerStats {
  str: number; // Strength (Fitness habits)
  int: number; // Intelligence (Learning habits)
  vit: number; // Vitality (Health habits)
  foc: number; // Focus (Productivity habits)
  dex: number; // Dexterity (Creativity habits)
  end: number; // Endurance (Streaks & consistency)
  hp: number;  // Current HP percentage (100% max)
  mp: number;  // Current MP percentage
  fatigue: 'LOW' | 'OPTIMAL' | 'ELEVATED';
}

export interface SkillNode {
  id: string;
  tree: 'discipline' | 'vitality' | 'wisdom';
  title: string;
  tier: number;
  description: string;
  perk: string;
  costSp: number;
  requiredLevel: number;
  prereqId?: string;
  icon: string;
}

export interface QuestCompleteNotification {
  isOpen: boolean;
  questName: string;
  xpGained: number;
  spGained: number;
  statBoost?: string;
}

export interface SkipModalState {
  isOpen: boolean;
  habitId: string | null;
  habitName: string;
}

export interface PauseModalState {
  isOpen: boolean;
  habitId: string | null;
  habitName: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'achievement';
}
