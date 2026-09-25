const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lmc_smart_canteen';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Mount API routes
app.use('/api', apiRoutes);

// Root route serves the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Database connection & Server initialization
mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2500 })
  .then(() => {
    console.log('✅ Connected to MongoDB successfully (lmc_smart_canteen)');
    app.listen(PORT, () => {
      console.log(`🚀 Lourdes Matha College Smart Canteen server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection failed. Running server with fallback mock handling:', err.message);
    app.listen(PORT, () => {
      console.log(`🚀 Lourdes Matha College Smart Canteen server running in local mock mode on http://localhost:${PORT}`);
    });
  });
