import React, { useState, useRef, useEffect } from 'react';
import { useHealth } from '../../context/HealthContext';

export const HealthAIChat: React.FC = () => {
  const { chatMessages, sendChatMessage, clearChatHistory, profile, metrics } = useHealth();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt);
  };

  const QUICK_PROMPTS = [
    'Create a workout for today.',
    'Why has my weight changed this week?',
    'How can I improve my sleep?',
    'Give me a beginner leg workout.',
    'What should I focus on this week?',
    'Help me stay consistent.',
    'Show me my progress this month.',
  ];

  return (
    <div className="health-chat-container system-window">
      {/* Chat Header */}
      <div className="chat-header-bar">
        <div className="chat-assistant-meta">
          <div className="assistant-avatar">
            <span className="pulse-ai-dot" />
            🤖
          </div>
          <div>
            <div className="assistant-name">YOUR AI HEALTH & FITNESS ASSISTANT</div>
            <div className="assistant-status">
              SYNCHRONIZED WITH {profile.name || 'USER'} TELEMETRY (BMI: {metrics.bmi} // TDEE: ~{metrics.tdee} kcal)
            </div>
          </div>
        </div>

        <div className="chat-header-actions">
          <button
            className="btn-clear-chat"
            onClick={clearChatHistory}
            title="Clear Chat Conversation"
          >
            Clear History
          </button>
        </div>
      </div>

      {/* Synchronized Telemetry Glance Bar */}
      <div className="chat-telemetry-glance">
        <span className="telemetry-chip">
          ⚖️ Weight: {profile.weightKg} kg (Target: {profile.targetWeightKg} kg)
        </span>
        <span className="telemetry-chip">
          ❤️ HR: {profile.restingHeartRateBpm} BPM
        </span>
        <span className="telemetry-chip">
          🩸 BP: {profile.bloodPressureSystolic}/{profile.bloodPressureDiastolic} mmHg
        </span>
        <span className="telemetry-chip">
          🔥 Target: {metrics.targetCalories} kcal/day
        </span>
        <span className="telemetry-chip">
          🎯 Goal: {profile.currentFitnessGoal.replace('_', ' ')}
        </span>
      </div>

      {/* Quick Prompts Carousel / Pills */}
      <div className="chat-quick-prompts">
        <span className="quick-prompt-label">DIRECTIVE PROMPTS:</span>
        <div className="quick-prompts-scroll">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              className="quick-prompt-chip"
              onClick={() => handleQuickPrompt(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="chat-messages-stream">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`chat-message-row ${isUser ? 'user' : 'assistant'}`}>
              {!isUser && <div className="msg-avatar assistant">🤖</div>}
              <div className="msg-bubble-box">
                <div className="msg-header">
                  <span className="msg-sender">{isUser ? 'YOU' : 'BIO-AI ASSISTANT'}</span>
                  <span className="msg-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="msg-body-content">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>
                      {paragraph.split('\n').map((line, lIdx) => (
                        <React.Fragment key={lIdx}>
                          {line}
                          {lIdx < paragraph.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                  ))}
                </div>
                {msg.disclaimer && (
                  <div className="msg-disclaimer">
                    <span className="disclaimer-icon">⚕️</span> {msg.disclaimer}
                  </div>
                )}
              </div>
              {isUser && <div className="msg-avatar user">👤</div>}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={handleSend} className="chat-input-bar">
        <input
          type="text"
          className="chat-text-input"
          placeholder="Ask a question about your workouts, nutrition, sleep, weight trends, or recovery..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          type="submit"
          className="btn-send-message"
          disabled={!inputText.trim()}
          id="btn-send-health-chat"
        >
          <span>Send</span>
          <span className="send-arrow">➔</span>
        </button>
      </form>
    </div>
  );
};
