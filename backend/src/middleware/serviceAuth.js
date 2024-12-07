// backend/src/middleware/serviceAuth.js
const API_KEYS = require('../config/apiConfig');

const validateServiceAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const service = req.headers['x-service-name'];

  if (!apiKey || !service) {
    return res.status(401).json({
      error: 'Service authentication required'
    });
  }

  if (API_KEYS[service] !== apiKey) {
    return res.status(403).json({
      error: 'Invalid service credentials'
    });
  }

  // Tambahkan service info ke request
  req.service = service;
  next();
};

module.exports = validateServiceAuth;