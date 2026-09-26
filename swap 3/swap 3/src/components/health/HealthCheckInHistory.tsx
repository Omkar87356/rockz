import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { kgToLb, litersToOz } from '../../utils/healthCalculations';

export const HealthCheckInHistory: React.FC = () => {
  const { checkIns, deleteCheckIn, setIsCheckInModalOpen, unitPreferences } = useHealth();

  const isLb = unitPreferences.weight === 'lb';
  const isOz = unitPreferences.water === 'oz';

  const sortedCheckIns = [...checkIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'great': return '🔥 Great';
      case 'good': return '⚡ Good';
      case 'neutral': return '😐 Neutral';
      case 'tired': return '😴 Tired';
      case 'stressed': return '💥 Stressed';
      default: return '🙂 Good';
    }
  };

  return (
    <div className="checkins-history-container">
      {/* Header */}
      <div className="checkins-header-row system-window">
        <div>
          <h3 className="checkins-title">
            <span className="checkins-icon">📋</span> DAILY BIOMETRIC TELEMETRY LOGS
          </h3>
          <p className="checkins-subtitle">
            Historical audit trail of all recorded check-ins, vital signs, sleep, and physical exertion
          </p>
        </div>

        <button
          className="btn-log-new-checkin"
          onClick={() => setIsCheckInModalOpen(true)}
          id="btn-open-log-checkin"
        >
          <span className="action-icon">⚡</span>
          <span>+ Log Today's Telemetry</span>
        </button>
      </div>

      {/* Table of Records */}
      <div className="checkins-table-wrapper system-window">
        {sortedCheckIns.length === 0 ? (
          <div className="checkins-empty-state">
            <span className="empty-icon">📝</span>
            <p>No telemetry records found. Log your first daily check-in to begin tracking trends!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="checkins-data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Resting HR</th>
                  <th>Blood Pressure</th>
                  <th>Sleep</th>
                  <th>Steps</th>
                  <th>Water</th>
                  <th>Workout</th>
                  <th>Energy</th>
                  <th>Mood</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCheckIns.map((item) => (
                  <tr key={item.id}>
                    <td className="cell-date">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="cell-highlight">
                      {isLb ? `${kgToLb(item.weightKg)} lb` : `${item.weightKg} kg`}
                    </td>
                    <td>{item.restingHeartRateBpm ? `${item.restingHeartRateBpm} BPM` : '—'}</td>
                    <td>
                      {item.bloodPressureSystolic && item.bloodPressureDiastolic
                        ? `${item.bloodPressureSystolic}/${item.bloodPressureDiastolic}`
                        : '—'}
                    </td>
                    <td>{item.sleepHours} hrs</td>
                    <td>{item.steps.toLocaleString()}</td>
                    <td>{isOz ? `${litersToOz(item.waterLiters)} oz` : `${item.waterLiters} L`}</td>
                    <td>
                      <span className={`workout-tag ${item.workoutCompleted ? 'completed' : 'none'}`}>
                        {item.workoutCompleted ? '✓ Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span className="energy-pill">{item.energyLevel}/10</span>
                    </td>
                    <td>
                      <span className="mood-pill">{getMoodEmoji(item.mood)}</span>
                    </td>
                    <td className="cell-notes">{item.notes || '—'}</td>
                    <td>
                      <button
                        className="btn-delete-row"
                        onClick={() => deleteCheckIn(item.id)}
                        title="Delete record"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
