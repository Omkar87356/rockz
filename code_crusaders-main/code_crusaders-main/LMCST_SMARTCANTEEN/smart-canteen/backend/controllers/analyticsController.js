exports.getFinancialAnalytics = async (req, res) => {
  res.json({
    success: true,
    data: {
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
  });
};

exports.getCrowdAnalytics = async (req, res) => {
  res.json({
    success: true,
    data: {
      currentOccupancy: 43,
      maxCapacity: 100,
      capacityUsedPct: 43,
      estimatedWaitTime: "4 minutes",
      peakTime: "11:05 AM",
      timeline: [
        { time: "10:55 AM", students: 20 },
        { time: "11:00 AM", students: 35 },
        { time: "11:05 AM", students: 65 },
        { time: "11:10 AM", students: 40 },
        { time: "11:15 AM", students: 15 },
        { time: "11:20 AM", students: 8 }
      ]
    }
  });
};

exports.getDemandAnalytics = async (req, res) => {
  res.json({
    success: true,
    data: [
      { name: "Masala Dosa", planned: 40, prepared: 40, expectedDemand: 35, sold: 37, remaining: 3, wastePct: "7.5%" },
      { name: "Veg Meals", planned: 25, prepared: 25, expectedDemand: 20, sold: 21, remaining: 4, wastePct: "16.0%" },
      { name: "Chicken Biriyani", planned: 30, prepared: 30, expectedDemand: 15, sold: 28, remaining: 2, wastePct: "6.6%" },
      { name: "Puffs", planned: 30, prepared: 30, expectedDemand: 25, sold: 27, remaining: 3, wastePct: "10.0%" },
      { name: "Tea", planned: 50, prepared: 50, expectedDemand: 45, sold: 46, remaining: 4, wastePct: "8.0%" },
      { name: "Juice", planned: 35, prepared: 35, expectedDemand: 30, sold: 32, remaining: 3, wastePct: "8.5%" }
    ]
  });
};
