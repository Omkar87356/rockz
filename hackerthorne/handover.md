# HackerThorne — Project Handover & Feature Documentation

**HackerThorne** is an AI-powered Hackathon Squad Finder & Collaboration Platform designed for collegiate and web3 hackathon ecosystems (e.g., HackMIT, Stanford TreeHacks, ETHGlobal SF). It enables students and developers to discover complementary teammates, recruit missing roles to complete 5-person squads, coordinate sprint tasks, and communicate in real-time.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v24.21.0)
- **Package Manager**: npm (v11.x)

### Running Locally
1. **Install Dependencies**:
   ```bash
   npm install
   # Or on Windows PowerShell:
   npm.cmd install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   # Or on Windows PowerShell:
   npm.cmd run dev
   ```

3. **Open in Browser**:
   - Local: [http://localhost:5173/](http://localhost:5173/)
   - Network: `http://<your-local-ip>:5173/`

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 🛠 Implemented Features

### 1. Squads & Projects Explorer
- **Visual Squad Formation Indicator**: Displays 5-member squad circles for each project (Team Lead, AI/ML, Backend, Frontend, UI/UX, Presenter). Filled slots display confirmed member avatars; missing roles display pulsing slots labeled `+ Needed: [Role]`.
- **Sprint Task Progress Tracker**: Live progress bar calculating completion rates (e.g. `2/5 tasks (40%)`) across active milestones.
- **Search & Multi-Filtering**:
  - Live search input matching project names, descriptions, and required tech stacks.
  - Hackathon event filter (*HackMIT 2026*, *Stanford TreeHacks 2026*, *ETHGlobal SF*, *All*).
  - Missing role filter (filter specifically for teams seeking *Frontend*, *UI/UX*, *Presenter*, etc.).
- **Quick Action Triggers**: Instant modal trigger for **Squad Hub** and **Apply to Squad**.

### 2. Squad Hub & Sprint Task Board Modal
- **Deep-Dive Overview**: Complete breakdown of project goals, hackathon tracks, time commitment, and deadlines.
- **Squad Roster**: Shows all confirmed team members, their assigned roles, university backgrounds, and a 1-click **Chat** button.
- **Smart Role Recommendations**: For every vacant squad role, the system scans the talent directory and highlights the top candidate with their calculated match compatibility score.
- **Interactive Sprint Task Manager**:
  - Checkbox toggle to mark milestones as `completed` or `todo` with automatic strike-through styling.
  - Dynamically add new sprint milestone tasks with instant state persistence.

### 3. Talent Discovery Network
- **Comprehensive Candidate Directory**: Filterable directory of student hackers with avatars, university, academic year, major, availability (e.g., *20 hrs/week*), and bio.
- **Role Badges & Skill Chips**: Displays primary disciplines and secondary roles with syntax-highlighted skill tags (Python, PyTorch, React, Figma, Solidity, etc.).
- **Hackathon Achievement Trophies**: Highlights past hackathon awards (e.g., *1st Place AI Track - CalHacks*, *Best UI/UX - TreeHacks*, *100K Pitch Winner - MIT*).
- **Algorithmic Compatibility Matcher**: Dynamically computes a percentage compatibility score (70% - 98%) between candidates and active hackathon projects based on role requirements, skills overlap, and experience level.
- **Direct Candidate Actions**:
  - **Message**: Opens or creates a private direct message conversation.
  - **Invite to Squad**: Dispatches a formal team invitation.

### 4. AI Squad Builder (Autonomous Matchmaker)
- **Target Project Selector**: Select any active project to trigger automated squad analysis.
- **Autonomous Roster Assembly**: Evaluates all vacant positions and selects the highest-scoring candidate matching each discipline.
- **Visual Dream Team Board**: Side-by-side comparison of active squad members alongside recommended recruits with match synergy indicators.
- **1-Click Bulk Recruitment**: `1-Click Invite All Missing Roles` button automatically dispatches personalized team invitations to every recommended student.

### 5. Inbox & Request Management
- **Dual Tabbed Navigation**: Seamlessly toggle between **Incoming Applications** and **Sent Invitations**.
- **Application Cards**: Displays applicant details, match rating badge, applied role, and personalized pitch note.
- **Accept Workflow**:
  - Adds the applicant directly into the project squad members list.
  - Updates project status and fills the vacant role slot.
  - Automatically posts a celebratory announcement message into the team's group chat channel.
  - Displays a toast notification.
- **Decline Workflow**: Updates request status to `declined`.
- **Dynamic Navbar Counter**: Unread counter badge updates automatically whenever requests are received or reviewed.

### 6. Real-Time Team Chat & Direct Messaging
- **Dual Channel Sidebar**:
  - **Project Squads**: Dedicated `#general` squad channels (e.g., *Smart Campus Assistant Hub*).
  - **Direct Messages**: 1-on-1 private messaging with student peers (e.g., *Maya Patel*, *Devon Miller*).
- **Chat Feed**: Displays sender avatar, author name, timestamp, and distinguishing styling for self vs. teammate messages.
- **Context-Aware Simulated Responses**: Sending messages triggers realistic, contextual replies after a natural delay (800ms) simulating active hackathon teammates.
- **Auto-Scrolling**: Keeps latest messages in view automatically.

### 7. User Perspective Switcher
- **Perspective Dropdown**: Switch active user view directly from the navbar (e.g., *Alex Chen - Lead*, *Maya Patel - UI/UX Applicant*, *Marcus Vance - Frontend*, *Sarah Lin - Pitch Presenter*, *Devon Miller - Backend*).
- **Role Reversals**: Allows testing both project owner flows (reviewing and accepting applicants) and student applicant flows (submitting applications and receiving invitations).

### 8. Project Creation Wizard
- **Modal Creation Form**:
  - Project Title & One-sentence elevator pitch.
  - Hackathon selection & Track/Category input.
  - Time commitment & Submission deadline.
  - Multi-select role checklist (Frontend, Backend, AI/ML, UI/UX, Presenter, Mobile, Cloud/DevOps).
  - Comma-separated tech stack tags.
- **Instant Activation**: Automatically sets the current active user as Squad Captain, generates a dedicated team chat channel, and publishes the project to the explorer.

### 9. State Persistence & Demo Reset
- **LocalStorage Sync**: All project modifications, accepted members, new tasks, dispatched invitations, and chat conversations persist across page refreshes.
- **One-Click Reset**: `Reset Demo Data` button in the navbar instantly restores the initial clean state from `mockData.js`.

### 10. Modern Glassmorphism Design System
- **Curated Color Palette**: Tailored dark mode (`#080c14`, `#0e1526`, `#121a2c`) with electric indigo (`#6366f1`), neon cyan (`#06b6d4`), and emerald accents (`#10b981`).
- **Typography**: Google Fonts pairing featuring **Outfit** (headings), **Inter** (interface copy), and **JetBrains Mono** (tags & metrics).
- **Responsive Layout**: Fluid CSS grid and flexbox supporting desktop, tablet, and mobile breakpoints.
- **Hackathon Season Ticker**: Header strip with live event countdown cards and prize pool metrics for upcoming hackathons.

---

## 📂 Codebase File Structure

| File | Description |
|---|---|
| [`package.json`](file:///c:/Users/999jd/Downloads/hackerthorne/package.json) | NPM project definition, scripts (`dev`, `build`, `preview`), and Vite dependencies |
| [`index.html`](file:///c:/Users/999jd/Downloads/hackerthorne/index.html) | Semantic HTML5 structure, navigation, view panels, modals, and templates |
| [`index.css`](file:///c:/Users/999jd/Downloads/hackerthorne/index.css) | Complete custom Vanilla CSS design system, glassmorphism, animations, and responsive rules |
| [`app.js`](file:///c:/Users/999jd/Downloads/hackerthorne/app.js) | Core ES Module containing state management, match algorithms, UI renderers, and event listeners |
| [`mockData.js`](file:///c:/Users/999jd/Downloads/hackerthorne/mockData.js) | Rich mock dataset: student profiles, hackathon projects, requests, and chat histories |
| [`handover.md`](file:///c:/Users/999jd/Downloads/hackerthorne/handover.md) | Project handover documentation and feature reference manual |

---

## 💡 Recommended Next Extensions
- **Backend API Integration**: Connect state actions to a FastAPI or Express backend with PostgreSQL/MongoDB persistence.
- **WebSocket Gateway**: Replace simulated chat replies with a real-time WebSocket server for multi-user live messaging.
- **GitHub / Devpost OAuth**: Enable authenticating students with their real GitHub profiles and Devpost hackathon project portfolios.
- **Web3 Wallet Connect**: Integrate Wagmi / Viem for ETHGlobal identity verification and bounty payouts.
