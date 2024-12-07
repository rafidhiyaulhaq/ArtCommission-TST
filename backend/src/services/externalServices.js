// backend/src/services/externalServices.js
const API_KEYS = require('../config/apiConfig');

const paymentService = {
  async processPayment(paymentData) {
    try {
      const response = await fetch('https://api.payment-service.com/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEYS['payment-service']
        },
        body: JSON.stringify(paymentData)
      });
      return await response.json();
    } catch (error) {
      throw new Error('Payment service error');
    }
  }
};

const emailService = {
  async sendEmail(emailData) {
    try {
      const response = await fetch('https://api.email-service.com/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEYS['email-service']
        },
        body: JSON.stringify(emailData)
      });
      return await response.json();
    } catch (error) {
      throw new Error('Email service error');
    }
  }
};

module.exports = {
  paymentService,
  emailService
};