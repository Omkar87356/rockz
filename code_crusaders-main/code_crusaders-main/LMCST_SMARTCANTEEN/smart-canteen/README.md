# Lourdes Matha College Smart Canteen

> **Smart Food • Smart Queue • Smart Campus**  
> *Owned & Managed by the Archdiocese of Changanassery*

A modern, responsive campus queue automation and food reservation web application designed specifically for **Lourdes Matha College**.

---

## 🎯 The Core Problem & Solution

During the college break (**11:00 AM – 11:15 AM**), hundreds of students from multiple academic blocks would rush to the canteen at once, creating huge counter bottlenecks and unmanageable queues.

**The Smart Solution:**
1. **Considers 5-Minute Walking Distance:** Students take approximately 5 minutes to walk across campus from classroom blocks to the ground-floor canteen.
2. **Staggers Departure Times within Fixed Break:** Automatically assigns departments and student groups to departure windows (e.g. Group A @ 11:00, Group B @ 11:02, Group C @ 11:04, etc.) while keeping the official break window (11:00 – 11:15 AM) intact.
3. **Pre-Selection & Kitchen Demand:** Students reserve food from class. Kitchen staff view real-time demand batches and fry/brew in exact quantities, cutting food waste from 24% down to 8%.
4. **Physical Dine-In Only:** Students show their digital QR token at the counter, collect their fresh hot food within seconds, and sit comfortably inside the canteen.

---

## 🚀 How to Run the Application

### Option A: Instant Browser Preview (Zero Installation Needed)
Simply open the file in Google Chrome, Microsoft Edge, or any modern browser:
```
c:\Users\SWALIHA\OneDrive\Desktop\project 2\smart-canteen\frontend\index.html
```
*(Or open `project 2/index.html` which redirects automatically)*

All components, live countdown timers, Chart.js analytics, QR code generation, cart checkout, and role switches are fully interactive!

---

### Option B: Node.js + Express Backend Server
When Node.js is installed on your system:
```bash
# 1. Navigate to backend directory
cd "c:\Users\SWALIHA\OneDrive\Desktop\project 2\smart-canteen\backend"

# 2. Install dependencies
npm install

# 3. Seed initial users and Kerala menu items into MongoDB (optional)
npm run seed

# 4. Start the server
npm start
```
The server will start at `http://localhost:5000` and automatically serve both the REST API (`/api/...`) and the frontend web portal.

---

## 🔑 Demo Login Credentials

Click the **auto-fill chips** on the login page or enter manually:

| Role | User ID | Password | Name | Department / Class |
| :--- | :--- | :--- | :--- | :--- |
| **🎓 Student** | `LM2026CS101` | `pass` | Amal Krishna | CS (2nd Year, CS-B) |
| **🎓 Student** | `LM2026AI104` | `pass` | Diya Thomas | CS WITH AI (3rd Year) |
| **🎓 Student** | `LM2026EC202` | `pass` | Rahul Mathew | EC (4th Year) |
| **👨‍🍳 Staff** | `LMC-STAFF-04` | `staff` | Ramesh Nair | Canteen Operations Head |
| **🛡️ Admin** | `LMC-ADMIN-01` | `admin` | Dr. Jacob Kurian | Executive Board Director |

---

## 📱 Walkthrough of the Complete Demo Flow

```
1. Landing Page
   ↓ (Click "Login to Canteen" or "Quick Demo as Student")
2. Login
   ↓ (Auto-fills Amal Krishna, CS 2nd Year)
3. Student Dashboard
   ↓ (Displays "Leave classroom at 11:04 AM", 5-min walk time, and Live Countdown "02:35")
4. Live Crowd Meter
   ↓ (Shows 🟢 LOW crowd, 43% occupied, ~4 min wait time)
5. Menu Browsing
   ↓ (Select Masala Dosa × 2 = ₹100, Tea × 1 = ₹15)
6. Cart & Checkout
   ↓ (Choose Cash at Canteen or Instant UPI simulation)
7. Confirm Food Selection
   ↓ (Generates digital token SC-127 and scannable QR code)
8. Live Order Tracking
   ↓ (Countdown timer 07:35 ticks down; 4-stage visual timeline)
9. Staff Console Integration
   ↓ (Staff sees Token SC-127 in kitchen queue, advances to "Ready")
10. Student Notification
    ↓ ("🔔 Your food is ready for pickup! Proceed to Counter 2")
11. Collect & Dine
    ↓ (Order marked "Collected"; student eats inside canteen dining hall)
12. Admin Intelligence
    ↓ (P&L, ₹18,450 Revenue, ₹7,200 Profit, 8% Waste, Time vs Crowd Graph)
```

---

## 🍛 Authentic Kerala Food Menu (13 Items)

- **Masala Dosa** — ₹50
- **Plain Dosa** — ₹40
- **Idli (Set of 2)** — ₹30
- **Vada** — ₹25
- **Veg Meals (Kerala Sadya style)** — ₹70
- **Chicken Biriyani (Malabar Dum)** — ₹100
- **Veg Sandwich** — ₹45
- **Puffs (Bakery Veg/Egg style)** — ₹25
- **Samosa** — ₹20
- **Tea (Kerala Chaya)** — ₹15
- **Coffee (Filter Coffee)** — ₹20
- **Fresh Lime** — ₹25
- **Juice (Fresh fruit)** — ₹30

---

## 🏛️ Department Staggering Schedule

1. **CS** — Departure: `11:04 AM` → Arrival: `11:09 AM` (Group C)
2. **CS WITH AI** — Departure: `11:02 AM` → Arrival: `11:07 AM` (Group B)
3. **EC** — Departure: `11:06 AM` → Arrival: `11:11 AM` (Group D)
4. **EEE** — Departure: `11:08 AM` → Arrival: `11:13 AM` (Group E)
5. **ME** — Departure: `11:00 AM` → Arrival: `11:05 AM` (Group A)
6. **CIVIL** — Departure: `11:01 AM` → Arrival: `11:06 AM` (Group A+)
7. **ARTS** — Departure: `11:05 AM` → Arrival: `11:10 AM` (Group C+)
8. **HOTEL MANAGEMENT** — Departure: `11:07 AM` → Arrival: `11:12 AM` (Group D+)

---

## 📊 Admin Analytics & Financial Metrics (Demo Values)

- **Today's Revenue:** ₹18,450
- **Today's Expenses:** ₹11,250
  - Raw Materials / Food Cost: ₹7,800
  - Kitchen & Counter Staff: ₹1,500
  - Electricity & Power: ₹850
  - Gas & Maintenance: ₹600
  - Sundry Supplies: ₹500
- **Net Operating Profit:** ₹7,200 (39% Margin)
- **Total Orders:** 326
- **Students Served:** 301
- **Food Waste Rate:** 8%
- **Peak Canteen Time:** 11:05 AM (65 students concurrent)

---

## 📂 Project Structure

```
project 2/
├── index.html                    # Root redirect to Smart Canteen
├── lolipop.md
└── smart-canteen/
    ├── README.md                 # Detailed documentation & guide
    ├── frontend/
    │   ├── index.html            # Single Page Application (all 28 features)
    │   ├── css/
    │   │   └── styles.css        # College design system, responsive styles
    │   └── js/
    │       ├── data.js           # Kerala food menu, demo users, schedules
    │       └── app.js            # State machine, timers, QR generator, Chart.js
    └── backend/
        ├── package.json          # Express, Mongoose, CORS
        ├── server.js             # API server & static file host
        ├── seed.js               # Database seeder
        ├── models/
        │   ├── User.js           # Student/Staff/Admin schema
        │   ├── MenuItem.js       # Food inventory schema
        │   ├── Order.js          # Token, departure, arrival, items
        │   └── CrowdLog.js       # Occupancy telemetry
        ├── controllers/
        │   ├── authController.js
        │   ├── orderController.js
        │   ├── menuController.js
        │   └── analyticsController.js
        └── routes/
            └── api.js            # REST API endpoints
```
