import React, { useEffect } from 'react';
import { HabitlyProvider, useHabitly } from './context/HabitlyContext';
import { Navigation } from './components/Navigation';
import { Topbar } from './components/Topbar';
import { CommandCenter } from './components/CommandCenter';
import { ScheduleArchitect } from './components/ScheduleArchitect';
import { WidgetDock } from './components/WidgetDock';
import { SmartReminderCenter } from './components/SmartReminderCenter';
import { HabitTracker } from './components/HabitTracker';
import { TodoHub } from './components/TodoHub';
import { AnalyticsHub } from './components/AnalyticsHub';
import { RewardVault } from './components/RewardVault';
import { StatusScreen } from './components/StatusScreen';
import { FocusQuest } from './components/FocusQuest';
import { ProgressionTimeline } from './components/ProgressionTimeline';
import { SkillTree } from './components/SkillTree';
import { ToastNotifications } from './components/ToastNotifications';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AddHabitModal } from './components/modals/AddHabitModal';
import { AddScheduleModal } from './components/modals/AddScheduleModal';
import { AddReminderModal } from './components/modals/AddReminderModal';
import { SkipHabitModal } from './components/modals/SkipHabitModal';
import { PauseHabitModal } from './components/modals/PauseHabitModal';
import { AddRewardModal } from './components/modals/AddRewardModal';
import { WidgetGuideModal } from './components/modals/WidgetGuideModal';
import { LevelUpModal } from './components/modals/LevelUpModal';
import { QuestCompleteModal } from './components/modals/QuestCompleteModal';

// AI Health & Bio-Sync System Imports
import { HealthProvider } from './context/HealthContext';
import { HealthSection } from './components/health/HealthSection';
import { HealthProfileModal } from './components/health/modals/HealthProfileModal';
import { DailyCheckInModal } from './components/health/modals/DailyCheckInModal';
import { PrivacySettingsModal } from './components/health/modals/PrivacySettingsModal';

const MainLayout: React.FC = () => {
  const { setActiveSection } = useHabitly();

  // Scroll spy & intersection observer for smooth animations and active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            const id = entry.target.id;
            if (id) {
              setActiveSection(id as any);
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, [setActiveSection]);

  // Click ripple listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('button, .glass-card, .quick-habit-chip, .schedule-block-card');
      if (target) {
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'click-ripple-particle';
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="habitly-app-root">
      <Navigation />
      <div className="app-main-viewport">
        <Topbar />
        <main className="dashboard-content-stream">
          <CommandCenter />
          <StatusScreen />
          <HealthSection />
          <FocusQuest />
          <ScheduleArchitect />
          <WidgetDock />
          <SmartReminderCenter />
          <HabitTracker />
          <ProgressionTimeline />
          <SkillTree />
          <TodoHub />
          <AnalyticsHub />
          <RewardVault />
        </main>
      </div>

      {/* Global Modals, Drawers & Toast System */}
      <AddHabitModal />
      <AddScheduleModal />
      <AddReminderModal />
      <SkipHabitModal />
      <PauseHabitModal />
      <AddRewardModal />
      <WidgetGuideModal />
      <LevelUpModal />
      <QuestCompleteModal />
      <NotificationDrawer />
      <ToastNotifications />

      {/* AI Health & Bio-Sync Modals */}
      <HealthProfileModal />
      <DailyCheckInModal />
      <PrivacySettingsModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <HabitlyProvider>
      <HealthProvider>
        <MainLayout />
      </HealthProvider>
    </HabitlyProvider>
  );
};

export default App;
