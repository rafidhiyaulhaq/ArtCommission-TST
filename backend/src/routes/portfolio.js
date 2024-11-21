// backend/src/routes/portfolio.js
const express = require('express');
const router = express.Router();
const { storage } = require('../config/firebase');
const portfolioModel = require('../models/portfolio');
const { validateAuth } = require('../middleware/auth');

// Get all artists with their portfolios
router.get('/artists', async (req, res) => {
  try {
    const artists = await portfolioModel.getAllArtists();
    res.json({ artists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get artist's portfolio
router.get('/:artistId', async (req, res) => {
  try {
    const { artistId } = req.params;
    const portfolios = await portfolioModel.getByArtistId(artistId);
    res.json({ portfolios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add portfolio item
router.post('/', validateAuth, async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const artistId = req.user.uid;

    const portfolioData = {
      title,
      description,
      category,
      price: Number(price),
      imageUrl: req.body.imageUrl || null
    };

    const portfolio = await portfolioModel.create(artistId, portfolioData);
    res.status(201).json({ portfolio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;