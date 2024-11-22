// frontend/src/pages/artist/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';

const ArtistDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stats Cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              {/* ... Active Commissions Card ... */}
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              {/* ... Total Earnings Card ... */}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activity
            </h2>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="p-6">
                <p className="text-gray-500">No recent activity</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistDashboard;