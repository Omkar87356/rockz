import React, { useState } from 'react';
import { useHabitly } from '../context/HabitlyContext';
import { PriorityLevel } from '../types';

export const TodoHub: React.FC = () => {
  const { tasks, toggleTask, addTask, deleteTask } = useHabitly();

  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('high');
  const [newDueDate, setNewDueDate] = useState('Today');
  const [newDueTime, setNewDueTime] = useState('');
  const [newCategory, setNewCategory] = useState('Engineering');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority === 'all') return true;
    if (filterPriority === 'completed') return t.completed;
    if (filterPriority === 'pending') return !t.completed;
    return t.priority === filterPriority;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), newPriority, newDueDate, newDueTime || undefined, newCategory);
    setNewTitle('');
    setNewDueTime('');
  };

  return (
    <section id="todos" className="dashboard-section section-todo-hub">
      <div className="section-header-row">
        <div>
          <div className="section-eyebrow">DAILY EXECUTION</div>
          <h2 className="section-main-title">Daily Priorities Hub</h2>
          <p className="section-subtitle">
            Laser-focus on high-leverage directives. Track priority weight, time blocks, and completion metrics.
          </p>
        </div>
        <div className="task-stats-badge">
          <span className="task-stat-number">{completedTasks}/{totalTasks} Done</span>
          <span className="task-stat-rate">({taskCompletionRate}%)</span>
        </div>
      </div>

      <div className="todo-layout-grid">
        {/* Quick Add Directive Card */}
        <div className="glass-card new-task-card">
          <div className="card-top-tag">NEW DIRECTIVE PROTOCOL</div>
          <form className="new-task-form" onSubmit={handleCreateTask}>
            <div className="form-group">
              <label className="form-label">Task Title / Directive</label>
              <input
                type="text"
                className="cyber-input"
                placeholder="e.g. Deploy production release v2.4..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label className="form-label">Priority Level</label>
                <select
                  className="cyber-select"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                >
                  <option value="urgent">🔴 Urgent / Critical</option>
                  <option value="high">🟠 High Impact</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="low">🟢 Low Priority</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Time Window</label>
                <input
                  type="text"
                  className="cyber-input"
                  placeholder="e.g. 02:00 PM"
                  value={newDueTime}
                  onChange={(e) => setNewDueTime(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="cyber-input"
                  placeholder="e.g. Career, Focus"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary-neon btn-block">
              <span>+ Add Daily Priority</span>
            </button>
          </form>
        </div>

        {/* Task List Panel */}
        <div className="glass-card tasks-panel-card">
          <div className="tasks-panel-header">
            <div className="filter-pill-bar">
              {['all', 'urgent', 'high', 'medium', 'pending', 'completed'].map((f) => (
                <button
                  key={f}
                  className={`filter-pill ${filterPriority === f ? 'active' : ''}`}
                  onClick={() => setFilterPriority(f)}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="tasks-scroll-list">
            {filteredTasks.length === 0 ? (
              <div className="tasks-empty-state">
                <span>🎯 No tasks matching the selected filter.</span>
              </div>
            ) : (
              filteredTasks.map((t) => (
                <div
                  key={t.id}
                  className={`task-row-item ${t.completed ? 'is-completed' : ''} priority-border-${t.priority}`}
                >
                  <button
                    className={`task-custom-checkbox ${t.completed ? 'checked' : ''}`}
                    onClick={() => toggleTask(t.id)}
                    title={t.completed ? 'Mark pending' : 'Mark completed'}
                  >
                    <span>{t.completed && '✓'}</span>
                  </button>

                  <div className="task-body-col" onClick={() => toggleTask(t.id)}>
                    <span className="task-title-text">{t.title}</span>
                    <div className="task-meta-tags">
                      <span className={`priority-tag-badge priority-${t.priority}`}>
                        {t.priority.toUpperCase()}
                      </span>
                      {t.dueTime && <span className="time-tag">⏰ {t.dueTime}</span>}
                      <span className="date-tag">📅 {t.dueDate}</span>
                      <span className="category-tag">📁 {t.category}</span>
                    </div>
                  </div>

                  <button
                    className="task-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(t.id);
                    }}
                    title="Delete task"
                  >
                    <span>✕</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
