import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../index.css';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://company-test-1.onrender.com/api/customers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data);
    } catch (err) {
      setError('Mijozlarni olishda xatolik yuz berdi');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email) {
      setError('Ism va Email majburiy');
      return;
    }

    try {
      await axios.post(
        'https://company-test-1.onrender.com/api/customers',
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm({ name: '', email: '', phone: '', address: '' });
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Mijoz qo‘shishda xatolik');
    }
  };

  return (
    <div className="customers-container">
      <h2>Mijozlar</h2>

      {error && <p className="error-message">{error}</p>}

      <form className="customer-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Ism"
          value={form.name}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefon"
          value={form.phone}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="text"
          name="address"
          placeholder="Manzil"
          value={form.address}
          onChange={handleChange}
          className="input-field"
        />
        <button type="submit" className="add-button">Mijoz qo‘shish</button>
      </form>

      <ul className="customer-list">
        {customers.map(cust => (
          <li key={cust.id} className="customer-item">
            <div><strong>{cust.name}</strong> ({cust.email})</div>
            <div>Tel: {cust.phone || '-'}</div>
            <div>Manzil: {cust.address || '-'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Customers;
