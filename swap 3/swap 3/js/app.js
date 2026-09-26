/* ==========================================================================
   HABITLY — Core Application Controller
   Habits, To-Dos, Circular Progress, Gamification, Widgets, Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ── Load Data ──
  let data = loadData();

  // ── DOM References ──
  const $ = id => document.getElementById(id);

  // Navigation
  const sidebar = $('sidebar');
  const sidebarNav = $('sidebarNav');
  const mobileMenuBtn = $('mobileMenuBtn');

  // Topbar
  const topbarPoints = $('topbarPoints');
  const topbarStreak = $('topbarStreak');
  const topbarLevel = $('topbarLevel');
  const topbarXpText = $('topbarXpText');
  const topbarXpBar = $('topbarXpBar');
  const soundToggleBtn = $('soundToggleBtn');
  const soundIconOn = $('soundIconOn');
  const soundIconOff = $('soundIconOff');
  const quickResetDataBtn = $('quickResetDataBtn');

  // Hero Stats
  const statTodayPoints = $('statTodayPoints');
  const statHabitsDone = $('statHabitsDone');
  const statTodosDone = $('statTodosDone');
  const statBestStreak = $('statBestStreak');

  // Circular Progress
  const circleProgressBar = $('circleProgressBar');
  const circlePercentage = $('circlePercentage');
  const circleItemsCount = $('circleItemsCount');
  const circleMotivationBadge = $('circleMotivationBadge');

  // Quick Access Decks
  const quickHabitsDeck = $('quickHabitsDeckContainer');
  const quickTodosDeck = $('quickTodosDeckContainer');

  // Habits Section
  const habitsListContainer = $('habitsListContainer');
  const habitsHeaderCount = $('habitsHeaderCount');
  const navHabitsCount = $('navHabitsCount');
  const habitCategoryFilters = $('habitCategoryFilters');

  // Todos Section
  const todoItemsList = $('todoItemsList');
  const todosHeaderCount = $('todosHeaderCount');
  const navTodosCount = $('navTodosCount');
  const todoForm = $('todoForm');
  const todoInput = $('todoInput');
  const todoPriority = $('todoPriority');
  const todoFilterTabs = $('todoFilterTabs');

  // Rewards
  const rewardsGridContainer = $('rewardsGridContainer');
  const rewardsBalanceBadge = $('rewardsBalanceBadge');

  // Modals
  const addHabitModal = $('addHabitModal');
  const skipHabitModal = $('skipHabitModal');
  const pauseHabitModal = $('pauseHabitModal');
  const addWidgetModal = $('addWidgetModal');
  const addRewardModal = $('addRewardModal');
  const levelUpModal = $('levelUpModal');

  // Widgets
  const pomodoroDisplay = $('pomodoroTimerDisplay');
  const toggleTimerBtn = $('toggleTimerBtn');
  const resetTimerBtn = $('resetTimerBtn');
  const stepTimerBtn = $('stepTimerBtn');
  const nextQuoteBtn = $('nextQuoteBtn');
  const dailyQuoteText = $('dailyQuoteText');
  const dailyQuoteAuthor = $('dailyQuoteAuthor');

  // Toast
  const toastContainer = $('toastContainer');

  // ── State ──
  let currentHabitFilter = 'all';
  let currentTodoFilter = 'all';
  let pomodoroSeconds = 25 * 60;
  let pomodoroRunning = false;
  let pomodoroInterval = null;

  // ══════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ══════════════════════════════════════════════════════════════════════

  function init() {
    renderAll();
    setupNav();
    setupModals();
    setupTodoForm();
    setupFilters();
    setupWidgets();
    setupSoundToggle();
    setupResetBtn();
    setupScrollAnimations();
    setupRippleEffects();
    HabitlyCharts.initCalendar();
    HabitlyCharts.initChart(data.history);
    showRandomQuote();
  }

  function renderAll() {
    updateTopbar();
    updateHeroStats();
    updateCircleProgress();
    renderQuickHabitsDeck();
    renderQuickTodosDeck();
    renderHabits();
    renderTodos();
    renderRewards();
    renderQuickHabitWidgetList();
  }

  // ══════════════════════════════════════════════════════════════════════
  // TOPBAR & GAMIFICATION
  // ══════════════════════════════════════════════════════════════════════

  function updateTopbar() {
    const lvl = getLevelInfo(data.profile.totalXp);
    if (topbarPoints) topbarPoints.textContent = data.profile.points.toLocaleString();
    if (topbarStreak) topbarStreak.textContent = `${data.profile.streak} Days`;
    if (topbarLevel) topbarLevel.textContent = `LVL ${lvl.level}`;
    if (topbarXpText) topbarXpText.textContent = `${lvl.currentXp} / ${lvl.maxXp} XP`;
    if (topbarXpBar) topbarXpBar.style.width = `${lvl.progress}%`;

    // Sidebar user
    const sidebarRank = $('sidebarUserRank');
    if (sidebarRank) sidebarRank.textContent = `Level ${lvl.level} • ${lvl.title}`;
  }

  function addPoints(amount) {
    const oldLevel = getLevelInfo(data.profile.totalXp).level;
    data.profile.points += amount;
    data.profile.totalXp += Math.floor(amount * 0.8);
    const newLevel = getLevelInfo(data.profile.totalXp).level;

    if (newLevel > oldLevel) {
      triggerLevelUp(newLevel);
    }

    saveData(data);
    updateTopbar();
  }

  function triggerLevelUp(newLevel) {
    const tier = LEVEL_TIERS.find(t => t.level === newLevel);
    const titleText = $('levelUpTitleText');
    if (titleText && tier) titleText.textContent = `Level ${tier.level}: ${tier.title}`;
    openModal(levelUpModal);
    Confetti.burst(80);
    HabitlyAudio.playLevelUp();
    data.profile.points += 100; // bonus
  }

  // ══════════════════════════════════════════════════════════════════════
  // HERO STATS
  // ══════════════════════════════════════════════════════════════════════

  function updateHeroStats() {
    const completedHabits = data.habits.filter(h => h.status === 'active' && h.progress >= h.target).length;
    const activeHabits = data.habits.filter(h => h.status === 'active').length;
    const completedTodos = data.todos.filter(t => t.done).length;
    const totalTodos = data.todos.length;

    if (statTodayPoints) {
      const todayPts = completedHabits * 25 + completedTodos * 20;
      statTodayPoints.innerHTML = `+${todayPts} <span class="unit">PTS</span>`;
    }
    if (statHabitsDone) statHabitsDone.textContent = `${completedHabits} / ${activeHabits}`;
    if (statTodosDone) statTodosDone.textContent = `${completedTodos} / ${totalTodos}`;
    if (statBestStreak) statBestStreak.innerHTML = `${data.profile.bestStreak} <span class="unit">DAYS</span>`;
  }

  // ══════════════════════════════════════════════════════════════════════
  // CIRCULAR PROGRESS RING
  // ══════════════════════════════════════════════════════════════════════

  function updateCircleProgress() {
    const activeHabits = data.habits.filter(h => h.status === 'active');
    const completedHabits = activeHabits.filter(h => h.progress >= h.target).length;
    const completedTodos = data.todos.filter(t => t.done).length;
    const totalItems = activeHabits.length + data.todos.length;
    const doneItems = completedHabits + completedTodos;
    const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

    const circumference = 2 * Math.PI * 50; // r=50
    const offset = circumference - (pct / 100) * circumference;

    if (circleProgressBar) {
      circleProgressBar.setAttribute('stroke-dasharray', circumference);
      circleProgressBar.setAttribute('stroke-dashoffset', offset);
    }
    if (circlePercentage) circlePercentage.innerHTML = `${pct}<span class="symbol">%</span>`;
    if (circleItemsCount) circleItemsCount.textContent = `${doneItems} of ${totalItems} Done`;

    if (circleMotivationBadge) {
      if (pct === 100) circleMotivationBadge.innerHTML = '<span>🏆 Perfect Day! All targets hit!</span>';
      else if (pct >= 80) circleMotivationBadge.innerHTML = '<span>⚡ Almost at 100%! Finish strong</span>';
      else if (pct >= 50) circleMotivationBadge.innerHTML = '<span>🔥 Over halfway! Keep pushing</span>';
      else circleMotivationBadge.innerHTML = '<span>💪 Build momentum — every action counts</span>';
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // QUICK ACCESS DECKS (Home Screen)
  // ══════════════════════════════════════════════════════════════════════

  function renderQuickHabitsDeck() {
    if (!quickHabitsDeck) return;
    const activeHabits = data.habits.filter(h => h.status === 'active');
    const badge = $('quickHabitsBadge');
    if (badge) badge.textContent = `(${activeHabits.length} Active)`;

    quickHabitsDeck.innerHTML = activeHabits.map(h => {
      const done = h.progress >= h.target;
      return `<div class="quick-habit-chip ${done ? 'done' : ''}" data-habit-id="${h.id}" title="${h.name}: ${h.progress}/${h.target} ${h.unit}">
        <span class="chip-icon">${h.icon}</span>
        <span>${h.name}</span>
        <span class="chip-progress">${h.progress}/${h.target}</span>
      </div>`;
    }).join('');

    quickHabitsDeck.querySelectorAll('.quick-habit-chip:not(.done)').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.dataset.habitId;
        incrementHabit(id);
      });
    });
  }

  function renderQuickTodosDeck() {
    if (!quickTodosDeck) return;
    const pending = data.todos.filter(t => !t.done).slice(0, 4);
    const badge = $('quickTodosBadge');
    if (badge) badge.textContent = `(${pending.length} Pending)`;

    quickTodosDeck.innerHTML = pending.map(t => `
      <div class="todo-item" data-todo-id="${t.id}">
        <div class="todo-checkbox" data-todo-id="${t.id}"></div>
        <span class="todo-text">${t.text}</span>
        <span class="todo-priority-tag ${t.priority}">${t.priority}</span>
      </div>
    `).join('');

    quickTodosDeck.querySelectorAll('.todo-checkbox').forEach(cb => {
      cb.addEventListener('click', () => toggleTodo(cb.dataset.todoId));
    });
  }

  // ══════════════════════════════════════════════════════════════════════
  // HABITS RENDERING & CONTROLS
  // ══════════════════════════════════════════════════════════════════════

  function renderHabits() {
    if (!habitsListContainer) return;

    let filtered = data.habits;
    if (currentHabitFilter === 'active') filtered = data.habits.filter(h => h.status === 'active');
    else if (currentHabitFilter === 'paused') filtered = data.habits.filter(h => h.status === 'paused' || h.status === 'skipped');
    else if (currentHabitFilter !== 'all') filtered = data.habits.filter(h => h.category === currentHabitFilter);

    const activeCount = data.habits.filter(h => h.status === 'active').length;
    if (habitsHeaderCount) habitsHeaderCount.textContent = `(${activeCount})`;
    if (navHabitsCount) navHabitsCount.textContent = activeCount;

    habitsListContainer.innerHTML = filtered.map((h, i) => {
      const pct = Math.min(100, Math.round((h.progress / h.target) * 100));
      const isDone = h.progress >= h.target;
      const isPaused = h.status === 'paused';
      const isSkipped = h.status === 'skipped';

      let statusClass = '';
      if (isDone) statusClass = 'completed';
      if (isPaused) statusClass = 'paused-card';
      if (isSkipped) statusClass = 'skipped-card';

      let controls = '';
      if (isPaused) {
        controls = `
          <button class="habit-ctrl-btn resume-btn" data-action="resume" data-id="${h.id}" title="Resume Habit">▶</button>
          <button class="habit-ctrl-btn delete-btn" data-action="delete" data-id="${h.id}" title="Delete">✕</button>`;
      } else if (isSkipped) {
        controls = `
          <span style="font-size:10px; color:var(--info);">Skipped Today</span>
          <button class="habit-ctrl-btn delete-btn" data-action="delete" data-id="${h.id}" title="Delete">✕</button>`;
      } else {
        controls = `
          <span class="habit-points-badge">+${h.points} pts</span>
          <button class="habit-ctrl-btn increment" data-action="increment" data-id="${h.id}" title="Increment">+</button>
          <button class="habit-ctrl-btn" data-action="decrement" data-id="${h.id}" title="Decrement">−</button>
          <button class="habit-ctrl-btn skip-btn" data-action="skip" data-id="${h.id}" title="Skip Today">⏭</button>
          <button class="habit-ctrl-btn pause-btn" data-action="pause" data-id="${h.id}" title="Pause for Life Phase">⏸</button>
          <button class="habit-ctrl-btn delete-btn" data-action="delete" data-id="${h.id}" title="Delete">✕</button>`;
      }

      let phaseInfo = '';
      if (isPaused && h.skipReason) phaseInfo = `<span class="habit-phase-reason">⏸ ${h.skipReason}</span>`;
      if (isSkipped && h.skipReason) phaseInfo = `<span class="habit-phase-reason">🛡️ ${h.skipReason}</span>`;

      return `
        <div class="habit-card ${statusClass}" style="animation-delay: ${i * 50}ms">
          <div class="habit-icon">${h.icon}</div>
          <div class="habit-info">
            <div class="habit-title-row">
              <span class="habit-name">${h.name}</span>
              <span class="habit-category-tag">${h.category}</span>
              ${h.streak > 0 && h.status === 'active' ? `<span class="habit-streak-badge">🔥 ${h.streak}d</span>` : ''}
            </div>
            ${phaseInfo}
            <div class="habit-progress-wrap">
              <div class="habit-progress-track">
                <div class="habit-progress-fill" style="width: ${pct}%"></div>
              </div>
              <span class="habit-progress-text">${h.progress} / ${h.target} ${h.unit}</span>
            </div>
          </div>
          <div class="habit-controls">${controls}</div>
        </div>`;
    }).join('');

    // Attach event handlers
    habitsListContainer.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (action === 'increment') incrementHabit(id);
        else if (action === 'decrement') decrementHabit(id);
        else if (action === 'skip') openSkipModal(id);
        else if (action === 'pause') openPauseModal(id);
        else if (action === 'resume') resumeHabit(id);
        else if (action === 'delete') deleteHabit(id);
      });
    });
  }

  function incrementHabit(id) {
    const h = data.habits.find(h => h.id === id);
    if (!h || h.status !== 'active') return;
    const wasDone = h.progress >= h.target;
    h.progress = Math.min(h.progress + 1, h.target + 5);

    if (!wasDone && h.progress >= h.target) {
      HabitlyAudio.playComplete();
      addPoints(h.points);
      showToast(`✅ ${h.name} completed! +${h.points} pts`, 'success');
    } else {
      HabitlyAudio.playIncrement();
    }

    saveData(data);
    renderAll();
  }

  function decrementHabit(id) {
    const h = data.habits.find(h => h.id === id);
    if (!h || h.status !== 'active') return;
    h.progress = Math.max(0, h.progress - 1);
    saveData(data);
    renderAll();
    HabitlyAudio.playClick();
  }

  function resumeHabit(id) {
    const h = data.habits.find(h => h.id === id);
    if (!h) return;
    h.status = 'active';
    h.skipReason = '';
    saveData(data);
    renderAll();
    showToast(`▶ ${h.name} resumed! Welcome back!`, 'info');
    HabitlyAudio.playSuccess();
  }

  function deleteHabit(id) {
    const h = data.habits.find(h => h.id === id);
    if (!h) return;
    data.habits = data.habits.filter(h => h.id !== id);
    saveData(data);
    renderAll();
    showToast(`🗑 ${h.name} removed`, 'info');
    HabitlyAudio.playClick();
  }

  // ══════════════════════════════════════════════════════════════════════
  // TODOS RENDERING & CONTROLS
  // ══════════════════════════════════════════════════════════════════════

  function renderTodos() {
    if (!todoItemsList) return;

    let filtered = data.todos;
    if (currentTodoFilter === 'pending') filtered = data.todos.filter(t => !t.done);
    else if (currentTodoFilter === 'completed') filtered = data.todos.filter(t => t.done);

    const totalCount = data.todos.length;
    const pendingCount = data.todos.filter(t => !t.done).length;
    if (todosHeaderCount) todosHeaderCount.textContent = `(${totalCount})`;
    if (navTodosCount) navTodosCount.textContent = pendingCount;

    todoItemsList.innerHTML = filtered.map((t, i) => `
      <div class="todo-item ${t.done ? 'done' : ''}" style="animation-delay: ${i * 40}ms">
        <div class="todo-checkbox ${t.done ? 'checked' : ''}" data-todo-id="${t.id}">${t.done ? '✓' : ''}</div>
        <span class="todo-text">${t.text}</span>
        <span class="todo-priority-tag ${t.priority}">${t.priority}</span>
        <span class="todo-points">+${t.points} pts</span>
        <button class="todo-delete-btn" data-todo-delete="${t.id}" title="Delete Task">✕</button>
      </div>
    `).join('');

    todoItemsList.querySelectorAll('.todo-checkbox').forEach(cb => {
      cb.addEventListener('click', () => toggleTodo(cb.dataset.todoId));
    });

    todoItemsList.querySelectorAll('.todo-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteTodo(btn.dataset.todoDelete));
    });
  }

  function toggleTodo(id) {
    const t = data.todos.find(t => t.id === id);
    if (!t) return;
    t.done = !t.done;
    if (t.done) {
      addPoints(t.points);
      showToast(`✅ Task complete! +${t.points} pts`, 'points');
      HabitlyAudio.playComplete();
    } else {
      HabitlyAudio.playClick();
    }
    saveData(data);
    renderAll();
  }

  function deleteTodo(id) {
    data.todos = data.todos.filter(t => t.id !== id);
    saveData(data);
    renderAll();
    HabitlyAudio.playClick();
  }

  function setupTodoForm() {
    if (!todoForm) return;
    todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = todoInput.value.trim();
      if (!text) return;

      const priorityPoints = { urgent: 50, high: 30, normal: 15 };
      const priority = todoPriority.value;

      data.todos.push({
        id: generateId(),
        text,
        priority,
        done: false,
        points: priorityPoints[priority] || 15,
      });

      todoInput.value = '';
      saveData(data);
      renderAll();
      showToast('📋 New priority added!', 'info');
      HabitlyAudio.playClick();
    });
  }

  // ══════════════════════════════════════════════════════════════════════
  // REWARDS RENDERING & CONTROLS
  // ══════════════════════════════════════════════════════════════════════

  function renderRewards() {
    if (!rewardsGridContainer) return;
    if (rewardsBalanceBadge) rewardsBalanceBadge.textContent = `${data.profile.points.toLocaleString()} Available`;

    rewardsGridContainer.innerHTML = data.rewards.map((r, i) => {
      const canClaim = data.profile.points >= r.cost && !r.claimed;
      return `
        <div class="reward-card" style="animation-delay: ${i * 60}ms">
          <span class="reward-emoji">${r.emoji}</span>
          <div class="reward-title">${r.title}</div>
          <div class="reward-desc">${r.desc}</div>
          <div class="reward-cost">${r.cost} PTS</div>
          <button class="reward-claim-btn" data-reward-id="${r.id}" ${!canClaim ? 'disabled' : ''}>
            ${r.claimed ? 'CLAIMED ✓' : canClaim ? 'CLAIM REWARD' : 'NOT ENOUGH POINTS'}
          </button>
        </div>`;
    }).join('');

    rewardsGridContainer.querySelectorAll('.reward-claim-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => claimReward(btn.dataset.rewardId));
    });
  }

  function claimReward(id) {
    const r = data.rewards.find(r => r.id === id);
    if (!r || r.claimed || data.profile.points < r.cost) return;

    data.profile.points -= r.cost;
    r.claimed = true;
    saveData(data);
    renderAll();
    updateTopbar();
    Confetti.burst(50);
    showToast(`🎉 Claimed: ${r.title}! Enjoy!`, 'success');
    HabitlyAudio.playSuccess();
  }

  // ══════════════════════════════════════════════════════════════════════
  // WIDGETS
  // ══════════════════════════════════════════════════════════════════════

  function renderQuickHabitWidgetList() {
    const container = $('quickHabitWidgetList');
    if (!container) return;
    const active = data.habits.filter(h => h.status === 'active');
    container.innerHTML = active.map(h => {
      const done = h.progress >= h.target;
      return `<div class="quick-habit-chip ${done ? 'done' : ''}" data-widget-habit="${h.id}">
        <span class="chip-icon">${h.icon}</span>
        <span>${h.name}</span>
        <span class="chip-progress">${h.progress}/${h.target}</span>
      </div>`;
    }).join('');

    container.querySelectorAll('.quick-habit-chip:not(.done)').forEach(chip => {
      chip.addEventListener('click', () => {
        incrementHabit(chip.dataset.widgetHabit);
      });
    });
  }

  function setupWidgets() {
    // Pomodoro Timer
    if (toggleTimerBtn) {
      toggleTimerBtn.addEventListener('click', () => {
        if (pomodoroRunning) {
          clearInterval(pomodoroInterval);
          pomodoroRunning = false;
          toggleTimerBtn.textContent = 'START';
        } else {
          pomodoroRunning = true;
          toggleTimerBtn.textContent = 'PAUSE';
          pomodoroInterval = setInterval(() => {
            pomodoroSeconds--;
            if (pomodoroSeconds <= 0) {
              clearInterval(pomodoroInterval);
              pomodoroRunning = false;
              pomodoroSeconds = 25 * 60;
              toggleTimerBtn.textContent = 'START';
              showToast('⏰ Focus session complete! +30 pts', 'points');
              addPoints(30);
              HabitlyAudio.playSuccess();
            }
            updateTimerDisplay();
          }, 1000);
        }
        HabitlyAudio.playClick();
      });
    }

    if (resetTimerBtn) {
      resetTimerBtn.addEventListener('click', () => {
        clearInterval(pomodoroInterval);
        pomodoroRunning = false;
        pomodoroSeconds = 25 * 60;
        if (toggleTimerBtn) toggleTimerBtn.textContent = 'START';
        updateTimerDisplay();
        HabitlyAudio.playClick();
      });
    }

    if (stepTimerBtn) {
      stepTimerBtn.addEventListener('click', () => {
        pomodoroSeconds += 5 * 60;
        updateTimerDisplay();
        HabitlyAudio.playClick();
      });
    }

    // Quote Widget
    if (nextQuoteBtn) {
      nextQuoteBtn.addEventListener('click', () => {
        showRandomQuote();
        HabitlyAudio.playClick();
      });
    }

    // Add Widget Guide
    const openGuideBtn = $('openAddWidgetGuideBtn');
    if (openGuideBtn) openGuideBtn.addEventListener('click', () => { openModal(addWidgetModal); HabitlyAudio.playClick(); });
    const closeWidgetBtn = $('closeAddWidgetBtn');
    if (closeWidgetBtn) closeWidgetBtn.addEventListener('click', () => closeModal(addWidgetModal));
    const doneWidgetBtn = $('doneAddWidgetBtn');
    if (doneWidgetBtn) doneWidgetBtn.addEventListener('click', () => closeModal(addWidgetModal));
    const copyUrlBtn = $('copyWidgetUrlBtn');
    if (copyUrlBtn) {
      copyUrlBtn.addEventListener('click', () => {
        const urlField = $('shareWidgetUrl');
        if (urlField) {
          navigator.clipboard.writeText(urlField.value).then(() => {
            showToast('📋 Link copied to clipboard!', 'info');
          });
        }
      });
    }
  }

  function updateTimerDisplay() {
    if (!pomodoroDisplay) return;
    const mins = Math.floor(pomodoroSeconds / 60);
    const secs = pomodoroSeconds % 60;
    pomodoroDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function showRandomQuote() {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    if (dailyQuoteText) dailyQuoteText.textContent = `"${q.text}"`;
    if (dailyQuoteAuthor) dailyQuoteAuthor.textContent = `— ${q.author}`;
  }

  // ══════════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ══════════════════════════════════════════════════════════════════════

  function setupNav() {
    // Sidebar nav clicks
    if (sidebarNav) {
      sidebarNav.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          sidebarNav.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');

          const target = item.dataset.target;
          const section = document.getElementById(target);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }

          // Close mobile sidebar
          if (sidebar) sidebar.classList.remove('open');
          HabitlyAudio.playClick();
        });
      });
    }

    // Mobile toggle
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        if (sidebar) sidebar.classList.toggle('open');
        HabitlyAudio.playClick();
      });
    }

    // Rewards quick link
    const openRewardsBtn = $('openRewardsBtn');
    if (openRewardsBtn) {
      openRewardsBtn.addEventListener('click', () => {
        const rewardsSection = document.getElementById('rewards-section');
        if (rewardsSection) rewardsSection.scrollIntoView({ behavior: 'smooth' });
        HabitlyAudio.playClick();
      });
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // FILTERS
  // ══════════════════════════════════════════════════════════════════════

  function setupFilters() {
    // Habit filters
    if (habitCategoryFilters) {
      habitCategoryFilters.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          habitCategoryFilters.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          currentHabitFilter = pill.dataset.category;
          renderHabits();
          HabitlyAudio.playClick();
        });
      });
    }

    // Todo filters
    if (todoFilterTabs) {
      todoFilterTabs.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          todoFilterTabs.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          currentTodoFilter = pill.dataset.filter;
          renderTodos();
          HabitlyAudio.playClick();
        });
      });
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // MODALS
  // ══════════════════════════════════════════════════════════════════════

  function openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }

  function setupModals() {
    // Add Habit Modal
    const openAddHabitBtn = $('openAddHabitModalBtn');
    if (openAddHabitBtn) openAddHabitBtn.addEventListener('click', () => { openModal(addHabitModal); HabitlyAudio.playClick(); });

    const closeAddHabitBtn = $('closeAddHabitBtn');
    if (closeAddHabitBtn) closeAddHabitBtn.addEventListener('click', () => closeModal(addHabitModal));
    const cancelAddHabitBtn = $('cancelAddHabitBtn');
    if (cancelAddHabitBtn) cancelAddHabitBtn.addEventListener('click', () => closeModal(addHabitModal));

    const createHabitForm = $('createHabitForm');
    if (createHabitForm) {
      createHabitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = $('habitTitleInput').value.trim();
        if (!name) return;

        const selected = document.querySelector('.icon-choice.selected');
        data.habits.push({
          id: generateId(),
          name,
          icon: selected ? selected.dataset.icon : '⚡',
          category: $('habitCategorySelect').value,
          progress: 0,
          target: parseInt($('habitTargetInput').value) || 1,
          unit: $('habitUnitInput').value || 'times',
          points: parseInt($('habitPointsInput').value) || 25,
          streak: 0,
          status: 'active',
          skipReason: '',
        });

        saveData(data);
        closeModal(addHabitModal);
        createHabitForm.reset();
        renderAll();
        showToast(`🎯 New habit "${name}" created!`, 'success');
        HabitlyAudio.playSuccess();
      });
    }

    // Icon Picker
    const iconPicker = $('habitIconPicker');
    if (iconPicker) {
      iconPicker.querySelectorAll('.icon-choice').forEach(icon => {
        icon.addEventListener('click', () => {
          iconPicker.querySelectorAll('.icon-choice').forEach(i => i.classList.remove('selected'));
          icon.classList.add('selected');
          HabitlyAudio.playClick();
        });
      });
    }

    // Skip Habit Modal
    const closeSkipBtn = $('closeSkipHabitBtn');
    if (closeSkipBtn) closeSkipBtn.addEventListener('click', () => closeModal(skipHabitModal));
    const cancelSkipBtn = $('cancelSkipHabitBtn');
    if (cancelSkipBtn) cancelSkipBtn.addEventListener('click', () => closeModal(skipHabitModal));

    const skipReasonSelect = $('skipReasonSelect');
    const skipCustomWrap = $('skipCustomReasonWrap');
    if (skipReasonSelect) {
      skipReasonSelect.addEventListener('change', () => {
        if (skipCustomWrap) skipCustomWrap.style.display = skipReasonSelect.value === 'Custom' ? 'block' : 'none';
      });
    }

    const skipForm = $('skipHabitForm');
    if (skipForm) {
      skipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = $('skipHabitId').value;
        const h = data.habits.find(h => h.id === id);
        if (!h) return;

        let reason = skipReasonSelect.value;
        if (reason === 'Custom') {
          reason = $('skipCustomReasonInput').value.trim() || 'Personal reason';
        }

        h.status = 'skipped';
        h.skipReason = reason;
        saveData(data);
        closeModal(skipHabitModal);
        renderAll();
        showToast(`🛡️ ${h.name} skipped — streak protected!`, 'info');
        HabitlyAudio.playClick();
      });
    }

    // Pause Habit Modal
    const closePauseBtn = $('closePauseHabitBtn');
    if (closePauseBtn) closePauseBtn.addEventListener('click', () => closeModal(pauseHabitModal));
    const cancelPauseBtn = $('cancelPauseHabitBtn');
    if (cancelPauseBtn) cancelPauseBtn.addEventListener('click', () => closeModal(pauseHabitModal));

    const pauseReasonSelect = $('pauseReasonSelect');
    const pauseCustomWrap = $('pauseCustomReasonWrap');
    if (pauseReasonSelect) {
      pauseReasonSelect.addEventListener('change', () => {
        if (pauseCustomWrap) pauseCustomWrap.style.display = pauseReasonSelect.value === 'Custom' ? 'block' : 'none';
      });
    }

    const pauseForm = $('pauseHabitForm');
    if (pauseForm) {
      pauseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = $('pauseHabitId').value;
        const h = data.habits.find(h => h.id === id);
        if (!h) return;

        let reason = pauseReasonSelect.value;
        if (reason === 'Custom') {
          reason = $('pauseCustomReasonInput').value.trim() || 'Life transition';
        }

        h.status = 'paused';
        h.skipReason = reason;
        saveData(data);
        closeModal(pauseHabitModal);
        renderAll();
        showToast(`⏸ ${h.name} paused — ${reason}`, 'info');
        HabitlyAudio.playClick();
      });
    }

    // Level Up Modal
    const closeLevelUpBtn = $('closeLevelUpBtn');
    if (closeLevelUpBtn) closeLevelUpBtn.addEventListener('click', () => closeModal(levelUpModal));

    // Add Reward Modal
    const openRewardBtn = $('openAddRewardModalBtn');
    if (openRewardBtn) openRewardBtn.addEventListener('click', () => { openModal(addRewardModal); HabitlyAudio.playClick(); });
    const closeRewardBtn = $('closeAddRewardBtn');
    if (closeRewardBtn) closeRewardBtn.addEventListener('click', () => closeModal(addRewardModal));
    const cancelRewardBtn = $('cancelAddRewardBtn');
    if (cancelRewardBtn) cancelRewardBtn.addEventListener('click', () => closeModal(addRewardModal));

    const rewardForm = $('createRewardForm');
    if (rewardForm) {
      rewardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = $('rewardTitleInput').value.trim();
        if (!title) return;

        data.rewards.push({
          id: generateId(),
          title,
          desc: $('rewardDescInput').value.trim() || 'A well-deserved reward!',
          emoji: $('rewardEmojiInput').value || '🎁',
          cost: parseInt($('rewardCostInput').value) || 150,
          claimed: false,
        });

        saveData(data);
        closeModal(addRewardModal);
        rewardForm.reset();
        renderAll();
        showToast(`🎁 Reward "${title}" added to vault!`, 'success');
        HabitlyAudio.playSuccess();
      });
    }

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay);
      });
    });
  }

  function openSkipModal(id) {
    $('skipHabitId').value = id;
    openModal(skipHabitModal);
    HabitlyAudio.playClick();
  }

  function openPauseModal(id) {
    $('pauseHabitId').value = id;
    openModal(pauseHabitModal);
    HabitlyAudio.playClick();
  }

  // ══════════════════════════════════════════════════════════════════════
  // SOUND & RESET
  // ══════════════════════════════════════════════════════════════════════

  function setupSoundToggle() {
    if (!soundToggleBtn) return;
    soundToggleBtn.addEventListener('click', () => {
      const enabled = HabitlyAudio.toggle();
      if (soundIconOn) soundIconOn.style.display = enabled ? 'block' : 'none';
      if (soundIconOff) soundIconOff.style.display = enabled ? 'none' : 'block';
    });
  }

  function setupResetBtn() {
    if (!quickResetDataBtn) return;
    quickResetDataBtn.addEventListener('click', () => {
      data = resetData();
      renderAll();
      HabitlyCharts.initChart(data.history);
      HabitlyCharts.renderCalendar();
      showToast('🔄 Demo data reset!', 'info');
      HabitlyAudio.playClick();
    });
  }

  // ══════════════════════════════════════════════════════════════════════
  // SCROLL ANIMATIONS (Reveal on Scroll)
  // ══════════════════════════════════════════════════════════════════════

  function setupScrollAnimations() {
    const sections = document.querySelectorAll('.feature-section');

    // Use IntersectionObserver for scroll reveals
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

      sections.forEach(section => observer.observe(section));
    } else {
      // Fallback: show all
      sections.forEach(s => s.classList.add('visible'));
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // RIPPLE EFFECTS
  // ══════════════════════════════════════════════════════════════════════

  function setupRippleEffects() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-ripple');
      if (!btn) return;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  }

  // ══════════════════════════════════════════════════════════════════════
  // TOAST SYSTEM
  // ══════════════════════════════════════════════════════════════════════

  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️', points: '⚡' };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ── Launch ──
  init();
});
