// backend/routes/authRoutes.js
// Routes for user registration, login, and fetching current user profile

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/authController');
const { authHandler } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/me', authHandler, getMe);

module.exports = router;
