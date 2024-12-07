// frontend/src/services/commission.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_KEY = process.env.REACT_APP_API_KEY;

export const commissionService = {
  // Get all commissions
  async getAllCommissions() {
    try {
      const response = await fetch(`${API_URL}/commission`, {
        headers: {
          'x-api-key': API_KEY,
          'x-service-name': 'web-service'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch commissions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching commissions:', error);
      throw error;
    }
  },

  // Get commission by ID
  async getCommissionById(id) {
    try {
      const response = await fetch(`${API_URL}/commission/${id}`, {
        headers: {
          'x-api-key': API_KEY,
          'x-service-name': 'web-service'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch commission');
      return await response.json();
    } catch (error) {
      console.error('Error fetching commission:', error);
      throw error;
    }
  },

  // Get artist's commissions
  async getArtistCommissions(artistId) {
    try {
      const response = await fetch(`${API_URL}/commission/artist/${artistId}`, {
        headers: {
          'x-api-key': API_KEY,
          'x-service-name': 'web-service'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch artist commissions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching artist commissions:', error);
      throw error;
    }
  },

  // Get client's commissions
  async getClientCommissions(clientId) {
    try {
      const response = await fetch(`${API_URL}/commission/client/${clientId}`, {
        headers: {
          'x-api-key': API_KEY,
          'x-service-name': 'web-service'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch client commissions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching client commissions:', error);
      throw error;
    }
  },

  // Create new commission
  async createCommission(commissionData) {
    try {
      const response = await fetch(`${API_URL}/commission/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'x-service-name': 'web-service'
        },
        body: JSON.stringify(commissionData)
      });
      if (!response.ok) throw new Error('Failed to create commission');
      return await response.json();
    } catch (error) {
      console.error('Error creating commission:', error);
      throw error;
    }
  },

  // Update commission details
  async updateCommission(commissionId, updateData) {
    try {
      const response = await fetch(`${API_URL}/commission/${commissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'x-service-name': 'web-service'
        },
        body: JSON.stringify(updateData)
      });
      if (!response.ok) throw new Error('Failed to update commission');
      return await response.json();
    } catch (error) {
      console.error('Error updating commission:', error);
      throw error;
    }
  },

  // Update commission status
  async updateCommissionStatus(commissionId, status) {
    try {
      const response = await fetch(`${API_URL}/commission/${commissionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'x-service-name': 'web-service'
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update commission status');
      return await response.json();
    } catch (error) {
      console.error('Error updating commission status:', error);
      throw error;
    }
  },

  // Cancel commission
  async cancelCommission(commissionId) {
    try {
      const response = await fetch(`${API_URL}/commission/${commissionId}/cancel`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'x-service-name': 'web-service'
        }
      });
      if (!response.ok) throw new Error('Failed to cancel commission');
      return await response.json();
    } catch (error) {
      console.error('Error cancelling commission:', error);
      throw error;
    }
  },

  // Get commission statistics
  async getStatistics() {
    try {
      const response = await fetch(`${API_URL}/commission/stats/summary`, {
        headers: {
          'x-api-key': API_KEY,
          'x-service-name': 'web-service'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch statistics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Helper method to format commission data
  formatCommissionData(data) {
    return {
      ...data,
      createdAt: new Date(data.createdAt).toLocaleDateString(),
      updatedAt: new Date(data.updatedAt).toLocaleDateString(),
      amount: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(data.amount)
    };
  },

  // Helper method to validate commission data
  validateCommissionData(data) {
    const errors = {};
    if (!data.artistId) errors.artistId = 'Artist ID is required';
    if (!data.clientId) errors.clientId = 'Client ID is required';
    if (!data.amount || data.amount <= 0) errors.amount = 'Valid amount is required';
    if (!data.description) errors.description = 'Description is required';
    if (!data.email) errors.email = 'Email is required';
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

export default commissionService;