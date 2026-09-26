import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { HealthOverview } from './HealthOverview';
import { HealthInsightsSection } from './HealthInsightsSection';
import { HealthPlanView } from './HealthPlanView';
import { HealthGoalsView } from './HealthGoalsView';
import { HealthAIChat } from './HealthAIChat';
import { HealthCheckInHistory } from './HealthCheckInHistory';

export const HealthSection: React.FC = () => {
  const {
    activeHealthTab,
    setActiveHealthTab,
    setIsCheckInModalOpen,
    setIsProfileModalOpen,
    setIsPrivacyModalOpen,
    profile,
    metrics,
  } = useHealth();

  return (
    <section id="health" className="dashboard-section health-hub-section in-view">
      {/* Section Header */}
      <div className="section-header-hud health-header-hud">
        <div className="section-title-wrapper">
          <div className="system-protocol-tag">
            <span className="pulse-cyan-dot" />
            <span>BIO-SYNC PROTOCOL // VITAL TELEMETRY ENGINE</span>
          </div>
          <h2 className="section-main-heading">
            <span className="neon-cyan-text">BIO-SYNC</span> AI HEALTH & BODY ASSISTANT
          </h2>
          <p className="section-lead-desc">
            Personal body development, dynamic biometric monitoring, algorithmic nutrition strategies,
            and conversational health coaching calibrated to your unique physiology.
          </p>
        </div>

        <div className="section-header-right-actions">
          <button
            className="hud-action-btn checkin-btn"
            onClick={() => setIsCheckInModalOpen(true)}
            title="Log Today's Weight and Vitals"
            id="btn-header-log-checkin"
          >
            <span className="btn-icon">⚡</span>
            <span>+ Daily Check-In</span>
          </button>

          <button
            className="hud-action-btn edit-profile-btn"
            onClick={() => setIsProfileModalOpen(true)}
            title="Edit Personal Health Profile and Vitals"
            id="btn-header-edit-profile"
          >
            <span className="btn-icon">⚙️</span>
            <span>Edit Profile</span>
          </button>

          <button
            className="hud-action-btn privacy-btn"
            onClick={() => setIsPrivacyModalOpen(true)}
            title="Privacy, Data Export & Security Settings"
            id="btn-header-privacy"
          >
            <span className="btn-icon">🛡️</span>
            <span>Privacy</span>
          </button>
        </div>
      </div>

      {/* Main Health Navigation Tabs */}
      <div className="health-master-nav-tabs">
        <button
          className={`health-nav-tab ${activeHealthTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveHealthTab('dashboard')}
          id="tab-health-dashboard"
        >
          <span className="tab-glyph">📊</span>
          <span className="tab-text">Telemetry Dashboard</span>
        </button>

        <button
          className={`health-nav-tab ${activeHealthTab === 'plan' ? 'active' : ''}`}
          onClick={() => setActiveHealthTab('plan')}
          id="tab-health-plan"
        >
          <span className="tab-glyph">⚡</span>
          <span className="tab-text">Personalized Plan</span>
        </button>

        <button
          className={`health-nav-tab ${activeHealthTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveHealthTab('goals')}
          id="tab-health-goals"
        >
          <span className="tab-glyph">🎯</span>
          <span className="tab-text">Goals & Milestones</span>
        </button>

        <button
          className={`health-nav-tab ${activeHealthTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveHealthTab('chat')}
          id="tab-health-chat"
        >
          <span className="tab-glyph">🤖</span>
          <span className="tab-text">AI Assistant Chat</span>
        </button>

        <button
          className={`health-nav-tab ${activeHealthTab === 'checkins' ? 'active' : ''}`}
          onClick={() => setActiveHealthTab('checkins')}
          id="tab-health-checkins"
        >
          <span className="tab-glyph">📋</span>
          <span className="tab-text">Check-In History</span>
        </button>
      </div>

      {/* Dynamic Tab Content Area */}
      <div className="health-tab-content-area">
        {activeHealthTab === 'dashboard' && (
          <>
            <HealthOverview />
            <div style={{ marginTop: '28px' }}>
              <HealthInsightsSection />
            </div>
          </>
        )}

        {activeHealthTab === 'plan' && <HealthPlanView />}

        {activeHealthTab === 'goals' && <HealthGoalsView />}

        {activeHealthTab === 'chat' && <HealthAIChat />}

        {activeHealthTab === 'checkins' && <HealthCheckInHistory />}
      </div>
    </section>
  );
};
