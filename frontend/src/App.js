// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Tambahkan import useAuth
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ArtistDashboard from './pages/artist/DashboardPage';
import ClientDashboard from './pages/client/DashboardPage';
import PortfolioPage from './pages/artist/PortfolioPage';

// Pisahkan DashboardRoute ke komponen terpisah
const DashboardRoute = () => {
  const { user } = useAuth();
  return user?.role === 'artist' ? <ArtistDashboard /> : <ClientDashboard />;
};

// Bungkus aplikasi dengan AuthProvider
function App() {
  return (
    <AuthProvider>
      <Router>
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;