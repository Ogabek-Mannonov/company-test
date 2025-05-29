const { Customer } = require('../models');

exports.getAllCustomers = async (req, res) => {
  const customers = await Customer.findAll();
  res.json(customers);
};

exports.createCustomer = async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const customer = await Customer.create({ name, email, phone, address });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};
