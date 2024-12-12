// frontend/src/pages/artist/CommissionsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';

const CommissionsPage = () => {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        setLoading(true);
        // TODO: Fetch commissions from backend
        setCommissions([]);
      } catch (error) {
        console.error('Error fetching commissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">My Commissions</h1>
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : commissions.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-sm font-medium text-gray-900">No commissions yet</h3>
            <p className="mt-1 text-sm text-gray-500">When clients order from you, they'll appear here</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {commissions.map((commission) => (
              <div key={commission.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                {/* Commission details will go here */}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CommissionsPage;