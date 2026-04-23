import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-[#313338] text-white">
        <Routes>
          <Route path="/login" element={<div>Login Page (Coming Soon)</div>} />
          <Route path="/register" element={<div>Register Page (Coming Soon)</div>} />
          <Route 
            path="/" 
            element={isAuthenticated ? <div>Chat Interface (Coming Soon)</div> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
