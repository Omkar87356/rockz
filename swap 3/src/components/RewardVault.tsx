import React from 'react';
import { useHabitly } from '../context/HabitlyContext';

export const RewardVault: React.FC = () => {
  const { rewards, user, claimReward, setIsAddRewardOpen } = useHabitly();

  // System RPG inventory items
  const systemInventory = [
    {
      id: 'sys-inv-1',
      title: 'Streak Shield Armor',
      category: 'Legendary Consumable',
      icon: '🛡️',
      rarity: 'legendary',
      quantity: user.streakShields,
      description: 'Freezes streak counter during unexpected disruptions or rest days. Auto-activates on missed habits.',
      isEquipped: user.streakShields > 0,
      cost: 400,
    },
    {
      id: 'sys-inv-2',
      title: 'XP Velocity Booster',
      category: 'Epic Artifact',
      icon: '⚡',
      rarity: 'epic',
      quantity: 1,
      description: 'Increases all quest completion XP gains by 1.5x for 24 hours. Amplifies leveling velocity.',
      isEquipped: true,
      cost: 250,
    },
    {
      id: 'sys-inv-3',
      title: 'Spark Energy Cache',
      category: 'Rare Currency',
      icon: '✦',
      rarity: 'rare',
      quantity: user.sparkPoints,
      description: 'Crystalline kinetic energy harvested from relentless habit completions. Used to unlock talents.',
      isEquipped: true,
      cost: 0,
    },
    {
      id: 'sys-inv-4',
      title: 'Recovery Bio-Token',
      category: 'Uncommon Remedy',
      icon: '🌿',
      rarity: 'uncommon',
      quantity: 2,
      description: 'Restores player HP to 100% and resets fatigue rating to OPTIMAL during strenuous periods.',
      isEquipped: true,
      cost: 150,
    },
  ];

  return (
    <section id="rewards" className="dashboard-section section-reward-vault section-inventory">
      <div className="section-header-row">
        <div>
          <div className="system-tag-eyebrow">◈ SYSTEM / ARSENAL & INVENTORY</div>
          <h2 className="section-main-title">Player Inventory & Vault</h2>
          <p className="section-subtitle">
            Manage your consumable artifacts, protective streak shields, and redeem accumulated Spark Points (✦) for real-life psychological rewards.
          </p>
        </div>
        <div className="vault-balance-card system-window">
          <div className="vault-balance-left">
            <span className="balance-label">SPARK ENERGY BALANCE</span>
            <div className="balance-amount">
              <span className="balance-icon">✦</span>
              <span className="balance-digits">{user.sparkPoints.toLocaleString()} SP</span>
            </div>
          </div>
          <button className="btn-secondary-cyber" onClick={() => setIsAddRewardOpen(true)}>
            <span>+ Add Custom Reward</span>
          </button>
        </div>
      </div>

      {/* Part 1: System Artifacts & Tactical Items */}
      <div className="inventory-section-block">
        <div className="inventory-sub-header">
          <span className="pulse-cyan-dot" />
          <span className="sub-title">TACTICAL SYSTEM INVENTORY</span>
        </div>

        <div className="inventory-grid">
          {systemInventory.map((item) => (
            <div key={item.id} className={`system-window inventory-card rarity-${item.rarity}`}>
              <div className="rarity-glow-line" />
              <div className="inventory-card-top">
                <div className="inventory-icon-box">
                  <span className="item-icon">{item.icon}</span>
                </div>
                <div className="inventory-qty-pill">
                  <span>QTY: ×{item.quantity}</span>
                </div>
              </div>

              <div className="inventory-card-body">
                <div className="rarity-label-tag">{item.rarity.toUpperCase()} ITEM</div>
                <h3 className="inventory-item-title">{item.title}</h3>
                <p className="inventory-item-desc">{item.description}</p>
                <div className="inventory-meta-row">
                  <span className="inventory-cat-badge">{item.category}</span>
                </div>
              </div>

              <div className="inventory-card-footer">
                <div className="equipped-badge">
                  <span>● ACTIVE IN ARSENAL</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Redeemable Vault Rewards */}
      <div className="inventory-section-block mt-4">
        <div className="inventory-sub-header">
          <span className="pulse-violet-dot" />
          <span className="sub-title">REDEEMABLE VAULT REWARDS</span>
        </div>

        <div className="rewards-grid">
          {rewards.map((reward) => {
            const isAffordable = user.sparkPoints >= reward.cost;
            const isUnlocked = user.level >= reward.unlockedLevel;

            return (
              <div
                key={reward.id}
                className={`system-window reward-card ${!isUnlocked ? 'is-locked' : ''} ${isAffordable && isUnlocked ? 'is-claimable' : ''}`}
              >
                <div className="reward-card-top">
                  <div className="reward-icon-box">
                    <span>{reward.icon}</span>
                  </div>
                  <div className="reward-cost-badge">
                    <span>✦ {reward.cost} SP</span>
                  </div>
                </div>

                <div className="reward-card-body">
                  <h3 className="reward-title">{reward.title}</h3>
                  <p className="reward-desc">{reward.description}</p>
                  <div className="reward-meta-row">
                    <span className="reward-cat-tag">📁 {reward.category}</span>
                    <span className="reward-claimed-tag">Redeemed: {reward.claimedCount}x</span>
                  </div>
                </div>

                <div className="reward-card-footer">
                  {!isUnlocked ? (
                    <button className="btn-locked-reward" disabled>
                      <span>🔒 Unlocks at Player Level {reward.unlockedLevel}</span>
                    </button>
                  ) : (
                    <button
                      className={`btn-claim-reward ${isAffordable ? 'active-claim' : 'disabled-claim'}`}
                      onClick={() => claimReward(reward.id)}
                      disabled={!isAffordable}
                    >
                      <span>{isAffordable ? '🎁 Claim Reward' : `Need ${reward.cost - user.sparkPoints} SP`}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
