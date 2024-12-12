// backend/src/app.js
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const { db } = require('./config/firebase');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
 origin: ['http://localhost:3000', 'https://rafidhiyaulhaq.github.io'],
 credentials: true,
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
 allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

app.use(express.json());

// Test Firebase connection
db.collection('users').get()
 .then(() => console.log('Firebase connected successfully'))
 .catch(err => console.error('Firebase connection error:', err));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get('/health', (req, res) => {
 res.status(200).json({
   status: 'healthy',
   timestamp: new Date().toISOString()
 });
});

// Routes
app.use('/auth', authRoutes);
app.use('/portfolio', portfolioRoutes);

// Root route
app.get('/', (req, res) => {
 res.json({
   message: "Welcome to ArtCommission API",
   version: "1.0",
   documentation: "/api-docs",
   environment: process.env.NODE_ENV || 'development'
 });
});

// Error handling middleware
app.use((err, req, res, next) => {
 console.error('Error:', err.stack);
 
 // Handle different types of errors
 if (err.name === 'ValidationError') {
   return res.status(400).json({
     status: 'error',
     message: 'Validation Error',
     errors: err.errors
   });
 }

 if (err.name === 'UnauthorizedError') {
   return res.status(401).json({
     status: 'error',
     message: 'Unauthorized Access'
   });
 }

 // Default error
 res.status(500).json({
   status: 'error',
   message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
   ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
 });
});

// Handle 404
app.use((req, res) => {
 res.status(404).json({
   status: 'error',
   message: `Route ${req.originalUrl} not found`
 });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
 console.log(`🚀 Server running on port ${PORT}`);
 console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
 console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
 console.log(`🔒 CORS enabled for:`, ['http://localhost:3000', 'https://rafidhiyaulhaq.github.io']);
});

process.on('unhandledRejection', (error) => {
 console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
 console.error('Uncaught Exception:', error);
 process.exit(1);
});

module.exports = app;