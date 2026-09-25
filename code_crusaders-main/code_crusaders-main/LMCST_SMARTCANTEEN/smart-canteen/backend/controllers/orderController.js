const mongoose = require('mongoose');
const Order = require('../models/Order');

const mockOrders = [
  {
    token: "SC-127",
    studentId: "LM2026CS101",
    studentName: "Amal Krishna",
    department: "CS",
    items: [
      { id: "f1", name: "Masala Dosa", price: 50, quantity: 2 },
      { id: "f10", name: "Tea", price: 15, quantity: 1 }
    ],
    total: 115,
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "Completed",
    departureTime: "11:04 AM",
    arrivalTime: "11:09 AM",
    status: "Preparing",
    createdAt: new Date()
  },
  {
    token: "SC-128",
    studentId: "LM2026AI104",
    studentName: "Diya Thomas",
    department: "CS WITH AI",
    items: [
      { id: "f6", name: "Chicken Biriyani", price: 100, quantity: 1 },
      { id: "f12", name: "Fresh Lime", price: 25, quantity: 1 }
    ],
    total: 125,
    paymentMethod: "Cash at Canteen",
    paymentStatus: "Pending",
    departureTime: "11:02 AM",
    arrivalTime: "11:07 AM",
    status: "Ready",
    createdAt: new Date(Date.now() - 300000)
  }
];

exports.createOrder = async (req, res) => {
  try {
    const { studentId, studentName, department, items, total, paymentMethod, departureTime, arrivalTime } = req.body;

    const tokenNumber = Math.floor(100 + Math.random() * 900);
    const token = `SC-${tokenNumber}`;

    if (mongoose.connection.readyState !== 1) {
      const newOrder = {
        token,
        studentId,
        studentName,
        department,
        items,
        total,
        paymentMethod,
        paymentStatus: (paymentMethod && paymentMethod.includes('UPI')) ? 'Completed' : 'Pending',
        departureTime: departureTime || '11:04 AM',
        arrivalTime: arrivalTime || '11:09 AM',
        status: 'Preparing',
        createdAt: new Date()
      };
      mockOrders.unshift(newOrder);
      return res.status(201).json({
        success: true,
        message: 'Food reservation confirmed',
        order: newOrder,
        mode: 'mock'
      });
    }

    const newOrder = new Order({
      token,
      studentId,
      studentName,
      department,
      items,
      total,
      paymentMethod,
      paymentStatus: paymentMethod.includes('UPI') ? 'Completed' : 'Pending',
      departureTime: departureTime || '11:04 AM',
      arrivalTime: arrivalTime || '11:09 AM',
      status: 'Preparing'
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Food reservation confirmed',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: mockOrders.length, orders: mockOrders, mode: 'mock' });
    }
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrdersByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (mongoose.connection.readyState !== 1) {
      const orders = mockOrders.filter(o => o.studentId === studentId);
      return res.json({ success: true, orders, mode: 'mock' });
    }
    const orders = await Order.find({ studentId }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { token } = req.params;
    const { status } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const order = mockOrders.find(o => o.token === token);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order token not found' });
      }
      order.status = status;
      return res.json({ success: true, message: `Status updated to ${status}`, order, mode: 'mock' });
    }

    const order = await Order.findOneAndUpdate(
      { token },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order token not found' });
    }

    res.json({ success: true, message: `Status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
