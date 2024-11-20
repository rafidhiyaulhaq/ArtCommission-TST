// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const { auth, db } = require('../config/firebase');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, fullName } = req.body;

    // Validate role
    if (!['artist', 'client'].includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be either "artist" or "client"' 
      });
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
    const { email } = req.body;
    
    // Get user by email
    const userRecord = await auth.getUserByEmail(email);
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User data not found' });
    }

    const userData = userDoc.data();

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
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    res.json({ user: userData });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;