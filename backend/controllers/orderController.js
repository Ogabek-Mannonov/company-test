const { Order, OrderItem, Product, Customer } = require('../models');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Customer, attributes: ['company_name', 'contact_name'] },
        { model: OrderItem, include: [{ model: Product }] }
      ]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Buyurtmalarni olishda xatolik yuz berdi' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Customer, attributes: ['company_name', 'contact_name'] },
        { model: OrderItem, include: [{ model: Product }] }
      ]
    });
    if (!order) return res.status(404).json({ message: 'Buyurtma topilmadi' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { customer_id, status, items } = req.body; // items = [{product_id, quantity, unit_price}, ...]

    // Buyurtmani yaratish
    const order = await Order.create({
      customer_id,
      status,
      total_amount: items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
    });

    // Buyurtma elementlarini yaratish
    for (const item of items) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      });
    }

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Buyurtma yaratishda xatolik yuz berdi' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Buyurtma topilmadi' });
    await order.update(req.body);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Buyurtmani yangilashda xatolik yuz berdi' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Buyurtma topilmadi' });
    await order.destroy();
    res.json({ message: 'Buyurtma o‘chirildi' });
  } catch (error) {
    res.status(500).json({ message: 'Buyurtmani o‘chirishda xatolik yuz berdi' });
  }
};
