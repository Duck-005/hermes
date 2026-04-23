import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainLayout from './components/MainLayout';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-[#313338] text-white">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/" 
            element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
