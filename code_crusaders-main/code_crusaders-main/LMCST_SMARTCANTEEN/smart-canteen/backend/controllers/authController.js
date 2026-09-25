const mongoose = require('mongoose');
const User = require('../models/User');

const mockUsers = [
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
    assignedArrival: "11:09 AM"
  },
  {
    id: "LM2026AI104",
    password: "pass",
    role: "student",
    name: "Diya Thomas",
    department: "CS WITH AI",
    departmentFull: "Artificial Intelligence & Data Science",
    year: "3rd Year",
    class: "AI-A",
    group: "Group B",
    breakStart: "11:00 AM",
    breakEnd: "11:15 AM",
    assignedDeparture: "11:02 AM",
    assignedArrival: "11:07 AM"
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
    assignedArrival: "11:11 AM"
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
];

exports.login = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res.status(400).json({ success: false, message: 'Please provide ID and password' });
    }

    if (mongoose.connection.readyState !== 1) {
      const user = mockUsers.find(u => u.id.toLowerCase() === id.trim().toLowerCase());
      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          department: user.department,
          departmentFull: user.departmentFull,
          year: user.year,
          class: user.class,
          group: user.group,
          breakStart: user.breakStart,
          breakEnd: user.breakEnd,
          assignedDeparture: user.assignedDeparture,
          assignedArrival: user.assignedArrival
        },
        mode: 'mock'
      });
    }

    const user = await User.findOne({ id: id.trim() });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        department: user.department,
        departmentFull: user.departmentFull,
        year: user.year,
        class: user.class,
        group: user.group,
        breakStart: user.breakStart,
        breakEnd: user.breakEnd,
        assignedDeparture: user.assignedDeparture,
        assignedArrival: user.assignedArrival
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const user = mockUsers.find(u => u.id.toLowerCase() === id.toLowerCase());
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, user, mode: 'mock' });
    }
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, users: mockUsers.map(({ password, ...u }) => u), mode: 'mock' });
    }
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
