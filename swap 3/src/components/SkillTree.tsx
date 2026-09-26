import React, { useState } from 'react';
import { useHabitly } from '../context/HabitlyContext';
import { INITIAL_SKILLS } from '../utils/storage';

export const SkillTree: React.FC = () => {
  const { user, unlockedSkillIds, unlockSkill } = useHabitly();
  const [selectedTree, setSelectedTree] = useState<'all' | 'discipline' | 'vitality' | 'wisdom'>('all');

  const trees = [
    { id: 'all', label: 'ALL TREES', icon: '◈' },
    { id: 'discipline', label: 'DISCIPLINE & FLOW', icon: '⚡' },
    { id: 'vitality', label: 'VITALITY & FORCE', icon: '💚' },
    { id: 'wisdom', label: 'WISDOM & SYNTHESIS', icon: '🔮' },
  ];

  const filteredSkills = INITIAL_SKILLS.filter((s) => {
    if (selectedTree === 'all') return true;
    return s.tree === selectedTree;
  });

  return (
    <section id="skills" className="dashboard-section section-skill-tree">
      <div className="section-header-row">
        <div>
          <div className="system-tag-eyebrow">◈ SYSTEM / TALENT NODES</div>
          <h2 className="section-main-title">Player Skill Tree</h2>
          <p className="section-subtitle">
            Unlock neural subroutines and active perks using accumulated Spark Points (✦). Ascend your discipline protocol.
          </p>
        </div>
        <div className="skill-tree-telemetry-badge">
          <span className="telemetry-label">AVAILABLE SPARKS</span>
          <span className="telemetry-value highlight-cyan">✦ {user.sparkPoints} SP</span>
          <span className="telemetry-unlocked">
            {unlockedSkillIds.length} / {INITIAL_SKILLS.length} UNLOCKED
          </span>
        </div>
      </div>

      {/* Tree Category Selector */}
      <div className="skill-discipline-filter-bar">
        {trees.map((t) => (
          <button
            key={t.id}
            className={`discipline-filter-pill ${selectedTree === t.id ? 'active' : ''}`}
            onClick={() => setSelectedTree(t.id as any)}
          >
            <span className="pill-icon">{t.icon}</span>
            <span className="pill-text">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Futuristic Skill Tree Canvas / Grid */}
      <div className="skill-tree-grid">
        {filteredSkills.map((skill) => {
          const isUnlocked = unlockedSkillIds.includes(skill.id);
          const hasPrereq = !skill.prereqId || unlockedSkillIds.includes(skill.prereqId);
          const meetsLevel = user.level >= skill.requiredLevel;
          const isAvailable = !isUnlocked && hasPrereq && meetsLevel;
          const canAfford = user.sparkPoints >= skill.costSp;

          let statusState: 'unlocked' | 'available' | 'locked' = 'locked';
          if (isUnlocked) statusState = 'unlocked';
          else if (isAvailable) statusState = 'available';

          const prereqObj = skill.prereqId ? INITIAL_SKILLS.find((s) => s.id === skill.prereqId) : null;

          return (
            <div
              key={skill.id}
              className={`skill-node-card status-${statusState} tree-${skill.tree}`}
            >
              <div className="node-corner-tl" />
              <div className="node-corner-br" />

              <div className="skill-node-top">
                <div className="node-icon-box">
                  <span className="node-icon">{skill.icon}</span>
                </div>
                <div className="node-tier-pill">
                  <span>TIER {skill.tier}</span>
                </div>
              </div>

              <div className="skill-node-body">
                <h3 className="skill-node-title">{skill.title}</h3>
                <span className="skill-tree-category-tag">◈ {skill.tree.toUpperCase()} PATH</span>
                <p className="skill-node-desc">{skill.description}</p>

                <div className="skill-perk-badge">
                  <span className="perk-label">ACTIVE PERK:</span>
                  <span className="perk-value">{skill.perk}</span>
                </div>

                {prereqObj && !isUnlocked && (
                  <div className="skill-prereq-note">
                    <span className="prereq-icon">↳</span>
                    <span>Requires: {prereqObj.title}</span>
                  </div>
                )}
              </div>

              <div className="skill-node-footer">
                {isUnlocked ? (
                  <div className="node-status-badge unlocked">
                    <span>✓ ACTIVE & SYNCHRONIZED</span>
                  </div>
                ) : isAvailable ? (
                  <button
                    className={`btn-unlock-skill ${canAfford ? 'can-afford' : 'cannot-afford'}`}
                    onClick={() => unlockSkill(skill.id)}
                    disabled={!canAfford}
                  >
                    <span>
                      {canAfford ? `✦ Unlock Node (${skill.costSp} SP)` : `Need ${skill.costSp - user.sparkPoints} More SP`}
                    </span>
                  </button>
                ) : (
                  <div className="node-status-badge locked">
                    <span>
                      🔒 {!meetsLevel ? `Requires Level ${skill.requiredLevel}` : 'Prerequisite Locked'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
