const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('./customer');
const Product = require('./product');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' }
}, {
  tableName: 'orders',
  timestamps: true,
});

Order.belongsTo(Customer, { foreignKey: 'customerId' });
Order.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Order;
