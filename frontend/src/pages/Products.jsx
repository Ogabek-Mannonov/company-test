import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../index.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', sku: '' });
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://company-test-1.onrender.com/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      setError('Mahsulotlarni olishda xatolik yuz berdi');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.price || !form.sku) {
      setError('Name, price va SKU majburiy');
      return;
    }

    try {
      await axios.post(
        'https://company-test-1.onrender.com/api/products',
        {
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          sku: form.sku,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setForm({ name: '', description: '', price: '', sku: '' });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Mahsulot qo‘shishda xatolik');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Mahsulotlar</h2>
        <button onClick={handleLogout} className="logout-button">Chiqish</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <form className="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Mahsulot nomi"
          value={form.name}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Ta'rif"
          value={form.description}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="number"
          name="price"
          placeholder="Narxi"
          value={form.price}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="text"
          name="sku"
          placeholder="SKU kodi"
          value={form.sku}
          onChange={handleChange}
          className="input-field"
          required
        />
        <button type="submit" className="add-button">Mahsulot qo‘shish</button>
      </form>

      <ul className="product-list">
        {products.map(prod => (
          <li key={prod.id} className="product-item">
            <div><strong>{prod.name}</strong> — {prod.description}</div>
            <div>{prod.price} so‘m | SKU: {prod.sku}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Products;
