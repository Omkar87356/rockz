const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const mockMenuItems = [
  { id: "f1", name: "Masala Dosa", category: "breakfast", price: 50, isVeg: true, description: "Crispy crepe with spiced potato masala", inStock: true, dailyStock: 60, isPopular: true },
  { id: "f2", name: "Plain Dosa", category: "breakfast", price: 40, isVeg: true, description: "Golden crispy thin crepe", inStock: true, dailyStock: 45 },
  { id: "f3", name: "Idli", category: "breakfast", price: 30, isVeg: true, description: "Set of 2 soft steamed rice cakes with sambar", inStock: true, dailyStock: 50 },
  { id: "f4", name: "Vada", category: "breakfast", price: 25, isVeg: true, description: "Crispy spiced medu vada", inStock: true, dailyStock: 65, isPopular: true },
  { id: "f5", name: "Veg Meals", category: "meals", price: 70, isVeg: true, description: "Wholesome Kerala noon meals with matta rice", inStock: true, dailyStock: 40, isPopular: true },
  { id: "f6", name: "Chicken Biriyani", category: "meals", price: 100, isVeg: false, description: "Malabar dum biriyani with chicken", inStock: true, dailyStock: 35, isPopular: true },
  { id: "f7", name: "Veg Sandwich", category: "snacks", price: 45, isVeg: true, description: "Toasted vegetable sandwich", inStock: true, dailyStock: 30 },
  { id: "f8", name: "Puffs", category: "snacks", price: 25, isVeg: true, description: "Crispy bakery style vegetable puffs", inStock: true, dailyStock: 50, isPopular: true },
  { id: "f9", name: "Samosa", category: "snacks", price: 20, isVeg: true, description: "Crispy fried pastry with spiced potato filling", inStock: true, dailyStock: 60, isPopular: true },
  { id: "f10", name: "Tea", category: "beverages", price: 15, isVeg: true, description: "Freshly brewed Kerala milk chaya", inStock: true, dailyStock: 150, isPopular: true },
  { id: "f11", name: "Coffee", category: "beverages", price: 20, isVeg: true, description: "Hot South Indian filter coffee", inStock: true, dailyStock: 80, isPopular: true },
  { id: "f12", name: "Fresh Lime", category: "beverages", price: 25, isVeg: true, description: "Chilled fresh lime juice with mint", inStock: true, dailyStock: 50 },
  { id: "f13", name: "Juice", category: "beverages", price: 30, isVeg: true, description: "Seasonal fresh fruit juice", inStock: true, dailyStock: 40 }
];

exports.getMenu = async (req, res) => {
  try {
    const { category } = req.query;
    if (mongoose.connection.readyState !== 1) {
      let filtered = mockMenuItems;
      if (category) filtered = mockMenuItems.filter(i => i.category === category);
      return res.json({ success: true, count: filtered.length, items: filtered, mode: 'mock' });
    }
    const filter = category ? { category } : {};
    const items = await MenuItem.find(filter);
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const newItem = { id: `f${mockMenuItems.length + 1}`, ...req.body };
      mockMenuItems.push(newItem);
      return res.status(201).json({ success: true, item: newItem, mode: 'mock' });
    }
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.status(201).json({ success: true, item: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const idx = mockMenuItems.findIndex(i => i.id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Item not found' });
      mockMenuItems[idx] = { ...mockMenuItems[idx], ...req.body };
      return res.json({ success: true, item: mockMenuItems[idx], mode: 'mock' });
    }
    const item = await MenuItem.findOneAndUpdate({ id }, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
