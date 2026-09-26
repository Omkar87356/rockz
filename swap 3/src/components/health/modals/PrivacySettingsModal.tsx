import React, { useState } from 'react';
import { useHealth } from '../../../context/HealthContext';

export const PrivacySettingsModal: React.FC = () => {
  const {
    isPrivacyModalOpen,
    setIsPrivacyModalOpen,
    exportHealthData,
    deleteEntireHealthProfile,
    profile,
    checkIns,
  } = useHealth();

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isPrivacyModalOpen) return null;

  return (
    <div className="health-modal-backdrop" onClick={() => setIsPrivacyModalOpen(false)}>
      <div className="health-modal-card system-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-super-title">DATA SOVEREIGNTY & PRIVACY POLICY</div>
            <h3 className="modal-title">🛡️ HEALTH DATA & PRIVACY CONTROLS</h3>
          </div>
          <button className="btn-close-modal" onClick={() => setIsPrivacyModalOpen(false)}>
            ✕
          </button>
        </div>

        <div className="privacy-modal-body">
          {/* Privacy Architecture Notice */}
          <div className="privacy-info-block system-window">
            <h4>🔒 ZERO-EXPOSURE LOCAL DATA ISOLATION</h4>
            <p>
              Your biological telemetry, vitals, daily check-ins, and personal body development plans
              are stored in isolated, client-side browser storage (sandbox key: <code>habitly_health_data_v1</code>).
              We do not transmit your health information to third-party ad networks, and no other user
              has access to your personal biological records.
            </p>
          </div>

          {/* Current Profile Summary */}
          <div className="privacy-stats-row">
            <div className="privacy-stat-chip">
              <span className="chip-label">Active Subject</span>
              <span className="chip-val">{profile.name}</span>
            </div>
            <div className="privacy-stat-chip">
              <span className="chip-label">Check-In Records</span>
              <span className="chip-val">{checkIns.length} Entries</span>
            </div>
            <div className="privacy-stat-chip">
              <span className="chip-label">Encryption Sandbox</span>
              <span className="chip-val">Client Sandboxed</span>
            </div>
          </div>

          {/* Export Action */}
          <div className="privacy-action-card system-window">
            <div className="action-card-text">
              <h5>Export Personal Health Telemetry</h5>
              <p>Download a complete JSON archive of all your biological measurements, check-ins, goals, and AI plans.</p>
            </div>
            <button className="btn-export-data" onClick={exportHealthData} id="btn-export-health-data">
              ⬇ Download JSON
            </button>
          </div>

          {/* Clinical Disclaimer */}
          <div className="privacy-disclaimer-callout">
            <h5>⚕️ MEDICAL PRACTICE & AI DISCLAIMER</h5>
            <p>
              The BIO-SYNC AI assistant and calculated health analytics are designed exclusively
              for personal fitness, training, and lifestyle education. The system does not diagnose
              diseases, prescribe medications, or replace professional medical consultations. If you
              experience severe or concerning symptoms, contact an emergency medical provider or your
              physician immediately.
            </p>
          </div>

          {/* Danger Zone: Delete Entire Profile */}
          <div className="privacy-danger-zone system-window">
            <h5 className="danger-title">⚠️ IRREVERSIBLE ACTION: PURGE HEALTH DATA</h5>
            <p className="danger-desc">
              Permanently erase your entire health profile, vital statistics, historical check-ins,
              and AI chat history from this device.
            </p>

            {!confirmDelete ? (
              <button
                className="btn-danger-purge"
                onClick={() => setConfirmDelete(true)}
                id="btn-trigger-purge"
              >
                Delete Entire Health Profile
              </button>
            ) : (
              <div className="confirm-delete-box">
                <span className="confirm-warning">
                  Are you absolutely certain? This will wipe all recorded vitals.
                </span>
                <div className="confirm-buttons">
                  <button className="btn-cancel-delete" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </button>
                  <button
                    className="btn-confirm-purge"
                    onClick={deleteEntireHealthProfile}
                    id="btn-confirm-purge"
                  >
                    Yes, Purge All My Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-modal-secondary" onClick={() => setIsPrivacyModalOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
