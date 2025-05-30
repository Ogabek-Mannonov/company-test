const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token topilmadi' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // kerakli ma'lumotlarni qo'yish
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token noto'g'ri yoki muddati o'tgan" });
  }
}

module.exports = authMiddleware;
