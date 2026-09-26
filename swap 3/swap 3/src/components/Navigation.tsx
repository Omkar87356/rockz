import React from 'react';
import { useHabitly } from '../context/HabitlyContext';
import { ActiveSection } from '../types';

interface NavItem {
  id: ActiveSection;
  label: string;
  icon: string;
  badge?: string;
}

export const Navigation: React.FC = () => {
  const { activeSection, setActiveSection, user, todayCompletionRate } = useHabitly();

  const xpPercent = Math.min(100, Math.round((user.currentXP / user.nextLevelXP) * 100));

  const navItems: NavItem[] = [
    { id: 'command-center', label: 'SYSTEM', icon: '◈' },
    { id: 'status', label: 'STATUS', icon: '◈' },
    { id: 'health', label: 'BIO-SYNC AI', icon: '🧬', badge: 'AI BIO' },
    { id: 'habits', label: 'QUESTS', icon: '◈' },
    { id: 'skills', label: 'SKILLS', icon: '◈' },
    { id: 'rewards', label: 'INVENTORY', icon: '◈', badge: '✦' + user.sparkPoints },
    { id: 'progression', label: 'PROGRESSION', icon: '◈' },
    { id: 'analytics', label: 'ANALYTICS', icon: '◈' },
    { id: 'schedule', label: 'SCHEDULE', icon: '◈' },
    { id: 'focus', label: 'FOCUS MODE', icon: '◈' },
  ];

  const handleNavClick = (id: ActiveSection) => {
    setActiveSection(id);
    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="app-sidebar anime-rpg-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-icon">◈</div>
        <div className="brand-info">
          <h1 className="brand-title">HABITLY</h1>
          <div className="system-online-badge">
            <span className="pulse-cyan-dot" />
            <span className="online-text">SYSTEM ONLINE</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <div className="nav-group-label">OPERATING SYSTEM NAV</div>
        {navItems.map((item) => {
          const isActive =
            activeSection === item.id ||
            (item.id === 'habits' && (activeSection === 'quests' || activeSection === 'todos')) ||
            (item.id === 'rewards' && activeSection === 'inventory') ||
            (item.id === 'focus' && activeSection === 'widgets');

          return (
            <button
              key={item.id}
              className={`nav-btn anime-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
              {isActive && <div className="active-glow-indicator" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom Player Glance Card (Requirement 4) */}
      <div className="sidebar-footer-widget system-window">
        <div className="player-summary-row">
          <span className="player-lv-title">LEVEL {user.level}</span>
          <span className="player-sub-title">{user.levelTitle}</span>
        </div>

        <div className="sidebar-xp-bar-box">
          <div className="sidebar-xp-track">
            <div className="sidebar-xp-fill" style={{ width: `${xpPercent}%` }} />
          </div>
          <div className="sidebar-xp-meta">
            <span>XP PROGRESS</span>
            <span>{user.currentXP}/{user.nextLevelXP} ({xpPercent}%)</span>
          </div>
        </div>

        <div className="sidebar-footer-stats">
          <div className="footer-stat-chip">
            <span className="stat-icon">🔥</span>
            <span className="stat-text">{user.currentStreak} DAYS</span>
          </div>
          <div className="footer-stat-chip">
            <span className="stat-icon">✦</span>
            <span className="stat-text">{user.sparkPoints} SP</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
