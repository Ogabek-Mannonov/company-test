import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import OrdersList from './pages/OrdersList';

import Sidebar from './components/Sidebar';

import './App.css';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      {isLoggedIn && <Sidebar />}

      <div className={isLoggedIn ? 'main-content with-sidebar' : 'main-content'}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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
            element={isLoggedIn ? <Orders /> : <Navigate to="/login" replace />}
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
