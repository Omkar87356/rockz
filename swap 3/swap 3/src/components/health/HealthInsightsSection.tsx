import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { InsightCategory } from '../../types/health';

export const HealthInsightsSection: React.FC = () => {
  const { insights, metrics, profile } = useHealth();
  const [activeCategory, setActiveCategory] = useState<'all' | InsightCategory>('all');

  const filteredInsights = activeCategory === 'all'
    ? insights
    : insights.filter((i) => i.category === activeCategory);

  const getCategoryBadge = (cat: InsightCategory) => {
    switch (cat) {
      case 'recorded':
        return { label: 'RECORDED DATA', color: '#00E5FF', bg: 'rgba(0, 229, 255, 0.12)' };
      case 'calculated':
        return { label: 'CALCULATED METRIC', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.12)' };
      case 'ai_suggestion':
        return { label: 'AI SUGGESTION', color: '#00FF9C', bg: 'rgba(0, 255, 156, 0.12)' };
      case 'medical_notice':
        return { label: 'CLINICAL ADVISORY', color: '#FF3366', bg: 'rgba(255, 51, 102, 0.12)' };
    }
  };

  return (
    <div className="health-insights-container">
      {/* Header & Filter Controls */}
      <div className="insights-header-row">
        <div>
          <h3 className="insights-title">
            <span className="insights-icon">🧠</span> AI BIOMETRIC SYNAPSE // OBSERVATION LOGS
          </h3>
          <p className="insights-subtitle">
            Algorithmic trend detection and real-time behavioral insights derived from your biological telemetry
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="insights-filter-group">
          {[
            { id: 'all', label: 'All Telemetry' },
            { id: 'recorded', label: 'Recorded Data' },
            { id: 'calculated', label: 'Calculated' },
            { id: 'ai_suggestion', label: 'AI Directives' },
            { id: 'medical_notice', label: 'Clinical Alerts' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`btn-insight-filter ${activeCategory === tab.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Cards List */}
      <div className="insights-cards-grid">
        {filteredInsights.length === 0 ? (
          <div className="insights-empty-state system-window">
            <span className="empty-icon">◈</span>
            <p>No telemetry observations in this category. Continue recording daily check-ins to unlock more insights.</p>
          </div>
        ) : (
          filteredInsights.map((item) => {
            const badge = getCategoryBadge(item.category);
            return (
              <div
                key={item.id}
                className={`insight-card system-window type-${item.type} category-${item.category}`}
              >
                <div className="insight-card-top">
                  <span
                    className="insight-category-pill"
                    style={{ color: badge.color, backgroundColor: badge.bg, borderColor: badge.color }}
                  >
                    {badge.label}
                  </span>
                  {item.metricReference && (
                    <span className="insight-metric-ref">{item.metricReference}</span>
                  )}
                </div>

                <h4 className="insight-card-title">{item.title}</h4>
                <p className="insight-card-message">{item.message}</p>

                <div className="insight-card-footer">
                  <span className="insight-timestamp">
                    Timestamp: {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="insight-status-tag">
                    {item.category === 'medical_notice' ? 'Requires Attention' : 'Active Observation'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Distinction Guide Footer */}
      <div className="insights-legend-banner system-window">
        <div className="legend-legend-title">CLASSIFICATION PROTOCOL:</div>
        <div className="legend-pills-row">
          <span className="legend-chip recorded">● Recorded: Verifiable raw telemetry logged by user</span>
          <span className="legend-chip calculated">● Calculated: Standardized physiological formulas (Mifflin-St Jeor / BMI)</span>
          <span className="legend-chip ai">● AI Suggestion: Algorithmic optimization protocols</span>
          <span className="legend-chip clinical">● Clinical: Observations recommending qualified medical consultation</span>
        </div>
      </div>
    </div>
  );
};
