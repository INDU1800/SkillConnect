import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillconnect';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SkillConnect backend server is healthy and running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Guard: friendly response if MongoDB Atlas is not yet connected
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is not yet connected. Please add your MongoDB Atlas connection string to server/.env and restart the server.',
      databaseStatus: 'disconnected',
    });
  }
  next();
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/requests', requestRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
});

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack || err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'An unexpected server error occurred',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Database Connection & Server Launch
const startServer = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      tlsAllowInvalidCertificates: true,
    });
    console.log(`Connected successfully to MongoDB at: ${MONGO_URI.replace(/:([^:@]+)@/, ':****@')}`);

    app.listen(PORT, () => {
      console.log(`SkillConnect API Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.log('\n======================================================');
    console.log('Action Required: Configure MongoDB Atlas');
    console.log('Please set your MONGO_URI in server/.env with your');
    console.log('MongoDB Atlas connection string.');
    console.log('======================================================\n');

    app.listen(PORT, () => {
      console.log(`SkillConnect API Server listening on http://localhost:${PORT} (Waiting for MongoDB Atlas credentials)`);
    });
  }
};

startServer();
