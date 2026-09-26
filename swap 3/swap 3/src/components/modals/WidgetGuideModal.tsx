import React from 'react';
import { useHabitly } from '../../context/HabitlyContext';

export const WidgetGuideModal: React.FC = () => {
  const { isWidgetGuideOpen, setIsWidgetGuideOpen } = useHabitly();

  if (!isWidgetGuideOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsWidgetGuideOpen(false)}>
      <div className="glass-modal-card modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-icon">📱</span>
            <h3 className="modal-title">Install Habitly Widget & App</h3>
          </div>
          <button className="modal-close-btn" onClick={() => setIsWidgetGuideOpen(false)}>
            ✕
          </button>
        </div>

        <div className="widget-guide-body">
          <p className="modal-desc-highlight">
            Turn <strong>Habitly</strong> into a standalone native widget on your iPhone, Android, iPad, or Mac/Windows desktop for 1-tap habit logging.
          </p>

          <div className="platform-guides-grid">
            {/* iOS Safari */}
            <div className="guide-card">
              <div className="guide-header">
                <span className="platform-icon">🍏</span>
                <h4>iPhone / iPad (iOS)</h4>
              </div>
              <ol className="guide-steps">
                <li>Open <strong>Safari</strong> and navigate to this URL.</li>
                <li>Tap the <strong>Share</strong> icon (square with up arrow) in the bottom toolbar.</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                <li>Tap <strong>Add</strong> in the top right.</li>
                <li><em>Tip:</em> You can now trigger 1-tap habit logging directly from your home screen dock!</li>
              </ol>
            </div>

            {/* Android Chrome */}
            <div className="guide-card">
              <div className="guide-header">
                <span className="platform-icon">🤖</span>
                <h4>Android (Chrome)</h4>
              </div>
              <ol className="guide-steps">
                <li>Open <strong>Google Chrome</strong> and visit this website.</li>
                <li>Tap the <strong>three vertical dots (⋮)</strong> menu in the top right.</li>
                <li>Select <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</li>
                <li>Confirm by tapping <strong>Install</strong>.</li>
                <li>A standalone widget icon will appear on your device launcher.</li>
              </ol>
            </div>

            {/* Windows / Mac Desktop */}
            <div className="guide-card">
              <div className="guide-header">
                <span className="platform-icon">💻</span>
                <h4>Desktop (Chrome / Edge)</h4>
              </div>
              <ol className="guide-steps">
                <li>Click the <strong>Install icon (⊕)</strong> in the URL address bar.</li>
                <li>Click <strong>Install</strong> to run Habitly in a dedicated distraction-free window.</li>
                <li>Right-click the icon on your Taskbar / Dock and select <strong>"Pin to Taskbar"</strong>.</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="modal-actions-row">
          <button type="button" className="btn-primary-neon" onClick={() => setIsWidgetGuideOpen(false)}>
            <span>✓ Got It, Thanks!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
