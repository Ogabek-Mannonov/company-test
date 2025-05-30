const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Barcha mahsulotlarni olish
router.get('/', authMiddleware, async (req, res) => {
  try {
    const products = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(products.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Yangi mahsulot qo'shish
router.post('/', authMiddleware, async (req, res) => {
  const { name, description, price, sku } = req.body;
  try {
    const newProduct = await pool.query(
      'INSERT INTO products (name, description, price, sku) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, sku]
    );
    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Mahsulotni yangilash
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, sku } = req.body;

  try {
    const updatedProduct = await pool.query(
      'UPDATE products SET name=$1, description=$2, price=$3, sku=$4, updated_at=NOW() WHERE id=$5 RETURNING *',
      [name, description, price, sku, id]
    );

    if (updatedProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Mahsulot topilmadi' });
    }

    res.json(updatedProduct.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Mahsulotni o'chirish
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await pool.query('DELETE FROM products WHERE id=$1 RETURNING *', [id]);

    if (deletedProduct.rows.length === 0) {
      return res.status(404).json({ error: 'Mahsulot topilmadi' });
    }

    res.json({ message: 'Mahsulot o‘chirildi' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

module.exports = router;
