require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lmc_smart_canteen';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Order.deleteMany({});

    // Seed Users
    await User.create([
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
        assignedDeparture: "11:04 AM",
        assignedArrival: "11:09 AM"
      },
      {
        id: "LMC-STAFF-04",
        password: "staff",
        role: "staff",
        name: "Ramesh Nair",
        department: "Canteen Operations",
        year: "Supervisor",
        class: "Kitchen Head"
      },
      {
        id: "LMC-ADMIN-01",
        password: "admin",
        role: "admin",
        name: "Dr. Jacob Kurian",
        department: "Executive Board",
        year: "Director",
        class: "Campus Admin"
      }
    ]);

    // Seed Menu Items
    await MenuItem.create([
      { id: "f1", name: "Masala Dosa", category: "breakfast", price: 50, isVeg: true, description: "Crispy crepe with spiced potato masala", inStock: true, dailyStock: 60, isPopular: true },
      { id: "f2", name: "Plain Dosa", category: "breakfast", price: 40, isVeg: true, description: "Golden crispy thin crepe", inStock: true, dailyStock: 45 },
      { id: "f3", name: "Idli", category: "breakfast", price: 30, isVeg: true, description: "Set of 2 soft steamed rice cakes with sambar", inStock: true, dailyStock: 50 },
      { id: "f4", name: "Vada", category: "breakfast", price: 25, isVeg: true, description: "Crispy spiced medu vada", inStock: true, dailyStock: 65, isPopular: true },
      { id: "f5", name: "Veg Meals", category: "meals", price: 70, isVeg: true, description: "Wholesome Kerala noon meals with matta rice", inStock: true, dailyStock: 40, isPopular: true },
      { id: "f6", name: "Chicken Biriyani", category: "meals", price: 100, isVeg: false, description: "Malabar dum biriyani with chicken", inStock: true, dailyStock: 35, isPopular: true },
      { id: "f7", name: "Veg Sandwich", category: "snacks", price: 45, isVeg: true, description: "Toasted vegetable sandwich", inStock: true, dailyStock: 30 },
      { id: "f8", name: "Puffs", category: "snacks", price: 25, isVeg: true, description: "Flaky Kerala bakery puff pastry", inStock: true, dailyStock: 70, isPopular: true },
      { id: "f9", name: "Samosa", category: "snacks", price: 20, isVeg: true, description: "Crispy triangular potato samosa", inStock: true, dailyStock: 40 },
      { id: "f10", name: "Tea", category: "beverages", price: 15, isVeg: true, description: "Hot Kerala brewed cardamom chai", inStock: true, dailyStock: 120, isPopular: true },
      { id: "f11", name: "Coffee", category: "beverages", price: 20, isVeg: true, description: "South Indian frothy filter coffee", inStock: true, dailyStock: 80 },
      { id: "f12", name: "Fresh Lime", category: "beverages", price: 25, isVeg: true, description: "Chilled fresh lime juice with mint", inStock: true, dailyStock: 50 },
      { id: "f13", name: "Juice", category: "beverages", price: 30, isVeg: true, description: "Freshly squeezed seasonal fruit juice", inStock: true, dailyStock: 45, isPopular: true }
    ]);

    console.log('✅ Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
