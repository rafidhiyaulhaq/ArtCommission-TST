// frontend/src/pages/artist/CommissionsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';

const CommissionsPage = () => {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, in-progress, completed

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        // TODO: Implement commission fetching logic
        setCommissions([]);
      } catch (error) {
        console.error('Error fetching commissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, [user]);

  const filteredCommissions = commissions.filter(commission => {
    if (filter === 'all') return true;
    return commission.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold">Commissions</h1>
          <div className="mt-4 md:mt-0">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        {filteredCommissions.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No commissions found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCommissions.map(commission => (
              <div key={commission.id} className="bg-white shadow rounded-lg p-6">
                <p>Commission details will go here</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CommissionsPage;