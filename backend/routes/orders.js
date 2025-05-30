const express = require('express');
const pool = require('../db'); // PostgreSQL pool konfiguratsiyasi
const authMiddleware = require('../middleware/authMiddleware'); // JWT yoki boshqa autentifikatsiya middleware
const router = express.Router();

// Buyurtmalar ro'yxatini olish (GET /api/orders)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const ordersResult = await pool.query(`
      SELECT
        o.id,
        o.status,
        o.total_amount,
        o.order_date,
        c.name AS customer_name,
        a.username AS admin_name,
        COALESCE(
          json_agg(
            json_build_object(
              'product_id', p.id,
              'product_name', p.name,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price
            )
          ) FILTER (WHERE p.id IS NOT NULL),
          '[]'::json
        ) AS items
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN admins a ON o.admin_id = a.id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id, c.name, a.username, o.status, o.total_amount, o.order_date
      ORDER BY o.order_date DESC;
    `);

    res.json(ordersResult.rows);
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
});

// Buyurtma yaratish (POST /api/orders)
router.post('/', authMiddleware, async (req, res) => {
  const { customer_id, admin_id, status, total_amount, items } = req.body;
  // items = [{ product_id, quantity, unit_price }, ...]

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Yangi buyurtma yaratish
    const orderRes = await client.query(
      `INSERT INTO orders (customer_id, admin_id, status, total_amount) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [customer_id, admin_id, status, total_amount]
    );

    const orderId = orderRes.rows[0].id;

    // Buyurtma mahsulotlarini qo'shish
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.unit_price]
      );
    }

    await client.query('COMMIT');

    res.status(201).json(orderRes.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Buyurtma yaratishda xatolik yuz berdi' });
  } finally {
    client.release();
  }
});

module.exports = router;
