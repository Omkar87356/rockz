import { Habit, TaskItem, RewardItem, UserProfile, ScheduleBlock, SmartReminder, AppNotification } from '../types';

export const LEVEL_TIERS = [
  { level: 1, title: 'Novice Seeker', minXP: 0, maxXP: 100 },
  { level: 2, title: 'Habit Initiate', minXP: 100, maxXP: 300 },
  { level: 3, title: 'Disciplined Mind', minXP: 300, maxXP: 600 },
  { level: 4, title: 'Focus Practitioner', minXP: 600, maxXP: 1000 },
  { level: 5, title: 'Flow Architect', minXP: 1000, maxXP: 1500 },
  { level: 6, title: 'Zen Catalyst', minXP: 1500, maxXP: 2200 },
  { level: 7, title: 'Master of Routine', minXP: 2200, maxXP: 3000 },
  { level: 8, title: 'Apex Optimizer', minXP: 3000, maxXP: 4000 },
];

export const INITIAL_USER: UserProfile = {
  level: 3,
  levelTitle: 'Disciplined Mind',
  currentXP: 450,
  nextLevelXP: 600,
  sparkPoints: 620,
  totalHabitsCompleted: 48,
  currentStreak: 12,
  bestStreak: 19,
  streakShields: 2,
  soundEnabled: true,
  notificationsEnabled: true,
};

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'h-1',
    name: 'Morning Meditation & Breathwork',
    category: 'mindfulness',
    frequencyType: 'daily',
    frequencyCount: 1,
    todayCount: 1,
    streak: 12,
    bestStreak: 15,
    targetDays: 30,
    completedDays: 22,
    completedToday: true,
    status: 'active',
    icon: '🧘',
    color: '#00F59B',
    history: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h-2',
    name: 'Deep Work Session (90 Mins)',
    category: 'productivity',
    frequencyType: 'times_per_day',
    frequencyCount: 2, // 2 times per day!
    todayCount: 2,
    streak: 8,
    bestStreak: 14,
    targetDays: 20,
    completedDays: 16,
    completedToday: true,
    status: 'active',
    icon: '⚡',
    color: '#6366F1',
    history: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h-3',
    name: 'Hydration Target (Glasses of Water)',
    category: 'health',
    frequencyType: 'times_per_day',
    frequencyCount: 8, // 8 times per day (8 glasses)
    todayCount: 5,
    streak: 19,
    bestStreak: 19,
    targetDays: 30,
    completedDays: 26,
    completedToday: false,
    status: 'active',
    icon: '💧',
    color: '#06B6D4',
    history: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h-4',
    name: 'Strength Training / Calisthenics',
    category: 'fitness',
    frequencyType: 'days_per_week',
    frequencyCount: 5, // 5 days per week
    todayCount: 0,
    streak: 5,
    bestStreak: 10,
    targetDays: 24,
    completedDays: 14,
    completedToday: false,
    status: 'active',
    icon: '🏋️',
    color: '#D4FF00',
    history: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h-5',
    name: 'Read 20 Pages Non-Fiction',
    category: 'learning',
    frequencyType: 'daily',
    frequencyCount: 1,
    todayCount: 0,
    streak: 7,
    bestStreak: 12,
    targetDays: 30,
    completedDays: 18,
    completedToday: false,
    status: 'active',
    icon: '📚',
    color: '#F59E0B',
    history: {},
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h-6',
    name: 'Guitar Practice & Creative Flow',
    category: 'creativity',
    frequencyType: 'interval',
    frequencyCount: 2, // Every 2 days
    todayCount: 0,
    streak: 3,
    bestStreak: 8,
    targetDays: 15,
    completedDays: 8,
    completedToday: false,
    status: 'paused',
    pauseReason: 'Injury / Rehab',
    icon: '🎸',
    color: '#EC4899',
    history: {},
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_SCHEDULE: ScheduleBlock[] = [
  {
    id: 'sb-1',
    title: 'Morning Sunlight & Mindful Breath',
    startTime: '06:30',
    endTime: '07:15',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    category: 'Mindfulness',
    color: '#00F59B',
    icon: '🧘',
    linkedHabitId: 'h-1',
    completedToday: true,
  },
  {
    id: 'sb-2',
    title: 'High-Leverage Deep Coding Block',
    startTime: '09:00',
    endTime: '12:00',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    category: 'Productivity',
    color: '#6366F1',
    icon: '⚡',
    linkedHabitId: 'h-2',
    completedToday: true,
  },
  {
    id: 'sb-3',
    title: 'Hydration Target & Bio Recharge',
    startTime: '13:00',
    endTime: '13:30',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    category: 'Health',
    color: '#06B6D4',
    icon: '💧',
    linkedHabitId: 'h-3',
    completedToday: false,
  },
  {
    id: 'sb-4',
    title: 'Hypertrophy Strength Workout',
    startTime: '17:30',
    endTime: '18:45',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    category: 'Fitness',
    color: '#D4FF00',
    icon: '🏋️',
    linkedHabitId: 'h-4',
    completedToday: false,
  },
  {
    id: 'sb-5',
    title: 'Evening Philosophy & Deep Reading',
    startTime: '21:30',
    endTime: '22:15',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    category: 'Learning',
    color: '#F59E0B',
    icon: '📚',
    linkedHabitId: 'h-5',
    completedToday: false,
  },
];

export const INITIAL_REMINDERS: SmartReminder[] = [
  {
    id: 'rem-1',
    title: 'Morning Routine Kickoff',
    triggerTime: '06:25',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    type: 'schedule',
    message: 'Time to rise! Sunlight & meditation protocol starts in 5 minutes.',
    isActive: true,
  },
  {
    id: 'rem-2',
    title: 'Deep Work Flow State Alert',
    triggerTime: '08:55',
    days: ['mon', 'tue', 'wed', 'thu', 'fri'],
    type: 'habit',
    message: 'Eliminate all tab clutter. 90-minute Deep Work session starting.',
    isActive: true,
  },
  {
    id: 'rem-3',
    title: 'Hydration & Posture Check',
    triggerTime: '14:00',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    type: 'hydration',
    message: 'Drink 500ml water and stand up for spinal realignment.',
    isActive: true,
  },
  {
    id: 'rem-4',
    title: 'Nightly Streak Shield Warning',
    triggerTime: '21:00',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    type: 'streak_shield',
    message: '3 hours before midnight! Log your remaining habits or activate Skip.',
    isActive: true,
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '🔥 Streak Momentum Level Up',
    message: 'You have maintained your streak for 12 consecutive days!',
    timestamp: '10m ago',
    type: 'streak',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: '⏰ Scheduled: Hypertrophy Workout',
    message: 'Gym session begins at 17:30 today. Prep your hydration.',
    timestamp: '1h ago',
    type: 'schedule',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: '⚡ 620 Spark Points Accumulated',
    message: 'New rewards unlocked in the Vault. Check them out!',
    timestamp: '3h ago',
    type: 'achievement',
    isRead: true,
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: 'Review System Architecture PR on Github',
    priority: 'urgent',
    completed: true,
    dueDate: 'Today',
    dueTime: '11:00 AM',
    category: 'Engineering',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-2',
    title: 'Prepare quarterly OKR slide deck for stakeholders',
    priority: 'high',
    completed: false,
    dueDate: 'Today',
    dueTime: '03:30 PM',
    category: 'Strategy',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-3',
    title: 'Submit monthly expense reconciliation',
    priority: 'medium',
    completed: false,
    dueDate: 'Tomorrow',
    dueTime: '05:00 PM',
    category: 'Finance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-4',
    title: 'Organize workspace cable management & desk layout',
    priority: 'low',
    completed: false,
    dueDate: 'This Weekend',
    category: 'Life',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'r-1',
    title: '1 Hour Guilt-Free Gaming / Netflix',
    cost: 100,
    icon: '🎮',
    category: 'Entertainment',
    description: 'Enjoy high immersion relaxation without cognitive guilt.',
    claimedCount: 4,
    unlockedLevel: 1,
  },
  {
    id: 'r-2',
    title: 'Artisanal Specialty Coffee & Pastry',
    cost: 150,
    icon: '☕',
    category: 'Food & Drink',
    description: 'Visit your favorite premium cafe and savor a handcrafted roast.',
    claimedCount: 2,
    unlockedLevel: 1,
  },
  {
    id: 'r-3',
    title: 'Buy a Brand New Hardcover Book',
    cost: 300,
    icon: '📖',
    category: 'Learning',
    description: 'Order any book from your wishlist immediately.',
    claimedCount: 1,
    unlockedLevel: 2,
  },
  {
    id: 'r-4',
    title: 'Weekend Spa, Sauna & Cold Plunge',
    cost: 600,
    icon: '🧖',
    category: 'Wellness',
    description: 'Full body nervous system reset at the local wellness spa.',
    claimedCount: 0,
    unlockedLevel: 3,
  },
  {
    id: 'r-5',
    title: 'Pro Mechanical Keyboard / Tech Gear',
    cost: 1200,
    icon: '⌨️',
    category: 'Gear',
    description: 'High-ticket reward for crushing 30+ consistent days.',
    claimedCount: 0,
    unlockedLevel: 4,
  },
];

export const STOIC_QUOTES = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { text: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.", author: "John C. Maxwell" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
  { text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius" },
];

export const INITIAL_SKILLS: {
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
}[] = [
  // Discipline Tree
  {
    id: 'disc-1',
    tree: 'discipline',
    title: 'Discipline Core',
    tier: 1,
    description: 'Foundational neural pathway for systematic daily execution.',
    perk: '+5% Habit XP Velocity',
    costSp: 0,
    requiredLevel: 1,
    icon: '◈',
  },
  {
    id: 'disc-2',
    tree: 'discipline',
    title: 'Focus Protocol I',
    tier: 2,
    description: 'Calibrates high-immersion attentional density.',
    perk: '+15 XP on Focus Quests',
    costSp: 100,
    requiredLevel: 2,
    prereqId: 'disc-1',
    icon: '⚡',
  },
  {
    id: 'disc-3',
    tree: 'discipline',
    title: 'Stamina Armor I',
    tier: 2,
    description: 'Reinforces daily willpower against fatigue drop-off.',
    perk: '+1 Max Streak Shield Slot',
    costSp: 100,
    requiredLevel: 2,
    prereqId: 'disc-1',
    icon: '🛡️',
  },
  {
    id: 'disc-4',
    tree: 'discipline',
    title: 'Focus Protocol II',
    tier: 3,
    description: 'Hyper-accelerated momentum during deep sessions.',
    perk: 'Reduces Task Friction by 20%',
    costSp: 250,
    requiredLevel: 3,
    prereqId: 'disc-2',
    icon: '🎯',
  },
  {
    id: 'disc-5',
    tree: 'discipline',
    title: 'Stamina Armor II',
    tier: 3,
    description: 'High-yield spark absorption on multi-habit completion.',
    perk: '+15% Spark Gain on Daily Clears',
    costSp: 250,
    requiredLevel: 3,
    prereqId: 'disc-3',
    icon: '⚔️',
  },
  {
    id: 'disc-6',
    tree: 'discipline',
    title: 'Deep Work Mastery',
    tier: 4,
    description: 'Unlocks prolonged 90-minute high-leverage flow states.',
    perk: '+50 XP Bonus on Deep Work',
    costSp: 500,
    requiredLevel: 4,
    prereqId: 'disc-4',
    icon: '🌌',
  },
  {
    id: 'disc-7',
    tree: 'discipline',
    title: 'Master of Flow',
    tier: 5,
    description: 'Apex synchronization between intention and execution.',
    perk: 'Doubles Ascension Level Rewards',
    costSp: 1000,
    requiredLevel: 5,
    prereqId: 'disc-6',
    icon: '👑',
  },
  // Vitality Tree
  {
    id: 'vit-1',
    tree: 'vitality',
    title: 'Cellular Hydration',
    tier: 1,
    description: 'Systemic cellular replenishment protocol.',
    perk: '+10 MP on Hydration Goals',
    costSp: 75,
    requiredLevel: 1,
    icon: '💧',
  },
  {
    id: 'vit-2',
    tree: 'vitality',
    title: 'Iron Resilience',
    tier: 2,
    description: 'High-density physical conditioning adaptation.',
    perk: '+15 STR & Physical Resilience',
    costSp: 180,
    requiredLevel: 2,
    prereqId: 'vit-1',
    icon: '🏋️',
  },
  {
    id: 'vit-3',
    tree: 'vitality',
    title: 'Bio-Rhythm Flow',
    tier: 3,
    description: 'Circadian optimization and nervous system recovery.',
    perk: 'HP Regeneration During Rest',
    costSp: 350,
    requiredLevel: 3,
    prereqId: 'vit-2',
    icon: '🌿',
  },
  // Wisdom Tree
  {
    id: 'wis-1',
    tree: 'wisdom',
    title: 'Cognitive Synthesis',
    tier: 1,
    description: 'High-efficiency knowledge extraction from reading.',
    perk: '+12 INT on Learning Quests',
    costSp: 75,
    requiredLevel: 1,
    icon: '📖',
  },
  {
    id: 'wis-2',
    tree: 'wisdom',
    title: 'Pattern Recognition',
    tier: 2,
    description: 'Fast analytical diagnostics of life systems.',
    perk: '+15% Telemetry Precision',
    costSp: 200,
    requiredLevel: 2,
    prereqId: 'wis-1',
    icon: '🧠',
  },
  {
    id: 'wis-3',
    tree: 'wisdom',
    title: 'Polymath Catalyst',
    tier: 3,
    description: 'Cross-discipline mastery connecting mind & craft.',
    perk: '+25 DEX on Creative Quests',
    costSp: 450,
    requiredLevel: 4,
    prereqId: 'wis-2',
    icon: '🔮',
  },
];

export const computePlayerStats = (
  habits: Habit[],
  user: UserProfile,
  tasks: TaskItem[]
): {
  str: number;
  int: number;
  vit: number;
  foc: number;
  dex: number;
  end: number;
  hp: number;
  mp: number;
  fatigue: 'LOW' | 'OPTIMAL' | 'ELEVATED';
} => {
  let str = 25;
  let int = 20;
  let vit = 22;
  let foc = 28;
  let dex = 18;
  let end = 15;

  habits.forEach((h) => {
    const contribution = (h.streak * 2) + Math.min(20, h.completedDays);
    if (h.category === 'fitness') str += contribution;
    else if (h.category === 'learning') int += contribution;
    else if (h.category === 'health') vit += contribution;
    else if (h.category === 'productivity') foc += contribution;
    else if (h.category === 'creativity') dex += contribution;
    else if (h.category === 'mindfulness') {
      int += Math.round(contribution * 0.4);
      foc += Math.round(contribution * 0.6);
    }
  });

  end += Math.round((user.currentStreak * 2.2) + (user.totalHabitsCompleted * 0.35));

  const activeHabits = habits.filter((h) => h.status !== 'paused');
  const completedCount = activeHabits.filter((h) => h.completedToday).length;
  const rate = activeHabits.length > 0 ? completedCount / activeHabits.length : 1;

  const hp = Math.min(100, Math.max(40, Math.round(60 + (rate * 40))));
  const mp = Math.min(100, Math.round(Math.min(1000, user.sparkPoints) / 10));
  const fatigue: 'LOW' | 'OPTIMAL' | 'ELEVATED' = rate >= 0.7 ? 'OPTIMAL' : rate >= 0.3 ? 'LOW' : 'ELEVATED';

  return { str, int, vit, foc, dex, end, hp, mp, fatigue };
};

export const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Failed to load ${key} from storage:`, e);
  }
  return fallback;
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to storage:`, e);
  }
};
