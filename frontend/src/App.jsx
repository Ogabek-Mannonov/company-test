import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';

import Sidebar from './components/Sidebar'; // Sidebar importi

import './App.css'; // agar CSS bo‘lsa

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isLoggedIn = !!token;

  return (
    <Router>
      {isLoggedIn && <Sidebar />} {/* Sidebar faqat tizimga kirganda ko‘rinadi */}

      <div className={isLoggedIn ? 'main-content with-sidebar' : 'main-content'}>
        <Routes>
          <Route
            path="/login"
            element={!isLoggedIn ? <Login setToken={setToken} /> : <Navigate to="/products" replace />}
          />
          <Route
            path="/register"
            element={!isLoggedIn ? <Register /> : <Navigate to="/products" replace />}
          />
          <Route
            path="/products"
            element={isLoggedIn ? <Products /> : <Navigate to="/login" replace />}
          />
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/products" : "/login"} replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
