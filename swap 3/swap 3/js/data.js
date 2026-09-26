/* ==========================================================================
   HABITLY — Data Store & State Management
   LocalStorage persistence, defaults, gamification tiers
   ========================================================================== */

const STORAGE_KEY = 'habitly_data_v3';

const LEVEL_TIERS = [
  { level: 1, title: 'Beginner', xpNeeded: 150 },
  { level: 2, title: 'Apprentice', xpNeeded: 300 },
  { level: 3, title: 'Disciplined', xpNeeded: 600 },
  { level: 4, title: 'Habit Crusher', xpNeeded: 1000 },
  { level: 5, title: 'Elite Performer', xpNeeded: 1500 },
  { level: 6, title: 'Master Architect', xpNeeded: 2200 },
  { level: 7, title: 'Legendary', xpNeeded: 3000 },
  { level: 8, title: 'Transcendent', xpNeeded: 4500 },
  { level: 9, title: 'Apex', xpNeeded: 6500 },
  { level: 10, title: 'Immortal', xpNeeded: 10000 },
];

const QUOTES = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "What you do every day matters more than what you do once in a while.", author: "Gretchen Rubin" },
];

function getDefaultData() {
  return {
    habits: [
      { id: 'h1', name: 'Drink Water', icon: '💧', category: 'health', progress: 5, target: 8, unit: 'glasses', points: 20, streak: 12, status: 'active', skipReason: '' },
      { id: 'h2', name: 'Morning Run', icon: '🏃', category: 'fitness', progress: 1, target: 1, unit: 'session', points: 30, streak: 8, status: 'active', skipReason: '' },
      { id: 'h3', name: 'Read 20 Pages', icon: '📚', category: 'learning', progress: 15, target: 20, unit: 'pages', points: 25, streak: 14, status: 'active', skipReason: '' },
      { id: 'h4', name: 'Meditate', icon: '🧘', category: 'mindset', progress: 1, target: 1, unit: 'session', points: 20, streak: 6, status: 'active', skipReason: '' },
      { id: 'h5', name: 'Code Practice', icon: '💻', category: 'productivity', progress: 2, target: 3, unit: 'problems', points: 35, streak: 10, status: 'active', skipReason: '' },
      { id: 'h6', name: 'Healthy Meals', icon: '🍎', category: 'health', progress: 2, target: 3, unit: 'meals', points: 25, streak: 5, status: 'active', skipReason: '' },
    ],
    todos: [
      { id: 't1', text: 'Complete quarterly report presentation', priority: 'urgent', done: false, points: 50 },
      { id: 't2', text: 'Review and merge pull requests', priority: 'high', done: true, points: 30 },
      { id: 't3', text: 'Schedule dentist appointment', priority: 'normal', done: false, points: 15 },
      { id: 't4', text: 'Prepare meal plan for the week', priority: 'normal', done: true, points: 20 },
      { id: 't5', text: 'Reply to important emails', priority: 'high', done: false, points: 25 },
    ],
    rewards: [
      { id: 'r1', title: 'Movie Night', desc: 'Watch a movie guilt-free after a productive day', emoji: '🎬', cost: 120, claimed: false },
      { id: 'r2', title: '1hr Gaming Session', desc: 'Play your favorite game as a reward', emoji: '🎮', cost: 150, claimed: false },
      { id: 'r3', title: 'Takeout Dinner', desc: 'Order your favorite restaurant meal', emoji: '🍕', cost: 200, claimed: false },
      { id: 'r4', title: 'Sleep In Day', desc: 'Earn a luxurious sleep-in morning', emoji: '🛌', cost: 100, claimed: false },
      { id: 'r5', title: 'New Book Purchase', desc: 'Buy that book from your wishlist', emoji: '📖', cost: 250, claimed: false },
      { id: 'r6', title: 'Weekend Adventure', desc: 'Plan a mini day trip or outing', emoji: '🏔️', cost: 500, claimed: false },
    ],
    profile: {
      name: 'Alex Vance',
      points: 1450,
      totalXp: 450,
      level: 3,
      streak: 12,
      bestStreak: 14,
    },
    // 7-day history for charts
    history: [
      { day: 'Mon', completion: 72, points: 145 },
      { day: 'Tue', completion: 85, points: 210 },
      { day: 'Wed', completion: 60, points: 120 },
      { day: 'Thu', completion: 92, points: 260 },
      { day: 'Fri', completion: 78, points: 185 },
      { day: 'Sat', completion: 88, points: 230 },
      { day: 'Sun', completion: 82, points: 195 },
    ],
    // Calendar heatmap data (day of month -> intensity 0-4)
    calendarHeat: {},
  };
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to handle schema upgrades
      const def = getDefaultData();
      return { ...def, ...parsed };
    }
  } catch (e) { console.warn('Failed to load stored data:', e); }
  return getDefaultData();
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { console.warn('Failed to save data:', e); }
}

function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  return getDefaultData();
}

function getLevelInfo(totalXp) {
  let accumulated = 0;
  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    const tier = LEVEL_TIERS[i];
    if (totalXp < accumulated + tier.xpNeeded) {
      return {
        level: tier.level,
        title: tier.title,
        currentXp: totalXp - accumulated,
        maxXp: tier.xpNeeded,
        progress: ((totalXp - accumulated) / tier.xpNeeded) * 100,
      };
    }
    accumulated += tier.xpNeeded;
  }
  const last = LEVEL_TIERS[LEVEL_TIERS.length - 1];
  return { level: last.level, title: last.title, currentXp: last.xpNeeded, maxXp: last.xpNeeded, progress: 100 };
}

function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
