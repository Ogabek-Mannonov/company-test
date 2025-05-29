const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, username, password } = req.body;

    if (!first_name || !last_name || !email || !username || !password) {
      return res.status(400).json({ message: 'Barcha maydonlar to‘ldirilishi shart' });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email yoki username allaqachon mavjud' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email,
      username,
      password_hash: hashedPassword,
      role: 'admin'  // Faqat admin roli
    });

    res.status(201).json({ message: 'Admin foydalanuvchi yaratildi', user_id: user.id });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server xatoligi yuz berdi' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username va parol kiritilishi shart' });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Parol noto‘g‘ri' });

    const token = jwt.sign({
      userId: user.id,
      role: user.role,
      username: user.username
    }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server xatoligi yuz berdi' });
  }
};
