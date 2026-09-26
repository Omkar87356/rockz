import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Habit,
  TaskItem,
  RewardItem,
  UserProfile,
  ScheduleBlock,
  SmartReminder,
  AppNotification,
  ActiveSection,
  SkipModalState,
  PauseModalState,
  ToastMessage,
  HabitCategory,
  HabitFrequencyType,
  PriorityLevel,
  PlayerStats,
  QuestCompleteNotification,
} from '../types';
import {
  INITIAL_HABITS,
  INITIAL_TASKS,
  INITIAL_REWARDS,
  INITIAL_USER,
  INITIAL_SCHEDULE,
  INITIAL_REMINDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SKILLS,
  computePlayerStats,
  LEVEL_TIERS,
  loadFromStorage,
  saveToStorage,
} from '../utils/storage';
import { sounds } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';

interface HabitlyContextType {
  habits: Habit[];
  tasks: TaskItem[];
  rewards: RewardItem[];
  user: UserProfile;
  schedule: ScheduleBlock[];
  reminders: SmartReminder[];
  notifications: AppNotification[];
  unreadNotificationCount: number;
  activeSection: ActiveSection;
  setActiveSection: (sec: ActiveSection) => void;
  // Habit actions
  toggleHabit: (id: string) => void;
  incrementHabitCount: (id: string, amount?: number) => void;
  decrementHabitCount: (id: string, amount?: number) => void;
  setHabitCount: (id: string, count: number) => void;
  addHabit: (data: {
    name: string;
    category: HabitCategory;
    frequencyType: HabitFrequencyType;
    frequencyCount: number;
    frequencyUnit?: string;
    targetDays: number;
    icon: string;
    color: string;
  }) => void;
  deleteHabit: (id: string) => void;
  openSkipModal: (id: string, name: string) => void;
  closeSkipModal: () => void;
  confirmSkipHabit: (reason: string) => void;
  openPauseModal: (id: string, name: string) => void;
  closePauseModal: () => void;
  confirmPauseHabit: (reason: string, durationDays?: number) => void;
  resumeHabit: (id: string) => void;
  // Task actions
  toggleTask: (id: string) => void;
  addTask: (title: string, priority: PriorityLevel, dueDate: string, dueTime?: string, category?: string) => void;
  deleteTask: (id: string) => void;
  // Schedule actions
  addScheduleBlock: (block: Omit<ScheduleBlock, 'id'>) => void;
  deleteScheduleBlock: (id: string) => void;
  toggleScheduleBlockToday: (id: string) => void;
  // Reminder actions
  addReminder: (rem: Omit<SmartReminder, 'id'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  testNotification: (title: string, message: string) => void;
  requestNotificationPermission: () => Promise<boolean>;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  // Reward actions
  claimReward: (id: string) => boolean;
  addReward: (data: { title: string; cost: number; icon: string; category: string; description: string }) => void;
  // Modals & UI
  skipModal: SkipModalState;
  pauseModal: PauseModalState;
  isAddHabitOpen: boolean;
  setIsAddHabitOpen: (open: boolean) => void;
  isAddScheduleOpen: boolean;
  setIsAddScheduleOpen: (open: boolean) => void;
  isAddReminderOpen: boolean;
  setIsAddReminderOpen: (open: boolean) => void;
  isAddRewardOpen: boolean;
  setIsAddRewardOpen: (open: boolean) => void;
  isWidgetGuideOpen: boolean;
  setIsWidgetGuideOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isLevelUpOpen: boolean;
  setIsLevelUpOpen: (open: boolean) => void;
  levelUpInfo: { oldLevel: number; newLevel: number; newTitle: string; unlockedRewards: string[] } | null;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  toggleSound: () => void;
  todayCompletionRate: number;
  // Anime RPG System Additions
  playerStats: import('../types').PlayerStats;
  unlockedSkillIds: string[];
  unlockSkill: (id: string) => boolean;
  questNotification: import('../types').QuestCompleteNotification | null;
  triggerQuestNotification: (questName: string, xpGained: number, spGained: number, statBoost?: string) => void;
  closeQuestNotification: () => void;
}

const HabitlyContext = createContext<HabitlyContextType | undefined>(undefined);

export const HabitlyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => loadFromStorage('habitly_react_habits', INITIAL_HABITS));
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadFromStorage('habitly_react_tasks', INITIAL_TASKS));
  const [rewards, setRewards] = useState<RewardItem[]>(() => loadFromStorage('habitly_react_rewards', INITIAL_REWARDS));
  const [user, setUser] = useState<UserProfile>(() => loadFromStorage('habitly_react_user', INITIAL_USER));
  const [schedule, setSchedule] = useState<ScheduleBlock[]>(() => loadFromStorage('habitly_react_schedule', INITIAL_SCHEDULE));
  const [reminders, setReminders] = useState<SmartReminder[]>(() => loadFromStorage('habitly_react_reminders', INITIAL_REMINDERS));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadFromStorage('habitly_react_notifs', INITIAL_NOTIFICATIONS));

  const [activeSection, setActiveSection] = useState<ActiveSection>('command-center');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [isAddRewardOpen, setIsAddRewardOpen] = useState(false);
  const [isWidgetGuideOpen, setIsWidgetGuideOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{ oldLevel: number; newLevel: number; newTitle: string; unlockedRewards: string[] } | null>(null);

  const [skipModal, setSkipModal] = useState<SkipModalState>({ isOpen: false, habitId: null, habitName: '' });
  const [pauseModal, setPauseModal] = useState<PauseModalState>({ isOpen: false, habitId: null, habitName: '' });

  const [unlockedSkillIds, setUnlockedSkillIds] = useState<string[]>(() =>
    loadFromStorage('habitly_unlocked_skills', ['disc-1'])
  );
  const [questNotification, setQuestNotification] = useState<QuestCompleteNotification | null>(null);

  // Persistence
  useEffect(() => { saveToStorage('habitly_react_habits', habits); }, [habits]);
  useEffect(() => { saveToStorage('habitly_react_tasks', tasks); }, [tasks]);
  useEffect(() => { saveToStorage('habitly_react_rewards', rewards); }, [rewards]);
  useEffect(() => { saveToStorage('habitly_react_schedule', schedule); }, [schedule]);
  useEffect(() => { saveToStorage('habitly_react_reminders', reminders); }, [reminders]);
  useEffect(() => { saveToStorage('habitly_react_notifs', notifications); }, [notifications]);
  useEffect(() => { saveToStorage('habitly_unlocked_skills', unlockedSkillIds); }, [unlockedSkillIds]);
  useEffect(() => {
    saveToStorage('habitly_react_user', user);
    sounds.setEnabled(user.soundEnabled);
  }, [user]);

  // Dynamic RPG stats calculation based on real habit & consistency metrics
  const playerStats = useMemo(() => computePlayerStats(habits, user, tasks), [habits, user, tasks]);

  const getCategoryStatBoost = (category: string) => {
    switch (category) {
      case 'fitness': return 'STR +1';
      case 'learning': return 'INT +1';
      case 'health': return 'VIT +1';
      case 'productivity': return 'FOC +1';
      case 'creativity': return 'DEX +1';
      case 'mindfulness': return 'INT & FOC +1';
      default: return 'DISCIPLINE +1';
    }
  };

  const triggerQuestNotification = (questName: string, xpGained: number, spGained: number, statBoost = 'DISCIPLINE +1') => {
    setQuestNotification({
      isOpen: true,
      questName,
      xpGained,
      spGained,
      statBoost,
    });
  };

  const closeQuestNotification = () => {
    setQuestNotification(null);
  };

  const unlockSkill = (id: string): boolean => {
    const skill = INITIAL_SKILLS.find((s) => s.id === id);
    if (!skill) return false;
    if (unlockedSkillIds.includes(id)) {
      addToast('Skill Active', `"${skill.title}" is already unlocked.`, 'info');
      return false;
    }
    if (user.level < skill.requiredLevel) {
      addToast('Locked Node', `Requires Player Level ${skill.requiredLevel}.`, 'warning');
      return false;
    }
    if (skill.prereqId && !unlockedSkillIds.includes(skill.prereqId)) {
      const prereq = INITIAL_SKILLS.find((s) => s.id === skill.prereqId);
      addToast('Prerequisite Required', `Unlock "${prereq?.title || 'Prerequisite'}" first.`, 'warning');
      return false;
    }
    if (user.sparkPoints < skill.costSp) {
      addToast('Insufficient Sparks', `Need ${skill.costSp - user.sparkPoints} more ⚡ Sparks.`, 'warning');
      return false;
    }

    setUser((prev) => ({ ...prev, sparkPoints: prev.sparkPoints - skill.costSp }));
    setUnlockedSkillIds((prev) => [...prev, id]);
    sounds.playLevelUp();
    fireConfetti();
    triggerQuestNotification(`SKILL UNLOCKED: ${skill.title}`, 50, 0, skill.perk);
    addToast('Skill Mastered! ⚡', `Unlocked "${skill.title}": ${skill.perk}`, 'achievement');
    return true;
  };

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSound = () => {
    setUser((prev) => {
      const next = !prev.soundEnabled;
      sounds.setEnabled(next);
      return { ...prev, soundEnabled: next };
    });
    sounds.playClick();
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      addToast('Notifications Unsupported', 'Your browser does not support web notifications.', 'warning');
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setUser((prev) => ({ ...prev, notificationsEnabled: true }));
        addToast('Notifications Enabled! 🔔', 'Habitly smart reminders are now active.', 'success');
        testNotification('Habitly Notifications Active', 'Intelligent reminders are now active.');
        return true;
      } else {
        setUser((prev) => ({ ...prev, notificationsEnabled: false }));
        addToast('Permission Denied', 'Enable notifications in browser settings.', 'warning');
        return false;
      }
    } catch {
      return false;
    }
  };

  const testNotification = (title: string, message: string) => {
    sounds.playTimerBell();
    addToast(title, message, 'info');

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type: 'reminder',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>',
        });
      } catch (e) {
        console.error('Notification error:', e);
      }
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    sounds.playClick();
  };

  // XP & Level calculations
  const addXP = (amount: number, pointsAmount: number) => {
    setUser((prev) => {
      let newXP = prev.currentXP + amount;
      let newLevel = prev.level;
      let newPoints = prev.sparkPoints + pointsAmount;
      let newLevelTitle = prev.levelTitle;
      let leveledUp = false;
      const oldLevel = prev.level;

      const currentTier = LEVEL_TIERS.find((t) => t.level === newLevel);
      if (currentTier && newXP >= currentTier.maxXP) {
        const nextTier = LEVEL_TIERS.find((t) => t.level === newLevel + 1);
        if (nextTier) {
          newLevel = nextTier.level;
          newLevelTitle = nextTier.title;
          leveledUp = true;
        }
      }

      if (leveledUp) {
        sounds.playLevelUp();
        fireConfetti();
        const unlocked = rewards.filter((r) => r.unlockedLevel === newLevel).map((r) => r.title);
        setLevelUpInfo({ oldLevel, newLevel, newTitle: newLevelTitle, unlockedRewards: unlocked });
        setIsLevelUpOpen(true);
        addToast(`Level Up! ${newLevelTitle}`, `Reached Level ${newLevel}! +50 Bonus Spark Points!`, 'achievement');
        newPoints += 50;
      }

      const currentTierCalc = LEVEL_TIERS.find((t) => t.level === newLevel) || LEVEL_TIERS[LEVEL_TIERS.length - 1];
      return {
        ...prev,
        level: newLevel,
        levelTitle: newLevelTitle,
        currentXP: newXP,
        nextLevelXP: currentTierCalc.maxXP,
        sparkPoints: newPoints,
      };
    });
  };

  // Habit Actions
  const toggleHabit = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    let justCompleted = false;

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id || h.status === 'paused') return h;
        const willBeComplete = !h.completedToday;
        justCompleted = willBeComplete;
        const newStreak = willBeComplete ? h.streak + 1 : Math.max(0, h.streak - 1);
        const newCompletedDays = willBeComplete ? h.completedDays + 1 : Math.max(0, h.completedDays - 1);
        const newTodayCount = willBeComplete ? h.frequencyCount : 0;

        return {
          ...h,
          completedToday: willBeComplete,
          todayCount: newTodayCount,
          status: 'active',
          streak: newStreak,
          bestStreak: Math.max(h.bestStreak, newStreak),
          completedDays: newCompletedDays,
          history: {
            ...h.history,
            [todayStr]: willBeComplete ? 'completed' : 'missed',
          },
        };
      })
    );

    // Sync schedule blocks
    setSchedule((prev) =>
      prev.map((b) => (b.linkedHabitId === id ? { ...b, completedToday: justCompleted } : b))
    );

    if (justCompleted) {
      sounds.playComplete();
      fireConfetti();
      addXP(25, 20);
      const targetHabit = habits.find((h) => h.id === id);
      const boost = targetHabit ? getCategoryStatBoost(targetHabit.category) : 'DISCIPLINE +1';
      triggerQuestNotification(targetHabit?.name || 'Quest Protocol', 25, 20, boost);
      addToast('Quest Complete! ⚡', '+25 XP & +20 Spark Points Earned!', 'success');
      setUser((prev) => ({
        ...prev,
        totalHabitsCompleted: prev.totalHabitsCompleted + 1,
        currentStreak: Math.max(prev.currentStreak, 1),
      }));
    } else {
      sounds.playClick();
      addXP(-25, -20);
    }
  };

  const incrementHabitCount = (id: string, amount = 1) => {
    const todayStr = new Date().toISOString().split('T')[0];
    let reachedTarget = false;

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id || h.status === 'paused') return h;
        const nextCount = Math.min(h.frequencyCount, (h.todayCount || 0) + amount);
        const willComplete = nextCount >= h.frequencyCount;
        if (willComplete && !h.completedToday) reachedTarget = true;

        const newStreak = willComplete && !h.completedToday ? h.streak + 1 : h.streak;
        const newCompletedDays = willComplete && !h.completedToday ? h.completedDays + 1 : h.completedDays;

        return {
          ...h,
          todayCount: nextCount,
          completedToday: willComplete,
          streak: newStreak,
          bestStreak: Math.max(h.bestStreak, newStreak),
          completedDays: newCompletedDays,
          history: {
            ...h.history,
            [todayStr]: willComplete ? 'completed' : 'missed',
          },
        };
      })
    );

    if (reachedTarget) {
      sounds.playComplete();
      fireConfetti();
      addXP(30, 25);
      const targetHabit = habits.find((h) => h.id === id);
      const boost = targetHabit ? getCategoryStatBoost(targetHabit.category) : 'DISCIPLINE +1';
      triggerQuestNotification(targetHabit?.name || 'Daily Target Protocol', 30, 25, boost);
      addToast('Daily Target Reached! 🏆', 'All intervals/target count completed today!', 'achievement');
    } else {
      sounds.playClick();
    }
  };

  const decrementHabitCount = (id: string, amount = 1) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id || h.status === 'paused') return h;
        const nextCount = Math.max(0, (h.todayCount || 0) - amount);
        const willComplete = nextCount >= h.frequencyCount;
        return {
          ...h,
          todayCount: nextCount,
          completedToday: willComplete,
        };
      })
    );
    sounds.playClick();
  };

  const setHabitCount = (id: string, count: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    let reachedTarget = false;

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id || h.status === 'paused') return h;
        const safeCount = Math.max(0, Math.min(h.frequencyCount, count));
        const willComplete = safeCount >= h.frequencyCount;
        if (willComplete && !h.completedToday) reachedTarget = true;

        const newStreak = willComplete && !h.completedToday ? h.streak + 1 : h.streak;
        const newCompletedDays = willComplete && !h.completedToday ? h.completedDays + 1 : h.completedDays;

        return {
          ...h,
          todayCount: safeCount,
          completedToday: willComplete,
          streak: newStreak,
          bestStreak: Math.max(h.bestStreak, newStreak),
          completedDays: newCompletedDays,
          history: {
            ...h.history,
            [todayStr]: willComplete ? 'completed' : 'missed',
          },
        };
      })
    );

    if (reachedTarget) {
      sounds.playComplete();
      fireConfetti();
      addXP(30, 25);
      addToast('Daily Target Reached! 🏆', 'Habit target completed today!', 'achievement');
    } else {
      sounds.playClick();
    }
  };

  const addHabit = (data: {
    name: string;
    category: HabitCategory;
    frequencyType: HabitFrequencyType;
    frequencyCount: number;
    frequencyUnit?: string;
    targetDays: number;
    icon: string;
    color: string;
  }) => {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      name: data.name,
      category: data.category,
      frequencyType: data.frequencyType,
      frequencyCount: Math.max(1, data.frequencyCount || 1),
      frequencyUnit: data.frequencyUnit || 'times',
      todayCount: 0,
      streak: 0,
      bestStreak: 0,
      targetDays: data.targetDays,
      completedDays: 0,
      completedToday: false,
      status: 'active',
      icon: data.icon || '🎯',
      color: data.color || '#00F59B',
      history: {},
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [newHabit, ...prev]);
    sounds.playComplete();
    addToast('New Habit Created', `"${data.name}" added to tracker!`, 'success');
    setIsAddHabitOpen(false);
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setSchedule((prev) => prev.filter((b) => b.linkedHabitId !== id));
    sounds.playClick();
    addToast('Habit Removed', 'The habit has been deleted.', 'info');
  };

  const openSkipModal = (id: string, name: string) => {
    setSkipModal({ isOpen: true, habitId: id, habitName: name });
    sounds.playClick();
  };
  const closeSkipModal = () => setSkipModal({ isOpen: false, habitId: null, habitName: '' });

  const confirmSkipHabit = (reason: string) => {
    if (!skipModal.habitId) return;
    const todayStr = new Date().toISOString().split('T')[0];
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== skipModal.habitId) return h;
        return {
          ...h,
          status: 'skipped',
          completedToday: false,
          skipReason: reason,
          history: { ...h.history, [todayStr]: 'skipped' },
        };
      })
    );
    sounds.playClick();
    addToast('Streak Protected 🛡️', `Skipped "${skipModal.habitName}" (${reason}). Streak preserved!`, 'info');
    closeSkipModal();
  };

  const openPauseModal = (id: string, name: string) => {
    setPauseModal({ isOpen: true, habitId: id, habitName: name });
    sounds.playClick();
  };
  const closePauseModal = () => setPauseModal({ isOpen: false, habitId: null, habitName: '' });

  const confirmPauseHabit = (reason: string, durationDays = 14) => {
    if (!pauseModal.habitId) return;
    const until = new Date(Date.now() + durationDays * 86400000).toISOString().split('T')[0];
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== pauseModal.habitId) return h;
        return {
          ...h,
          status: 'paused',
          completedToday: false,
          pauseReason: reason,
          pausedUntil: until,
        };
      })
    );
    sounds.playClick();
    addToast('Habit Paused ⏸️', `"${pauseModal.habitName}" paused for ${durationDays} days (${reason}).`, 'warning');
    closePauseModal();
  };

  const resumeHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        return { ...h, status: 'active', pauseReason: undefined, pausedUntil: undefined };
      })
    );
    sounds.playComplete();
    addToast('Habit Resumed 🚀', 'Habit is back in active rotation!', 'success');
  };

  // Schedule Actions
  const addScheduleBlock = (block: Omit<ScheduleBlock, 'id'>) => {
    const newBlock: ScheduleBlock = {
      ...block,
      id: `sb-${Date.now()}`,
      completedToday: false,
    };
    setSchedule((prev) => [...prev, newBlock].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    sounds.playComplete();
    addToast('Schedule Block Created', `"${block.title}" added to timeline (${block.startTime} - ${block.endTime}).`, 'success');
    setIsAddScheduleOpen(false);
  };

  const deleteScheduleBlock = (id: string) => {
    setSchedule((prev) => prev.filter((b) => b.id !== id));
    sounds.playClick();
    addToast('Schedule Block Deleted', 'Time block removed from schedule.', 'info');
  };

  const toggleScheduleBlockToday = (id: string) => {
    let blockTitle = '';
    let isDone = false;
    let linkedHabit: string | undefined;

    setSchedule((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const next = !b.completedToday;
        blockTitle = b.title;
        isDone = next;
        linkedHabit = b.linkedHabitId;
        return { ...b, completedToday: next };
      })
    );

    if (linkedHabit) {
      toggleHabit(linkedHabit);
    } else {
      if (isDone) {
        sounds.playComplete();
        addXP(20, 15);
        addToast('Schedule Block Completed! 🎯', `"${blockTitle}" crushed! +20 XP`, 'success');
      } else {
        sounds.playClick();
        addXP(-20, -15);
      }
    }
  };

  // Reminder Actions
  const addReminder = (rem: Omit<SmartReminder, 'id'>) => {
    const newRem: SmartReminder = {
      ...rem,
      id: `rem-${Date.now()}`,
    };
    setReminders((prev) => [...prev, newRem]);
    sounds.playComplete();
    addToast('Smart Reminder Set', `Alert scheduled for ${rem.triggerTime} (${rem.title}).`, 'success');
    setIsAddReminderOpen(false);
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
    sounds.playClick();
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    sounds.playClick();
  };

  // Task Actions
  const toggleTask = (id: string) => {
    let completedNow = false;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = !t.completed;
        completedNow = next;
        return { ...t, completed: next };
      })
    );
    if (completedNow) {
      sounds.playComplete();
      fireConfetti();
      addXP(15, 10);
      const targetTask = tasks.find((t) => t.id === id);
      triggerQuestNotification(targetTask?.title || 'Directive', 15, 10, 'FOC +1');
      addToast('Directive Completed! ✔️', '+15 XP & +10 Spark Points', 'success');
    } else {
      sounds.playClick();
      addXP(-15, -10);
    }
  };

  const addTask = (title: string, priority: PriorityLevel, dueDate: string, dueTime?: string, category = 'General') => {
    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      title,
      priority,
      completed: false,
      dueDate,
      dueTime,
      category,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    sounds.playClick();
    addToast('Priority Added', `"${title}" added to daily checklist.`, 'info');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    sounds.playClick();
  };

  // Reward Actions
  const claimReward = (id: string): boolean => {
    const targetReward = rewards.find((r) => r.id === id);
    if (!targetReward) return false;

    if (user.sparkPoints < targetReward.cost) {
      addToast('Insufficient Spark Points', `You need ${targetReward.cost - user.sparkPoints} more ⚡ Spark Points.`, 'warning');
      return false;
    }

    if (user.level < targetReward.unlockedLevel) {
      addToast('Locked Reward', `Unlocks at Level ${targetReward.unlockedLevel}. Keep crushing habits!`, 'warning');
      return false;
    }

    setUser((prev) => ({
      ...prev,
      sparkPoints: prev.sparkPoints - targetReward.cost,
    }));

    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, claimedCount: r.claimedCount + 1 } : r))
    );

    sounds.playComplete();
    fireConfetti();
    addToast('Reward Claimed! 🎁', `Enjoy: "${targetReward.title}"! Well deserved!`, 'achievement');
    return true;
  };

  const addReward = (data: { title: string; cost: number; icon: string; category: string; description: string }) => {
    const newReward: RewardItem = {
      id: `r-${Date.now()}`,
      title: data.title,
      cost: data.cost,
      icon: data.icon || '🎁',
      category: data.category || 'Custom',
      description: data.description,
      claimedCount: 0,
      unlockedLevel: 1,
    };
    setRewards((prev) => [...prev, newReward]);
    sounds.playComplete();
    addToast('Custom Reward Added', `"${data.title}" added to your Vault.`, 'success');
    setIsAddRewardOpen(false);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;
  const activeHabits = habits.filter((h) => h.status !== 'paused');
  const completedHabits = activeHabits.filter((h) => h.completedToday).length;
  const todayCompletionRate = activeHabits.length > 0 ? Math.round((completedHabits / activeHabits.length) * 100) : 0;

  return (
    <HabitlyContext.Provider
      value={{
        habits,
        tasks,
        rewards,
        user,
        schedule,
        reminders,
        notifications,
        unreadNotificationCount,
        activeSection,
        setActiveSection,
        toggleHabit,
        incrementHabitCount,
        decrementHabitCount,
        setHabitCount,
        addHabit,
        deleteHabit,
        openSkipModal,
        closeSkipModal,
        confirmSkipHabit,
        openPauseModal,
        closePauseModal,
        confirmPauseHabit,
        resumeHabit,
        toggleTask,
        addTask,
        deleteTask,
        addScheduleBlock,
        deleteScheduleBlock,
        toggleScheduleBlockToday,
        addReminder,
        toggleReminder,
        deleteReminder,
        testNotification,
        requestNotificationPermission,
        markNotificationRead,
        clearAllNotifications,
        claimReward,
        addReward,
        skipModal,
        pauseModal,
        isAddHabitOpen,
        setIsAddHabitOpen,
        isAddScheduleOpen,
        setIsAddScheduleOpen,
        isAddReminderOpen,
        setIsAddReminderOpen,
        isAddRewardOpen,
        setIsAddRewardOpen,
        isWidgetGuideOpen,
        setIsWidgetGuideOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isLevelUpOpen,
        setIsLevelUpOpen,
        levelUpInfo,
        toasts,
        addToast,
        removeToast,
        toggleSound,
        todayCompletionRate,
        playerStats,
        unlockedSkillIds,
        unlockSkill,
        questNotification,
        triggerQuestNotification,
        closeQuestNotification,
      }}
    >
      {children}
    </HabitlyContext.Provider>
  );
};

export const useHabitly = () => {
  const context = useContext(HabitlyContext);
  if (!context) {
    throw new Error('useHabitly must be used within a HabitlyProvider');
  }
  return context;
};
