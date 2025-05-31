import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);  // token holatini yangilash
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <nav className="sidebar-nav">
        <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>Products</NavLink>
        <NavLink to="/customers" className={({ isActive }) => (isActive ? 'active' : '')}>Customers</NavLink>
        <NavLink to="/orders" className={({ isActive }) => (isActive ? 'active' : '')}>Create Order</NavLink>
        <NavLink to="/orders-list" className={({ isActive }) => (isActive ? 'active' : '')}>Orders List</NavLink>
      </nav>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
}

export default Sidebar;
