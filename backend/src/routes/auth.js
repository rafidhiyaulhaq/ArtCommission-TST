// backend/src/routes/auth.js
const express = require('express');
const { auth, db } = require('../config/firebase');
const { validateAuth } = require('../middleware/auth');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, fullName } = req.body;

    // Validate role
    if (!['artist', 'client'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be either "artist" or "client"' });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName
    });

    // Create user document in Firestore
    const userData = {
      userId: userRecord.uid,
      email,
      role,
      fullName,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    // Create custom token
    const token = await auth.createCustomToken(userRecord.uid);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user by email
    const userRecord = await auth.getUserByEmail(email);
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    const userData = userDoc.data();

    if (!userData) {
      return res.status(404).json({ error: 'User data not found' });
    }

    // Create custom token
    const token = await auth.createCustomToken(userRecord.uid);

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get current user
router.get('/me', validateAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    res.json({ user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Logout route
router.post('/logout', validateAuth, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;