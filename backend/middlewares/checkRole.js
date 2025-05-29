exports.checkAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Faqat adminlar uchun' });
  }
  next();
};
