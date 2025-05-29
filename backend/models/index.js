const sequelize = require('../config/db');
const User = require('./user');
const Customer = require('./customer');
const Product = require('./product');
const Order = require('./order');

module.exports = {
  sequelize,
  User,
  Customer,
  Product,
  Order,
};
