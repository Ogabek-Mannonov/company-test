const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Xavfsizlik uchun HTTP headerlarni o'rnatadi
app.use(cors());
app.use(express.json());

// Rate limiter: bir IP dan ma'lum vaqt ichida ko'p so'rov yuborishni cheklaydi
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 100, // 15 daqiqada 100 ta so'rovdan oshmasin
  message: 'Ko‘p so‘rov yubordingiz, iltimos keyinroq urinib ko‘ring.'
});
app.use(limiter);

// Routerlarni ulash
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

// Test uchun oddiy endpoint
app.get('/', (req, res) => {
  res.send('ERP Admin Backend is running');
});

// Global xatolik tutuvchi middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
});

// Serverni ishga tushurish
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
