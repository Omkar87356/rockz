/**
 * Lourdes Matha College Smart Canteen — Static Data & Realistic Demo Database
 * Contains realistic Kerala campus food menu, department schedules,
 * demo credentials, financial statements, and crowd telemetry.
 */

const CANTEEN_DATA = {
  // College Information
  college: {
    name: "Lourdes Matha College",
    tagline: "Smart Food • Smart Queue • Smart Campus",
    archdiocese: "Owned & Managed by the Archdiocese of Changanassery",
    breakWindow: "11:00 AM – 11:15 AM",
    walkingTimeMinutes: 5,
    canteenCapacity: 100
  },

  // Demo User Profiles & Credentials (Section 2 & 3)
  users: [
    {
      id: "LM2026CS101",
      password: "pass",
      role: "student",
      name: "Amal Krishna",
      department: "CS",
      departmentFull: "Computer Science",
      year: "2nd Year",
      class: "CS-B",
      group: "Group C",
      breakStart: "11:00 AM",
      breakEnd: "11:15 AM",
      assignedDeparture: "11:04 AM",
      assignedArrival: "11:09 AM",
      avatarText: "AK"
    },
    {
      id: "LM2026AI104",
      password: "pass",
      role: "student",
      name: "Diya Thomas",
      department: "CS WITH AI",
      departmentFull: "CS with Artificial Intelligence",
      year: "3rd Year",
      class: "AI-A",
      group: "Group B",
      breakStart: "11:00 AM",
      breakEnd: "11:15 AM",
      assignedDeparture: "11:03 AM",
      assignedArrival: "11:08 AM",
      avatarText: "DT"
    },
    {
      id: "LM2026EC202",
      password: "pass",
      role: "student",
      name: "Rahul Mathew",
      department: "EC",
      departmentFull: "Electronics & Communication",
      year: "4th Year",
      class: "EC-A",
      group: "Group D",
      breakStart: "11:00 AM",
      breakEnd: "11:15 AM",
      assignedDeparture: "11:06 AM",
      assignedArrival: "11:11 AM",
      avatarText: "RM"
    },
    {
      id: "LMC-STAFF-04",
      password: "staff",
      role: "staff",
      name: "Ramesh Nair",
      department: "Canteen Operations",
      departmentFull: "Kitchen & Dining Operations",
      year: "Supervisor",
      class: "Counter 1",
      avatarText: "RN"
    },
    {
      id: "LMC-ADMIN-01",
      password: "admin",
      role: "admin",
      name: "Dr. Jacob Kurian",
      department: "Executive Board",
      departmentFull: "Canteen Administration Committee",
      year: "Director",
      class: "Campus Admin",
      avatarText: "JK"
    }
  ],

  // 8 College Departments with Staggered Departure Windows (Section 6)
  departments: [
    {
      code: "CS",
      name: "Computer Science",
      breakTime: "11:00 AM – 11:15 AM",
      studentsCount: 120,
      departureWindow: "11:04 AM",
      expectedArrival: "11:09 AM",
      walkingMinutes: 5,
      group: "Group C",
      impact: "🟢 LOW (Post-Opening Wave)"
    },
    {
      code: "CS WITH AI",
      name: "CS with Artificial Intelligence",
      breakTime: "11:00 AM – 11:15 AM",
      studentsCount: 80,
      departureWindow: "11:02 AM",
      expectedArrival: "11:07 AM",
      walkingMinutes: 5,
      group: "Group B",
      impact: "🟢 LOW (Early Stagger)"
    },
    {
      code: "EC",
      name: "Electronics & Communication",
      breakTime: "11:00 AM – 11:15 AM",
      studentsCount: 90,
      departureWindow: "11:06 AM",
      expectedArrival: "11:11 AM",
      walkingMinutes: 5,
      group: "Group D",
      impact: "🟡 MEDIUM (Mid-Recess)"
    },
    {
      code: "EEE",
      name: "Electrical & Electronics",
      breakTime: "11:00 AM – 11:15 AM",
      studentsCount: 70,
      departureWindow: "11:08 AM",
      expectedArrival: "11:13 AM",
      walkingMinutes: 5,
      group: "Group E",
      impact: "🟢 LOW (Closing Wave)"
    },
    {
      code: "ME",
      name: "Mechanical Engineering",
      breakTime: "11:00 AM – 11:15 AM",
      studentsCount: 95,
      departureWindow: "11:00 AM",
      expectedArrival: "11:05 AM",
      walkingMinutes: 5,
      group: "Group A",
      impact: "🟡 MEDIUM (First Inflow)"
    },
    {
      code: "CIVIL",
      name: "Civil Engineering",
      breakTime: "11:00 AM – 11:15 AM",
      studentsCount: 60,
      departureWindow: "11:01 AM",
      expectedArrival: "11:06 AM",
      walkingMinutes: 5,
      group: "Group A+",
      impact: "🟢 LOW (Direct Path)"
    },
    {
      code: "ARTS",
      name: "Arts & Science Stream",
      breakTime: "11:00 AM – 11:15 AM",
      studentsCount: 85,
      departureWindow: "11:05 AM",
      expectedArrival: "11:10 AM",
      walkingMinutes: 5,
      group: "Group C+",
      impact: "🟢 LOW"
    },
    {
      code: "HOTEL MANAGEMENT",
      name: "Hotel Management & Catering",
      breakTime: "11:00 AM – 11:15 AM",
      studentsCount: 40,
      departureWindow: "11:07 AM",
      expectedArrival: "11:12 AM",
      walkingMinutes: 5,
      group: "Group D+",
      impact: "🟢 LOW"
    }
  ],

  // 13 Food Menu Items with Realistic Photography (Section 7)
  menu: [
    {
      id: "f1",
      name: "Masala Dosa",
      category: "breakfast",
      price: 50,
      isVeg: true,
      description: "Crispy fermented golden crepe stuffed with spiced potato masala, served with coconut chutney & Kerala sambar.",
      image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 60,
      soldCount: 37,
      isPopular: true
    },
    {
      id: "f2",
      name: "Plain Dosa",
      category: "breakfast",
      price: 40,
      isVeg: true,
      description: "Traditional thin, golden-crisp rice and lentil crepe served steaming hot with fresh coconut chutney & tomato chutney.",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 45,
      soldCount: 22,
      isPopular: false
    },
    {
      id: "f3",
      name: "Idli",
      category: "breakfast",
      price: 30,
      isVeg: true,
      description: "Set of 2 soft and fluffy steamed rice-lentil cakes accompanied by hot Kerala vegetable sambar & fresh ground chutney.",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 50,
      soldCount: 28,
      isPopular: false
    },
    {
      id: "f4",
      name: "Vada",
      category: "breakfast",
      price: 25,
      isVeg: true,
      description: "Crispy medu vada made with spiced urad dal batter, green chillies, curry leaves, and cracked black pepper.",
      image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 65,
      soldCount: 42,
      isPopular: true
    },
    {
      id: "f5",
      name: "Veg Meals",
      category: "meals",
      price: 70,
      isVeg: true,
      description: "Wholesome Kerala noon meals served with Matta rice, sambar, thoran, avial, rasam, curd, and crispy pappadam.",
      image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 40,
      soldCount: 28,
      isPopular: true
    },
    {
      id: "f6",
      name: "Chicken Biriyani",
      category: "meals",
      price: 100,
      isVeg: false,
      description: "Fragrant Malabar kaima rice dum biriyani layered with tender spiced chicken, fried onions, cashews, raisins, raita & pickle.",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 35,
      soldCount: 30,
      isPopular: true
    },
    {
      id: "f7",
      name: "Veg Sandwich",
      category: "snacks",
      price: 45,
      isVeg: true,
      description: "Fresh toasted sandwich stuffed with cucumber, tomato slices, spiced mint chutney, and mild pepper potato stuffing.",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 30,
      soldCount: 16,
      isPopular: false
    },
    {
      id: "f8",
      name: "Puffs",
      category: "snacks",
      price: 25,
      isVeg: true,
      description: "Golden flaky Kerala bakery puff pastry filled with caramelised onion and spiced vegetable masala, freshly baked.",
      image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 70,
      soldCount: 48,
      isPopular: true
    },
    {
      id: "f9",
      name: "Samosa",
      category: "snacks",
      price: 20,
      isVeg: true,
      description: "Crispy triangular golden crust filled with spiced potatoes, green peas, cumin, and fresh coriander.",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 40,
      soldCount: 12,
      isPopular: false
    },
    {
      id: "f10",
      name: "Tea",
      category: "beverages",
      price: 15,
      isVeg: true,
      description: "Authentic hot Kerala 'Chaya' brewed with strong tea dust, fresh milk, and cardamom, meter-frothed.",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 120,
      soldCount: 95,
      isPopular: true
    },
    {
      id: "f11",
      name: "Coffee",
      category: "beverages",
      price: 20,
      isVeg: true,
      description: "Aromatic South Indian style filter coffee with frothy decoction and steamed fresh milk.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 80,
      soldCount: 52,
      isPopular: false
    },
    {
      id: "f12",
      name: "Fresh Lime",
      category: "beverages",
      price: 25,
      isVeg: true,
      description: "Chilled fresh lime juice with mint sprigs, rock salt or sugar syrup — instant campus refresher.",
      image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 50,
      soldCount: 34,
      isPopular: false
    },
    {
      id: "f13",
      name: "Juice",
      category: "beverages",
      price: 30,
      isVeg: true,
      description: "Freshly squeezed seasonal fruit juice (Watermelon / Orange) served cold without preservatives.",
      image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 45,
      soldCount: 32,
      isPopular: true
    }
  ],

  // Live Orders in Kitchen Queue (Section 13)
  initialOrders: [
    {
      token: "SC-127",
      studentId: "LM2026CS101",
      studentName: "Amal Krishna",
      department: "CS",
      items: [
        { name: "Masala Dosa", qty: 2, price: 50 },
        { name: "Tea", qty: 1, price: 15 }
      ],
      total: 115,
      paymentMethod: "Cash at Canteen",
      arrivalTime: "11:09 AM",
      departureTime: "11:04 AM",
      status: "Preparing", // Reservation Confirmed -> Preparing -> Ready -> Collected
      timestamp: "10:55 AM",
      prepRemainingSeconds: 455
    },
    {
      token: "SC-126",
      studentId: "LM2026AI104",
      studentName: "Diya Thomas",
      department: "CS WITH AI",
      items: [
        { name: "Chicken Biriyani", qty: 1, price: 100 },
        { name: "Fresh Lime", qty: 1, price: 25 }
      ],
      total: 125,
      paymentMethod: "UPI / Google Pay",
      arrivalTime: "11:08 AM",
      departureTime: "11:03 AM",
      status: "Ready",
      timestamp: "10:48 AM",
      prepRemainingSeconds: 0
    },
    {
      token: "SC-125",
      studentId: "LM2026EC202",
      studentName: "Rahul Mathew",
      department: "EC",
      items: [
        { name: "Puffs", qty: 2, price: 25 },
        { name: "Coffee", qty: 1, price: 20 }
      ],
      total: 70,
      paymentMethod: "Cash at Canteen",
      arrivalTime: "11:11 AM",
      departureTime: "11:06 AM",
      status: "Pending",
      timestamp: "10:52 AM",
      prepRemainingSeconds: 520
    },
    {
      token: "SC-124",
      studentId: "LM2026ME112",
      studentName: "George Varghese",
      department: "ME",
      items: [
        { name: "Veg Meals", qty: 1, price: 70 },
        { name: "Juice", qty: 1, price: 30 }
      ],
      total: 100,
      paymentMethod: "UPI / Google Pay",
      arrivalTime: "11:05 AM",
      departureTime: "11:00 AM",
      status: "Collected",
      timestamp: "10:42 AM",
      prepRemainingSeconds: 0
    },
    {
      token: "SC-123",
      studentId: "LM2026CV089",
      studentName: "Ananya Nair",
      department: "CIVIL",
      items: [
        { name: "Idli", qty: 1, price: 30 },
        { name: "Vada", qty: 1, price: 25 },
        { name: "Tea", qty: 1, price: 15 }
      ],
      total: 70,
      paymentMethod: "Cash at Canteen",
      arrivalTime: "11:06 AM",
      departureTime: "11:01 AM",
      status: "Collected",
      timestamp: "10:39 AM",
      prepRemainingSeconds: 0
    }
  ],

  // Student Notifications (Section 12)
  notifications: [
    {
      id: "n1",
      icon: "🔔",
      title: "Classroom Departure Window Approaching",
      body: "Your assigned departure from CS Block is at 11:04 AM. Please pack your books.",
      time: "2 mins ago",
      type: "orange",
      read: false
    },
    {
      id: "n2",
      icon: "🍳",
      title: "Kitchen is Preparing Order SC-127",
      body: "Chef has placed 2 Masala Dosas on the griddle. Tea will be poured upon arrival.",
      time: "5 mins ago",
      type: "blue",
      read: false
    },
    {
      id: "n3",
      icon: "👥",
      title: "Current Canteen Crowd Status: LOW",
      body: "Dining hall occupancy is currently 43%. No seat waiting expected.",
      time: "9 mins ago",
      type: "green",
      read: false
    },
    {
      id: "n4",
      icon: "⏰",
      title: "Break Time Reminder",
      body: "Morning break: 11:00 AM – 11:15 AM. 15 minutes total duration.",
      time: "15 mins ago",
      type: "muted",
      read: true
    }
  ],

  // Staff Food Demand Prediction (Section 14 & 18)
  foodDemand: [
    {
      name: "Masala Dosa",
      planned: 40,
      prepared: 40,
      expectedDemand: 35,
      sold: 37,
      remaining: 3,
      wastePct: "7.5%",
      readyStock: 8,
      kitchenAction: "Plate next batch at 11:02 AM"
    },
    {
      name: "Veg Meals",
      planned: 25,
      prepared: 25,
      expectedDemand: 20,
      sold: 21,
      remaining: 4,
      wastePct: "16.0%",
      readyStock: 6,
      kitchenAction: "Keep warm in bain-marie"
    },
    {
      name: "Chicken Biriyani",
      planned: 30,
      prepared: 30,
      expectedDemand: 15,
      sold: 28,
      remaining: 2,
      wastePct: "6.6%",
      readyStock: 5,
      kitchenAction: "Dum sealed; serve hot"
    },
    {
      name: "Puffs",
      planned: 30,
      prepared: 30,
      expectedDemand: 25,
      sold: 27,
      remaining: 3,
      wastePct: "10.0%",
      readyStock: 12,
      kitchenAction: "Oven tray ready"
    },
    {
      name: "Tea",
      planned: 50,
      prepared: 50,
      expectedDemand: 45,
      sold: 46,
      remaining: 4,
      wastePct: "8.0%",
      readyStock: 15,
      kitchenAction: "Brewing fresh boiler"
    },
    {
      name: "Juice",
      planned: 35,
      prepared: 35,
      expectedDemand: 30,
      sold: 32,
      remaining: 3,
      wastePct: "8.5%",
      readyStock: 9,
      kitchenAction: "Chilled in dispensers"
    }
  ],

  // Crowd Flow Data: Time vs Number of Students (Section 17)
  crowdFlow: {
    labels: ["10:55 AM", "11:00 AM", "11:05 AM", "11:10 AM", "11:15 AM", "11:20 AM"],
    withStaggering: [20, 35, 65, 40, 15, 8],
    withoutStaggering: [5, 110, 185, 95, 25, 4],
    capacityLimit: [100, 100, 100, 100, 100, 100]
  },

  // Admin Financial Statement (Section 15 & 16)
  financials: {
    revenue: {
      today: 18450,
      yesterday: 16400,
      week: 112300,
      month: 485600,
      foodSales: 17850,
      beverageSales: 600
    },
    expenses: {
      today: 11250,
      foodCost: 7800,
      staffCost: 1500,
      electricity: 850,
      maintenance: 600,
      other: 500
    },
    profit: {
      today: 7200,
      marginPct: "39.0%"
    },
    operational: {
      totalOrders: 326,
      studentsServed: 301,
      foodWastePct: "8%",
      peakTime: "11:05 AM",
      avgWaitMinutes: 4.2
    }
  }
};
