const mongoose = require('mongoose');

const CrowdLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  timeSlot: {
    type: String, // e.g. "11:05 AM"
    required: true
  },
  activeStudentCount: {
    type: Number,
    required: true
  },
  maxCapacity: {
    type: Number,
    default: 100
  },
  capacityUsedPercentage: {
    type: Number
  },
  estimatedWaitMinutes: {
    type: Number,
    default: 4
  }
});

module.exports = mongoose.model('CrowdLog', CrowdLogSchema);
