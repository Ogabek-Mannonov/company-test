import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Orders.css';

function Orders() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    customer_id: '',
    status: 'pending',
    total_amount: 0,
    items: [{ product_id: '', quantity: '', unit_price: '' }],
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Mijozlarni olish
    axios.get('http://localhost:5000/api/customers', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setCustomers(res.data));

    // Mahsulotlarni olish
    axios.get('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setProducts(res.data));
  }, [token]);

  // Jami summani avtomatik hisoblash
  useEffect(() => {
    const sum = form.items.reduce((acc, item) => {
      const quantity = parseFloat(item.quantity);
      const unit_price = parseFloat(item.unit_price);
      if (!isNaN(quantity) && !isNaN(unit_price)) {
        return acc + quantity * unit_price;
      }
      return acc;
    }, 0);

    setForm(prev => ({ ...prev, total_amount: sum.toFixed(2) }));
  }, [form.items]);

  const handleChange = (e, index = null) => {
    if (index !== null) {
      const newItems = [...form.items];
      newItems[index][e.target.name] = e.target.value;
      setForm({ ...form, items: newItems });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { product_id: '', quantity: '', unit_price: '' }] });
  };

  const removeItem = (index) => {
    const newItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customer_id || form.items.length === 0) {
      alert('Iltimos, barcha majburiy maydonlarni to‘ldiring');
      return;
    }

    for (const item of form.items) {
      if (!item.product_id || !item.quantity || !item.unit_price) {
        alert('Buyurtma mahsulotlarini to‘liq to‘ldiring');
        return;
      }
    }

    try {
      await axios.post('http://localhost:5000/api/orders', {
        customer_id: parseInt(form.customer_id),
        admin_id: 1, // backenddan olish kerak bo‘lsa o‘zgartiring
        status: form.status,
        total_amount: parseFloat(form.total_amount),
        items: form.items.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price),
        })),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Buyurtma muvaffaqiyatli yuborildi');

      setForm({
        customer_id: '',
        status: 'pending',
        total_amount: 0,
        items: [{ product_id: '', quantity: '', unit_price: '' }],
      });
    } catch (error) {
      alert('Buyurtma yuborishda xatolik yuz berdi');
      console.error(error);
    }
  };

  return (
    <form className="orders-form" onSubmit={handleSubmit}>
      <h2>Buyurtma yaratish</h2>

      <label>Mijozni tanlang:</label>
      <select
        name="customer_id"
        value={form.customer_id}
        onChange={handleChange}
        required
      >
        <option value="">Mijozni tanlang</option>
        {customers.map(c => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.email})
          </option>
        ))}
      </select>

      <label>Status:</label>
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="canceled">Canceled</option>
      </select>

      <label>Jami summa:</label>
      <input
        type="number"
        name="total_amount"
        value={form.total_amount}
        readOnly
        className="input-field"
      />

      <h3>Mahsulotlar:</h3>
      {form.items.map((item, index) => (
        <div key={index} className="order-item">
          <select
            name="product_id"
            value={item.product_id}
            onChange={e => handleChange(e, index)}
            required
          >
            <option value="">Mahsulotni tanlang</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.sku}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            value={item.quantity}
            onChange={e => handleChange(e, index)}
            placeholder="Miqdor"
            required
            min="1"
          />

          <input
            type="number"
            name="unit_price"
            value={item.unit_price}
            onChange={e => handleChange(e, index)}
            placeholder="Narx"
            step="0.01"
            required
            min="0"
          />

          {form.items.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="remove-item-button"
            >
              &times;
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addItem} className="add-item-button">
        + Mahsulot qo‘shish
      </button>

      <button type="submit" className="submit-button">
        Buyurtmani yuborish
      </button>
    </form>
  );
}

export default Orders;
