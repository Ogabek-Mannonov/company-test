const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Barcha mijozlar
router.get('/', authMiddleware, async (req, res) => {
  try {
    const customers = await pool.query('SELECT * FROM customers ORDER BY id DESC');
    res.json(customers.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Yangi mijoz qo'shish
router.post('/', authMiddleware, async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const newCustomer = await pool.query(
      'INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, address]
    );
    res.status(201).json(newCustomer.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Mijozni yangilash
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  try {
    const updatedCustomer = await pool.query(
      'UPDATE customers SET name=$1, email=$2, phone=$3, address=$4, updated_at=NOW() WHERE id=$5 RETURNING *',
      [name, email, phone, address, id]
    );

    if (updatedCustomer.rows.length === 0) {
      return res.status(404).json({ error: 'Mijoz topilmadi' });
    }

    res.json(updatedCustomer.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Mijozni o'chirish
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCustomer = await pool.query('DELETE FROM customers WHERE id=$1 RETURNING *', [id]);

    if (deletedCustomer.rows.length === 0) {
      return res.status(404).json({ error: 'Mijoz topilmadi' });
    }

    res.json({ message: 'Mijoz o‘chirildi' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

module.exports = router;
