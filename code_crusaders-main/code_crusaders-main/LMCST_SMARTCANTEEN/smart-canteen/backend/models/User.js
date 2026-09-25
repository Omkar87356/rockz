const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'staff', 'admin'],
    default: 'student'
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    enum: ['CS', 'CS WITH AI', 'EC', 'EEE', 'ME', 'CIVIL', 'ARTS', 'HOTEL MANAGEMENT', 'Canteen Operations', 'Executive Board'],
    required: true
  },
  departmentFull: {
    type: String
  },
  year: {
    type: String
  },
  class: {
    type: String
  },
  group: {
    type: String,
    default: 'Group C'
  },
  breakStart: {
    type: String,
    default: '11:00 AM'
  },
  breakEnd: {
    type: String,
    default: '11:15 AM'
  },
  assignedDeparture: {
    type: String,
    default: '11:04 AM'
  },
  assignedArrival: {
    type: String,
    default: '11:09 AM'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
