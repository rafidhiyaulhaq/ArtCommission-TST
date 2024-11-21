// backend/src/models/portfolio.js
const { db } = require('../config/firebase');

const portfolioModel = {
  async create(artistId, portfolioData) {
    try {
      const portfolioRef = db.collection('portfolios').doc();
      await portfolioRef.set({
        ...portfolioData,
        artistId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: portfolioRef.id, ...portfolioData };
    } catch (error) {
      throw error;
    }
  },

  async getByArtistId(artistId) {
    try {
      const snapshot = await db.collection('portfolios')
        .where('artistId', '==', artistId)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },

  async getAllArtists() {
    try {
      const snapshot = await db.collection('users')
        .where('role', '==', 'artist')
        .get();

      const artists = await Promise.all(snapshot.docs.map(async doc => {
        const portfolios = await this.getByArtistId(doc.id);
        return {
          id: doc.id,
          ...doc.data(),
          portfolios
        };
      }));

      return artists;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = portfolioModel;