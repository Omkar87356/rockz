import React from 'react';
import { useHabitly } from '../../context/HabitlyContext';

export const LevelUpModal: React.FC = () => {
  const { isLevelUpOpen, setIsLevelUpOpen, levelUpInfo } = useHabitly();

  if (!isLevelUpOpen || !levelUpInfo) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsLevelUpOpen(false)}>
      <div className="glass-modal-card modal-levelup text-center" onClick={(e) => e.stopPropagation()}>
        <div className="levelup-badge-aura">
          <span className="levelup-big-icon">👑</span>
        </div>

        <span className="levelup-eyebrow">ASCENSION ACHIEVED</span>
        <h2 className="levelup-title">Level {levelUpInfo.newLevel} Unlocked!</h2>
        <h4 className="levelup-tier-name">{levelUpInfo.newTitle}</h4>

        <p className="levelup-congrats">
          Your relentless consistency and daily discipline have elevated you to a higher echelon of mastery.
        </p>

        <div className="levelup-perks-box">
          <div className="perk-row">
            <span className="perk-icon">⚡</span>
            <span className="perk-text">+50 Bonus Spark Points Added</span>
          </div>
          <div className="perk-row">
            <span className="perk-icon">🛡️</span>
            <span className="perk-text">+1 Streak Shield Recharged</span>
          </div>
          {levelUpInfo.unlockedRewards.length > 0 && (
            <div className="perk-row">
              <span className="perk-icon">🎁</span>
              <span className="perk-text">New Rewards in Vault: {levelUpInfo.unlockedRewards.join(', ')}</span>
            </div>
          )}
        </div>

        <button className="btn-primary-neon btn-block mt-4" onClick={() => setIsLevelUpOpen(false)}>
          <span>⚡ Claim Mastery & Continue</span>
        </button>
      </div>
    </div>
  );
};
