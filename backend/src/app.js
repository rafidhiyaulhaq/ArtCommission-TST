// backend/src/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/portfolio', portfolioRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to ArtCommission API",
    version: "1.0"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;