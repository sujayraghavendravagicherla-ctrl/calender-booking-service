const express = require('express');
const { userRoutes } = require('./modules/user/index');
const { meetingRoutes } = require('./modules/meeting/index');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Calendar Booking Service API is running',
    version: '1.0.0'
  });
});

// API Routes
app.use('/users', userRoutes);
app.use('/meetings', meetingRoutes);

// Handle 404 - Route not found
app.use(notFoundHandler);

// Centralized error handling
app.use(errorHandler);

module.exports = app;