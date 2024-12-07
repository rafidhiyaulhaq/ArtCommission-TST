// backend/src/routes/commission.js
const express = require('express');
const router = express.Router();
const validateServiceAuth = require('../middleware/serviceAuth');
const { paymentService, emailService } = require('../services/externalServices');

// Protected route yang membutuhkan service authentication
router.post('/create', validateServiceAuth, async (req, res) => {
  try {
    // Process payment
    const paymentResult = await paymentService.processPayment({
      amount: req.body.amount,
      currency: 'USD'
    });

    // Send confirmation email
    await emailService.sendEmail({
      to: req.body.email,
      subject: 'Commission Order Confirmation',
      body: 'Your commission order has been created.'
    });

    res.status(201).json({
      message: 'Commission created successfully',
      payment: paymentResult
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;