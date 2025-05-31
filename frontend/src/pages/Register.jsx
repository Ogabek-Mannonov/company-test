import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.passwordConfirm) {
      setError('Parollar mos emas');
      return;
    }

    try {
      const res = await axios.post('https://company-test-1.onrender.com/api/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setSuccess('Ro‘yxatdan o‘tish muvaffaqiyatli! Endi tizimga kiring.');
      setForm({ username: '', email: '', password: '', passwordConfirm: '' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Ro‘yxatdan o‘tishda xatolik yuz berdi');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Ro‘yxatdan o‘tish</h2>

        <input
          type="text"
          name="username"
          placeholder="Foydalanuvchi nomi"
          value={form.username}
          onChange={handleChange}
          required
          className="input-field"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="input-field"
        />

        <input
          type="password"
          name="password"
          placeholder="Parol"
          value={form.password}
          onChange={handleChange}
          required
          className="input-field"
        />

        <input
          type="password"
          name="passwordConfirm"
          placeholder="Parolni tasdiqlang"
          value={form.passwordConfirm}
          onChange={handleChange}
          required
          className="input-field"
        />

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button type="submit" className="register-button">Ro‘yxatdan o‘tish</button>

        <p>
          Hisobingiz bor? <Link to="/login">Kirish</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
