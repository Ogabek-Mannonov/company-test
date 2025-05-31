import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../index.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password }); // backend URLni o'zgartir
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/products');
      } else {
        setError('Token kelmadi, login muvaffaqiyatsiz');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login xatosi yuz berdi');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Panelga Kirish</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Parol"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="input-field"
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-button">Kirish</button>

        <p>
          Hisobingiz yo‘qmi? <Link to="/register">Ro‘yxatdan o‘tish</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
