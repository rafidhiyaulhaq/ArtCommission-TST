// backend/src/routes/commission.js
const express = require('express');
const router = express.Router();
const validateServiceAuth = require('../middleware/serviceAuth');
const { paymentService, emailService } = require('../services/externalServices');
const { db } = require('../config/firebase'); // Tambahkan import db

// Get all commissions
router.get('/', validateServiceAuth, async (req, res) => {
  try {
    const commissions = await db.collection('commissions').get();
    const commissionsData = commissions.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({
      message: 'Commissions retrieved successfully',
      commissions: commissionsData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get commissions by artist
router.get('/artist/:artistId', validateServiceAuth, async (req, res) => {
  try {
    const artistCommissions = await db.collection('commissions')
      .where('artistId', '==', req.params.artistId)
      .get();

    const commissionsData = artistCommissions.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({
      message: 'Artist commissions retrieved successfully',
      commissions: commissionsData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get commissions by client
router.get('/client/:clientId', validateServiceAuth, async (req, res) => {
  try {
    const clientCommissions = await db.collection('commissions')
      .where('clientId', '==', req.params.clientId)
      .get();

    const commissionsData = clientCommissions.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({
      message: 'Client commissions retrieved successfully',
      commissions: commissionsData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get commission by ID
router.get('/:id', validateServiceAuth, async (req, res) => {
  try {
    const commission = await db.collection('commissions').doc(req.params.id).get();
    if (!commission.exists) {
      return res.status(404).json({ error: 'Commission not found' });
    }

    res.status(200).json({
      message: 'Commission retrieved successfully',
      commission: {
        id: commission.id,
        ...commission.data()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new commission
router.post('/create', validateServiceAuth, async (req, res) => {
  try {
    const { artistId, clientId, amount, description, email } = req.body;

    // Validate required fields
    if (!artistId || !clientId || !amount || !description || !email) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    // Get artist data for email
    const artistDoc = await db.collection('users').doc(artistId).get();
    if (!artistDoc.exists) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    const artistEmail = artistDoc.data().email;

    // Create commission record
    const commissionData = {
      artistId,
      clientId,
      amount,
      description,
      email, // Add client email to commission data
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to database
    const commissionRef = await db.collection('commissions').add(commissionData);

    // Process payment
    const paymentResult = await paymentService.processPayment({
      orderId: commissionRef.id,
      amount: amount,
      currency: 'USD',
      description: `Commission payment for ${description}`
    });

    // Update commission with payment info
    await commissionRef.update({
      paymentId: paymentResult.id,
      paymentStatus: paymentResult.status
    });

    // Send confirmation emails
    await Promise.all([
      emailService.sendEmail({
        to: email,
        subject: 'Commission Order Confirmation',
        body: `Your commission order for ${description} has been created. Order ID: ${commissionRef.id}`
      }),
      emailService.sendEmail({
        to: artistEmail,
        subject: 'New Commission Request',
        body: `You have received a new commission request for ${description}. Order ID: ${commissionRef.id}`
      })
    ]);

    res.status(201).json({
      message: 'Commission created successfully',
      commission: {
        id: commissionRef.id,
        ...commissionData
      },
      payment: paymentResult
    });
  } catch (error) {
    console.error('Commission creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update commission details
router.put('/:id', validateServiceAuth, async (req, res) => {
  try {
    const { description, amount } = req.body;
    const commissionId = req.params.id;
    const updateData = {};

    if (description) updateData.description = description;
    if (amount) updateData.amount = amount;
    updateData.updatedAt = new Date().toISOString();

    await db.collection('commissions').doc(commissionId).update(updateData);

    res.status(200).json({
      message: 'Commission updated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update commission status
router.put('/:id/status', validateServiceAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const commissionId = req.params.id;

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status'
      });
    }

    const commission = await db.collection('commissions').doc(commissionId).get();
    if (!commission.exists) {
      return res.status(404).json({ error: 'Commission not found' });
    }

    const commissionData = commission.data();

    // Update commission
    await db.collection('commissions').doc(commissionId).update({
      status,
      updatedAt: new Date().toISOString()
    });

    // Send status update email
    await emailService.sendEmail({
      to: commissionData.email,
      subject: 'Commission Status Update',
      body: `Your commission status has been updated to: ${status}`
    });

    res.status(200).json({
      message: 'Commission status updated successfully',
      status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get commission statistics
router.get('/stats/summary', validateServiceAuth, async (req, res) => {
  try {
    const commissions = await db.collection('commissions').get();
    const stats = {
      total: commissions.size,
      totalAmount: 0,
      byStatus: {
        pending: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0
      }
    };

    commissions.forEach(doc => {
      const commission = doc.data();
      stats.totalAmount += commission.amount;
      stats.byStatus[commission.status]++;
    });

    res.status(200).json({
      message: 'Statistics retrieved successfully',
      statistics: stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel commission
router.post('/:id/cancel', validateServiceAuth, async (req, res) => {
  try {
    const commissionId = req.params.id;
    const commission = await db.collection('commissions').doc(commissionId).get();

    if (!commission.exists) {
      return res.status(404).json({ error: 'Commission not found' });
    }

    const commissionData = commission.data();

    // Only allow cancellation of pending or in_progress commissions
    if (!['pending', 'in_progress'].includes(commissionData.status)) {
      return res.status(400).json({
        error: 'Cannot cancel commission in current status'
      });
    }

    // Process refund if payment was made
    if (commissionData.paymentId) {
      await paymentService.processRefund({
        paymentId: commissionData.paymentId,
        amount: commissionData.amount
      });
    }

    // Get artist email
    const artistDoc = await db.collection('users').doc(commissionData.artistId).get();
    const artistEmail = artistDoc.data().email;

    // Update commission status
    await db.collection('commissions').doc(commissionId).update({
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
      cancelledAt: new Date().toISOString()
    });

    // Send cancellation emails
    await Promise.all([
      emailService.sendEmail({
        to: commissionData.email,
        subject: 'Commission Cancelled',
        body: `Your commission order (ID: ${commissionId}) has been cancelled.`
      }),
      emailService.sendEmail({
        to: artistEmail,
        subject: 'Commission Cancelled',
        body: `Commission order (ID: ${commissionId}) has been cancelled.`
      })
    ]);

    res.status(200).json({
      message: 'Commission cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;