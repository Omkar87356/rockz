# Habitly Pro OS (v3.5.0) — Master Project Handover Document

**Generated:** 2026-09-26 | **Status:** Production Ready & Active | **Local Server:** [http://localhost:8081](http://localhost:8081)

---

## 1. EXECUTIVE SUMMARY & SYSTEM OVERVIEW

**Habitly Pro OS** is an ultra-modern, gamified personal development, habit optimization, and **AI-powered biometric body development system** built with React 18 and TypeScript. 

It combines two powerful paradigms into a single unified web experience:
1. **AAA Futuristic Anime RPG System**: Everyday habits, tasks, and routines are transformed into active quests where consistency awards XP, unlocks skill nodes, increases player rank, and levels up life attributes (Strength, Intelligence, Vitality, Focus, Dexterity, Endurance).
2. **Bio-Sync AI Health & Body Development Suite**: A comprehensive, medical-grade personal body development companion that monitors physiological vitals, tracks weight trajectories with interactive SVG charts, generates adaptive 7-day workout and nutritional plans, manages safe health milestones, and provides real-time conversational coaching through *"Your AI Health & Fitness Assistant"*.

### Visual Identity & Aesthetics
- **Theme**: Futuristic Cyberpunk / Holographic HUD / Anime RPG Interface.
- **Color Palette**:
  - Deep Space Voids: `#020611`, `#040C1A`, `#071020`
  - Neon Cyan (`#00E5FF`): Primary interactive telemetry, accents, progress fills
  - Neon Violet (`#7C3AED` / `#B794F4`): AI protocol panels, mental focus, circadian recovery
  - Emerald Green (`#00FF9C`): Optimal vital health, completions, positive trends
  - Flame Red (`#FF3366`): Critical alerts, heart rates, streak counters
  - Amber Gold (`#FFB800`): Spark points, nutritional fats, warning thresholds
- **Typography**:
  - Primary Headings & Ranks: `Orbitron`, `Rajdhani`, `Space Grotesk`
  - Telemetry Numbers & Timestamps: `JetBrains Mono`
  - General Body: `Inter`
- **Atmosphere**: Glassmorphic panels, animated scanlines, pulsing telemetry dots, glowing hex nodes, and cybernetic borders.

---

## 2. TECH STACK & SYSTEM ARCHITECTURE

| Layer | Technology | Details |
|---|---|---|
| **UI Framework** | React 18.3.1 | Production UMD build loaded via CDN in `index.html` |
| **Language** | TypeScript 5.4.5 + ESNext | Strong typing across habits, vitals, check-ins, and plans |
| **Build Pipeline** | Vite 5.4.21 (Library Mode) | Compiles `src/main.tsx` to self-executing IIFE bundle `dist/habitly.bundle.js` |
| **Styling** | Vanilla CSS (Modular) | Master styling in `src/styles/main.css` + `src/styles/health.css` (4,500+ lines) |
| **State Management** | React Context API | Dual-engine: `HabitlyContext.tsx` (RPG habits) & `HealthContext.tsx` (Bio-Sync) |
| **Persistence** | Browser Local Storage | Isolated client-side sandboxes (`habitly_data_v3`, `habitly_health_data_v1`) |
| **Local Server** | PowerShell HTTP Listener | `server.ps1` with automatic fallback to port `8081` |
| **Automated Testing** | Node.js + Puppeteer (Edge) | Headless browser validation scripts for DOM, interactions & responsiveness |

---

## 3. COMPLETE FILE STRUCTURE

```
sadaf/
├── index.html                               # High-speed entry point: Google Fonts + CDN React + IIFE bundle
├── server.ps1                               # Local PowerShell HTTP server (ports 8080/8081)
├── vite.config.ts                           # Vite configuration with production process.env injection
├── tsconfig.json                            # TypeScript configuration
├── package.json                             # Dependencies & build scripts
├── handover.md                              # THIS MASTER HANDOVER DOCUMENT
├── test_render.cjs                          # Automated headless Edge render test
├── test_interaction.cjs                     # Automated interactive flow & responsiveness test
├── dist/
│   ├── habitly.bundle.js                    # Compiled production JavaScript bundle (252 KB)
│   └── style.css                            # Compiled bundle CSS (123 KB)
├── src/
│   ├── main.tsx                             # React 18 DOM mount entry
│   ├── App.tsx                              # Main layout, observer scroll spy, ripple listener & modals
│   ├── types/
│   │   ├── index.ts                         # Core RPG types, Habit categories, ActiveSection
│   │   └── health.ts                        # Bio-Sync types (Profile, Check-Ins, Goals, Plans, Metrics, Insights)
│   ├── context/
│   │   ├── HabitlyContext.tsx               # State store for Quests, XP, Levels, Inventory & Schedule
│   │   └── HealthContext.tsx                # State store for Biometrics, Vitals, Check-Ins & AI Chat
│   ├── services/
│   │   └── aiHealthService.ts               # Contextual AI health generation engine & provider abstraction
│   ├── utils/
│   │   ├── healthCalculations.ts            # Clinical algorithms (BMI, Mifflin BMR, TDEE, BP/HR, validations)
│   │   ├── storage.ts                       # Local storage persistence helpers & mock seeds
│   │   ├── sound.ts                         # Web Audio API 8-bit & synth sound generator
│   │   └── confetti.ts                      # Level-up canvas particle engine
│   ├── components/
│   │   ├── Navigation.tsx                   # Sidebar HUD with 'BIO-SYNC AI' item & active indicators
│   │   ├── Topbar.tsx                       # Top telemetry bar with dynamic 'BMI // Weight' pill
│   │   ├── CommandCenter.tsx                # System dashboard & AI protocol directive panel
│   │   ├── StatusScreen.tsx                 # Holographic character status, HP/MP/EXP & attributes
│   │   ├── FocusQuest.tsx                   # Deep flow combat chamber & countdown timer
│   │   ├── HabitTracker.tsx                 # Gamified Quest Board with streak tracking
│   │   ├── SkillTree.tsx                    # Tech-tree UI for habit unlocks and specializations
│   │   ├── ProgressionTimeline.tsx          # Cybernetic spinal level path and achievement checkpoints
│   │   ├── ScheduleArchitect.tsx            # Daily time-blocking calendar
│   │   ├── WidgetDock.tsx                   # PWA & HUD dock integration
│   │   ├── SmartReminderCenter.tsx          # Intelligent reminder manager
│   │   ├── TodoHub.tsx                      # Rapid tactical task checklists
│   │   ├── AnalyticsHub.tsx                 # Consistency radar charts and completion metrics
│   │   ├── RewardVault.tsx                  # Spark Point inventory store
│   │   ├── NotificationDrawer.tsx           # Telemetry alert drawer
│   │   ├── ToastNotifications.tsx           # Floating cyberpunk toast messages
│   │   ├── health/
│   │   │   ├── HealthSection.tsx            # Master Bio-Sync section with 5 sub-tab views
│   │   │   ├── HealthOverview.tsx           # 8-card vital telemetry grid & interactive SVG multi-metric chart
│   │   │   ├── HealthInsightsSection.tsx    # Live classification badges (Recorded, Calculated, AI, Clinical)
│   │   │   ├── HealthPlanView.tsx           # 7-day adaptive workout routine, nutrition & circadian recovery
│   │   │   ├── HealthGoalsView.tsx          # Milestone tracker with safe progress bounds
│   │   │   ├── HealthAIChat.tsx             # "Your AI Health & Fitness Assistant" conversational agent
│   │   │   ├── HealthCheckInHistory.tsx     # Chronological telemetry table with audit logs
│   │   │   └── modals/
│   │   │       ├── HealthProfileModal.tsx   # 4-step onboarding wizard with unit toggles (Metric/Imperial)
│   │   │       ├── DailyCheckInModal.tsx    # Fast 60-second telemetry check-in dialog
│   │   │       └── PrivacySettingsModal.tsx # Zero-exposure local isolation, JSON export & purge controls
│   │   └── modals/
│   │       ├── AddHabitModal.tsx            # New Quest creator modal
│   │       ├── AddScheduleModal.tsx         # Schedule block creator
│   │       ├── AddReminderModal.tsx         # Reminder scheduler
│   │       ├── AddRewardModal.tsx           # Custom reward creator
│   │       ├── SkipHabitModal.tsx           # Quest skip with reason logging
│   │       ├── PauseHabitModal.tsx          # Quest pause/freeze modal
│   │       ├── WidgetGuideModal.tsx         # HUD widget guide
│   │       ├── LevelUpModal.tsx             # RPG level-up celebration modal
│   │       └── QuestCompleteModal.tsx       # Quest clear celebration popup
│   └── styles/
│       ├── health.css                       # Comprehensive Bio-Sync AI health design system
│       └── main.css                         # Master RPG stylesheet (linked to health.css)
```

---

## 4. DETAILED SPECIFICATION: BIO-SYNC AI HEALTH SUITE

### 4.1 Personal Health Profile & 4-Step Onboarding Wizard
- **Component**: `src/components/health/modals/HealthProfileModal.tsx`
- **Fields Captured**:
  1. *Identity & Physical*: Name, Age (12–120), Sex (Male/Female/Other), Height, Current Weight, Target Weight.
  2. *Vitals & Body Composition*: Resting Heart Rate (BPM), Blood Pressure (Systolic/Diastolic), Body Fat % (optional), Waist circumference (optional).
  3. *Lifestyle & Targets*: Activity Level (Sedentary, Light, Moderate, Active, Very Active), Daily Step Target (1,000–50,000), Nightly Sleep Target (4–14 hrs), Daily Water Target.
  4. *Goals & Nutrition*: Primary Fitness Goal, Fitness Experience Level (Beginner, Intermediate, Advanced), Exercise Frequency (2–6 days/week), Dietary Preference (Omnivore, Vegetarian, Vegan, Pescatarian, Keto, Paleo, Mediterranean, Low-Carb), Allergies/Intolerances, and Medical Considerations.
- **Unit Standards**:
  - Height: `cm` ⟷ `ft & in` (automatic bidirectional conversion)
  - Weight: `kg` ⟷ `lb`
  - Water: `L` ⟷ `oz`
  - Waist: `cm` ⟷ `in`
  - Blood Pressure: `mmHg` | Heart Rate: `BPM`
- **Strict Validation**: Validated via `validateHealthProfile()` in `healthCalculations.ts` to block physiological impossibilities.

### 4.2 Telemetry Dashboard & Interactive Charts
- **Component**: `src/components/health/HealthOverview.tsx`
- **8 Primary Vital Cards**:
  1. *Current Weight vs Target Weight*: Displays weight, delta remaining, and visual completion track.
  2. *Calculated BMI*: Value, category badge, and interactive visual slider gauge with screening disclaimer.
  3. *Resting Heart Rate*: Pulsing vital icon, BPM, status badge, and clinical advice.
  4. *Blood Pressure*: Systolic/Diastolic readout, AHA clinical classification, and physician advisory flags.
  5. *Body Composition*: Dual split-view of body-fat percentage and waistline measurement.
  6. *Daily Steps*: Real-time progress bar towards daily cadence target with estimated kilometer conversion.
  7. *Sleep Recovery*: Nightly sleep duration vs target with slow-wave/REM restoration notes.
  8. *Hydration Status*: Daily water intake vs calculated metabolic target.
- **Interactive SVG Trajectory Matrix**:
  - Switch metrics dynamically: Weight, Resting HR, Blood Pressure (dual systolic/diastolic curves), Sleep, Steps, and Hydration.
  - Timeframe filters: `7D`, `14D`, and `30D`.
  - Tooltips display exact date and measurement on hover.
- **Action Bar**: Instant 1-click buttons for `+ Daily Check-In`, `Edit Profile`, `View Plan`, and `Ask AI`.
- **Prominent Clinical Notice**: Standard disclaimer noting that calculations are screening tools and not medical diagnoses.

### 4.3 Automated AI Insights Engine
- **Component**: `src/components/health/HealthInsightsSection.tsx`
- **Classification Protocol**:
  - `[RECORDED DATA]` (Neon Cyan): Direct observations from user logs (e.g., weight changes over 14/30 days).
  - `[CALCULATED METRIC]` (Violet): Mathematical physiological baselines (Mifflin-St Jeor BMR, activity TDEE).
  - `[AI SUGGESTION]` (Emerald): Actionable training, recovery, and hydration optimizations.
  - `[CLINICAL ADVISORY]` (Flame Red): Triage alerts recommending professional medical consultation if blood pressure or heart rate is out of normal range.

### 4.4 Personalized Development Plan
- **Component**: `src/components/health/HealthPlanView.tsx`
- **Three Core Pillars**:
  1. *Workout Routine*: 7-day schedule with detailed exercise tables (Exercise name, Sets, Reps, Rest intervals, Biomechanical cues), cardio engine suggestions, and mobility flows.
     - *Experience Adaptations*: Toggle between `Beginner`, `Intermediate`, and `Advanced` directives.
  2. *Nutrition & Fueling*: Target caloric breakdown (calibrated for surplus/deficit based on goal), protein target (~1.6–2.0g/kg), carbohydrates, and healthy fats.
     - Structured 4-meal architecture (Breakfast, Lunch, Pre/Post Workout, Dinner) with food suggestions matching the user's dietary preferences (Omnivore, Vegetarian, Vegan, Keto, etc.) and allergy filters.
  3. *Recovery & Sleep*: Circadian sleep architecture (morning sunlight, caffeine curfew, thermal cooldown), active recovery days, and daily decompression flows.
- **Live Regeneration**: Includes **"Regenerate Protocol"** with an optional custom prompt box (e.g., *"Focus on chest hypertrophy, only 3 days available"*).

### 4.5 Daily Telemetry Check-In
- **Component**: `src/components/health/modals/DailyCheckInModal.tsx` & `src/components/health/HealthCheckInHistory.tsx`
- **Fast Daily Logging**:
  - Date selector, Scale weight, Resting HR, Blood pressure, Sleep hours, Daily step count, Water intake, Workout completed checkbox + details, Subjective mood (Great, Good, Neutral, Tired, Stressed), Physical energy slider (1–10), and Biofeedback notes.
  - Instantly updates dashboard vital cards, interactive charts, and AI insights.
- **Audit Table**: Chronological table displaying all recorded check-ins with per-row deletion.

### 4.6 Strategic Health Milestones
- **Component**: `src/components/health/HealthGoalsView.tsx`
- **Goal Categories**: Weight, Muscle, Strength, Cardio, Steps, Sleep, Hydration, Consistency.
- **Safety Boundaries**: Flags extreme cuts (>1.2 kg/week), restricts dangerously low targets (<35 kg), and promotes sustainable progression.

### 4.7 "Your AI Health & Fitness Assistant"
- **Component**: `src/components/health/HealthAIChat.tsx`
- **Conversational Assistant**:
  - Synchronized with active user telemetry (displays live Weight, BMI, TDEE, BP, and HR badges).
  - Pre-populated Quick Directives:
    - *"Create a workout for today."*
    - *"Why has my weight changed this week?"*
    - *"How can I improve my sleep?"*
    - *"Give me a beginner leg workout."*
    - *"What should I focus on this week?"*
    - *"Help me stay consistent."*
    - *"Show me my progress this month."*
  - Contextual intelligence: accurately references recorded measurements without hallucinating false medical data.
  - Clinical safety footer included on all health inquiries.

### 4.8 Data Sovereignty & Privacy Controls
- **Component**: `src/components/health/modals/PrivacySettingsModal.tsx`
- **Privacy Architecture**:
  - **Zero-Exposure Local Isolation**: Health telemetry is stored solely in client-side localStorage under `habitly_health_data_v1`. No third-party ad tracking or cross-user exposure.
  - **Data Portability**: Full JSON export capability (`Download JSON`).
  - **Irreversible Purge**: Two-step confirmation to completely erase all personal health data and check-in history from the device.
  - **Non-Diagnostic Policy**: Clear disclaimer stating the AI provides general wellness education, not medical prescriptions.

---

## 5. MATHEMATICAL & CLINICAL FORMULAS

### 5.1 Body Mass Index (BMI)
$$\text{BMI} = \frac{\text{Weight (kg)}}{\left(\frac{\text{Height (cm)}}{100}\right)^2}$$
- **Underweight**: $< 18.5$
- **Normal Weight**: $18.5 - 24.9$
- **Overweight**: $25.0 - 29.9$
- **Obesity Class I**: $30.0 - 34.9$
- **Obesity Class II+**: $\ge 35.0$
*Note: Labeled strictly as a population screening metric, noting it does not distinguish between skeletal muscle mass and adipose tissue.*

### 5.2 Basal Metabolic Rate (BMR) — Mifflin-St Jeor
- **Male**: $\text{BMR} = 10 \times \text{Weight (kg)} + 6.25 \times \text{Height (cm)} - 5 \times \text{Age} + 5$
- **Female**: $\text{BMR} = 10 \times \text{Weight (kg)} + 6.25 \times \text{Height (cm)} - 5 \times \text{Age} - 161$

### 5.3 Total Daily Energy Expenditure (TDEE)
$$\text{TDEE} = \text{BMR} \times \text{Activity Multiplier}$$
- Sedentary: $1.2$
- Light Activity: $1.375$
- Moderate Activity: $1.55$
- Active: $1.725$
- Very Active: $1.9$

### 5.4 Blood Pressure Clinical Ranges (AHA Guidelines)
- **Normal**: Systolic $< 120$ AND Diastolic $< 80\text{ mmHg}$
- **Elevated**: Systolic $120–129$ AND Diastolic $< 80\text{ mmHg}$
- **Stage 1**: Systolic $130–139$ OR Diastolic $80–89\text{ mmHg}$
- **Stage 2**: Systolic $\ge 140$ OR Diastolic $\ge 90\text{ mmHg}$ *(Triggers healthcare consultation advisory)*
- **Hypertensive Crisis**: Systolic $> 180$ AND/OR Diastolic $> 120\text{ mmHg}$ *(Triggers immediate medical attention advisory)*
- **Low Pressure**: Systolic $< 90$ OR Diastolic $< 60\text{ mmHg}$

---

## 6. SERVER SETUP & BUILD INSTRUCTIONS

### 6.1 Running the Local Server
The project includes a lightweight PowerShell HTTP server (`server.ps1`):
```powershell
# Run the local server
powershell -ExecutionPolicy Bypass -File .\server.ps1

# The server automatically detects port availability:
# Primary: http://localhost:8080
# Fallback: http://localhost:8081
```

### 6.2 Compiling TypeScript Files
Whenever you modify files in `src/`, compile the updated bundle with Vite:
```powershell
# Using npm
npm run build

# Or direct with npx
npx vite build
```
*Vite compiles the 52 modules in ~700ms into `dist/habitly.bundle.js`.*

### 6.3 Running Automated Regression Tests
Two headless Microsoft Edge automated test scripts are included in the repository:
```powershell
# Test 1: Verify DOM mounting, assets 200 OK, and absence of browser console errors
node test_render.cjs

# Test 2: Verify tab switching, modal opening, AI prompt dispatch, and mobile responsiveness
node test_interaction.cjs
```

---

## 7. AUTOMATED VERIFICATION RESULTS

| Test Suite | Target | Result | Details |
|---|---|---|---|
| **Vite Production Bundler** | `dist/habitly.bundle.js` | **`PASS`** | 52 modules transformed in 696ms, 0 errors |
| **HTTP Asset Health** | `http://localhost:8081` | **`HTTP 200`** | `index.html`, `bundle.js`, `main.css`, `health.css` |
| **DOM Mount Verification** | `#root` & `#health` | **`PASS`** | Instant fallback hands off to React tree |
| **Vital Cards Count** | `.health-card` | **`PASS`** | 8 cards rendered with live metrics |
| **Interactive SVG Chart** | `.health-metric-svg` | **`PASS`** | Smooth path gradients, data circles & tooltips |
| **Tab Controller** | `.health-nav-tab` | **`PASS`** | All 5 tabs (Dashboard, Plan, Goals, Chat, Check-Ins) active |
| **AI Assistant Chat** | `.chat-messages-stream` | **`PASS`** | Quick prompt dispatch triggers rich contextual response |
| **Mobile Responsiveness** | Viewport: 375×667 | **`PASS`** | Single-column cards, horizontal scroll ribbons, zero overflow |

---

## 8. FUTURE ROADMAP & EXTENSION POINTS

1. **External LLM Provider Integration**:
   The abstraction layer in `src/services/aiHealthService.ts` (`AIHealthProvider`) is ready to connect directly to external endpoints (OpenAI, Google Gemini, or Anthropic) via a secure backend proxy without leaking API keys to client-side code.
2. **Wearable BLE Synchronization**:
   Can be extended with the Web Bluetooth API to read real-time heart rate monitors and smart scales.
3. **PWA Offline Service Worker**:
   The existing `WidgetDock.tsx` HUD integration can be bundled with a Service Worker cache to allow 100% offline daily check-in logging.

---

*Handover documentation maintained and verified for Habitly Pro OS (v3.5.0).*
