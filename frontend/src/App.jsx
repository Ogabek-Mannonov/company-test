import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Customers from './pages/Customers';
import CreateOrder from './pages/Orders';
import OrdersList from './pages/OrdersList';

import Sidebar from './components/Sidebar';

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
      {isLoggedIn && <Sidebar setToken={setToken} />}

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
            path="/customers"
            element={isLoggedIn ? <Customers /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/orders"
            element={isLoggedIn ? <CreateOrder /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/orders-list"
            element={isLoggedIn ? <OrdersList /> : <Navigate to="/login" replace />}
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
