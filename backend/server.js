require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/categories');
const { seedAdmin, seedInitialData } = require('./seed');

const app = express();

// ─── Connect DB Logic ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/royalghee';

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) return cachedConnection;
  
  try {
    console.log('⏳ Connecting to MongoDB...');
    cachedConnection = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout faster if DB is down
    });
    console.log('✅ MongoDB connected successfully');
    
    // Seeding moved out of here to avoid timeouts on Vercel
    return cachedConnection;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    cachedConnection = null;
    throw err;
  }
};

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// For Vercel (or any environment), ensure DB is connected before handling API routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection error', error: err.message });
  }
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// Root route - specific for health checks
app.get('/api', (req, res) => {
  res.send('👑 Royal Ghee & Sweets API - Production Status: Active');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '👑 Royal Ghee & Sweets API is running' });
});

// Manual Seeding Route (Hit this once after deployment)
app.get('/api/admin/seed-db', async (req, res) => {
  try {
    console.log('🌱 Manual seeding started...');
    await seedAdmin();
    await seedInitialData();
    res.json({ message: '🎉 Database seeded successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Seeding failed', error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ─── Start Server (Local) ─────────────────────────────────────────────────────
// Start server only if not running as a Vercel serverless function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(async () => {
    // Local dev: seed automatically if you want, or just leave it manual
    await seedAdmin();
    await seedInitialData();
    app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
