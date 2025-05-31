import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OrdersList.css';

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://company-test-1.onrender.com/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      setError('Buyurtmalarni olishda xatolik yuz berdi');
    }
  };

  return (
    <div className="orders-list-container">
      <h2>Yuborilgan Buyurtmalar</h2>
      {error && <p className="error-message">{error}</p>}

      {orders.length === 0 ? (
        <p>Hech qanday buyurtma topilmadi.</p>
      ) : (
        <ul className="order-list">
          {orders.map(order => (
            <li key={order.id} className="order-item-display">
              <div><strong>Buyurtma ID:</strong> {order.id}</div>
              <div><strong>Mijoz:</strong> {order.customer_name}</div>
              <div><strong>Status:</strong> {order.status}</div>
              <div><strong>Jami summa:</strong> {order.total_amount} so‘m</div>
              <div><strong>Sana:</strong> {new Date(order.order_date).toLocaleString()}</div>

              <div><strong>Mahsulotlar:</strong>
                <ul>
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map(item => (
                      <li key={item.product_id}>
                        {item.product_name} — miqdor: {item.quantity}, narx: {item.unit_price} so‘m
                      </li>
                    ))
                  ) : (
                    <li>Mahsulotlar mavjud emas</li>
                  )}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrdersList;
