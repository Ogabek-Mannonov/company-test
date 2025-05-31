const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const router = express.Router();

// Register (ro'yxatdan o'tish)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Kiruvchi ma'lumotlarni validatsiya qilish
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Iltimos, barcha maydonlarni to‘ldiring' });
  }

  try {
    // Email bazada borligini tekshirish
    const existingAdmin = await pool.query('SELECT id FROM admins WHERE email = $1', [email]);
    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ error: 'Bu email allaqachon ro‘yxatdan o‘tgan' });
    }

    // Parolni hash qilish
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Admin qo'shish
    const newAdmin = await pool.query(
      'INSERT INTO admins (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    res.status(201).json({ admin: newAdmin.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Kiruvchi ma'lumotlarni validatsiya qilish
  if (!email || !password) {
    return res.status(400).json({ error: 'Iltimos, email va parolni kiriting' });
  }

  try {
    // Adminni topish
    const adminResult = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (adminResult.rows.length === 0) {
      return res.status(400).json({ error: 'Email topilmadi' });
    }

    const admin = adminResult.rows[0];

    // Parolni tekshirish
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Parol noto‘g‘ri' });
    }

    // JWT token yaratish
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET muhit o‘zgaruvchisi aniqlanmadi!');
      return res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
});

module.exports = router;
