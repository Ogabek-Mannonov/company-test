const { Product } = require('../models');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Mahsulotlarni olishda xatolik yuz berdi' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Mahsulot topilmadi' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Mahsulot yaratishda xatolik yuz berdi' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Mahsulot topilmadi' });
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Mahsulotni yangilashda xatolik yuz berdi' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Mahsulot topilmadi' });
    await product.destroy();
    res.json({ message: 'Mahsulot o‘chirildi' });
  } catch (error) {
    res.status(500).json({ message: 'Mahsulotni o‘chirishda xatolik yuz berdi' });
  }
};
