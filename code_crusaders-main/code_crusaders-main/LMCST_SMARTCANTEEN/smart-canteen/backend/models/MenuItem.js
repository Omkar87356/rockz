const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['breakfast', 'meals', 'snacks', 'beverages'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  inStock: {
    type: Boolean,
    default: true
  },
  dailyStock: {
    type: Number,
    default: 50
  },
  soldCount: {
    type: Number,
    default: 0
  },
  isPopular: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
