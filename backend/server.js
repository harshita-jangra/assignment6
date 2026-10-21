// backend/server.js
// Main entry point for the Express backend server

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middleware
// Configure CORS to allow frontend origin
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Body parser for JSON
app.use(express.json());

// API Routes mounted under /api/...
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Complaint & Helpdesk Ticket System API (PS8)',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

/* =========================================================================
   TODO (Student tasks for remaining assignment requirements):
   - const departmentRoutes = require('./routes/departmentRoutes');
   - const commentRoutes = require('./routes/commentRoutes');
   - app.use('/api/departments', departmentRoutes);
   - app.use('/api/comments', commentRoutes);
   ========================================================================= */

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Listen on configured port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
