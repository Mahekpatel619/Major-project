require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const { connectDB } = require('./src/config/db');
const { seedIfEmpty } = require('./src/utils/seed');
const errorHandler = require('./src/middleware/errorHandler');
const initChatSocket = require('./src/sockets/chatSocket');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const therapistRoutes = require('./src/routes/therapistRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const availabilityRoutes = require('./src/routes/availabilityRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const packageRoutes = require('./src/routes/packageRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const moodRoutes = require('./src/routes/moodRoutes');
const homeworkRoutes = require('./src/routes/homeworkRoutes');
const riskRoutes = require('./src/routes/riskRoutes');
const { getAvailableSlots } = require('./src/controllers/bookingController');

const app = express();
const server = http.createServer(app);

// Connect to Database (with auto-fallback)
connectDB().then(() => {
  seedIfEmpty().catch((err) => console.error('Auto-seed error:', err));
});

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

initChatSocket(io);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach io to req for controllers that need real-time push
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'UNFAZED Therapist Practice Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/therapist', therapistRoutes);
app.use('/api/therapists', therapistRoutes); // supports GET /api/therapists/:slug
app.use('/api/clients', clientRoutes);
app.use('/api/availability', availabilityRoutes);
app.get('/api/slots/:therapistId', getAvailableSlots);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/risk', riskRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 UNFAZED Backend API Server running on port ${PORT}`);
  console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
});

module.exports = { app, server };
