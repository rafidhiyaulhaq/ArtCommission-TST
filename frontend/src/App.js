// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect dari root ke login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Tambahkan route lain di sini */}
      </Routes>
    </Router>
  );
}

export default App;