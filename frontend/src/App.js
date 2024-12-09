// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ArtistDashboard from './pages/artist/DashboardPage';
import ClientDashboard from './pages/client/DashboardPage';
import PortfolioPage from './pages/artist/PortfolioPage';
import BrowseArtistsPage from './pages/client/BrowseArtistsPage';
import OrdersPage from './pages/client/OrdersPage';
import MessagesPage from './pages/client/MessagesPage';
import CommissionsPage from './pages/artist/CommissionsPage';  // Tambahkan .jsx

const DashboardRoute = () => {
  const { user } = useAuth();
  return user?.role === 'artist' ? <ArtistDashboard /> : <ClientDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router basename="/ArtCommission-TST">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <PortfolioPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/browse-artists"
            element={
              <ProtectedRoute>
                <BrowseArtistsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/commissions"
            element={
              <ProtectedRoute>
                <CommissionsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;