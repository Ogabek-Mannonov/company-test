const { Inventory, Product } = require('../models');

exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findAll({
      include: [{ model: Product }]
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Inventarizatsiyani olishda xatolik yuz berdi' });
  }
};

exports.getInventoryById = async (req, res) => {
  try {
    const inv = await Inventory.findByPk(req.params.id, {
      include: [{ model: Product }]
    });
    if (!inv) return res.status(404).json({ message: 'Inventarizatsiya topilmadi' });
    res.json(inv);
  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};

exports.createInventory = async (req, res) => {
  try {
    const inv = await Inventory.create(req.body);
    res.status(201).json(inv);
  } catch (error) {
    res.status(500).json({ message: 'Inventarizatsiya yaratishda xatolik yuz berdi' });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const inv = await Inventory.findByPk(req.params.id);
    if (!inv) return res.status(404).json({ message: 'Inventarizatsiya topilmadi' });
    await inv.update(req.body);
    res.json(inv);
  } catch (error) {
    res.status(500).json({ message: 'Inventarizatsiyani yangilashda xatolik yuz berdi' });
  }
};

exports.deleteInventory = async (req, res) => {
  try {
    const inv = await Inventory.findByPk(req.params.id);
    if (!inv) return res.status(404).json({ message: 'Inventarizatsiya topilmadi' });
    await inv.destroy();
    res.json({ message: 'Inventarizatsiya o‘chirildi' });
  } catch (error) {
    res.status(500).json({ message: 'Inventarizatsiyani o‘chirishda xatolik yuz berdi' });
  }
};
