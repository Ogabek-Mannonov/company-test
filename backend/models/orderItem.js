const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./order');
const Product = require('./product');

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: {
    type: DataTypes.INTEGER,
    references: { model: Order, key: 'id' }
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: 'id' }
  },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false }
}, {
  tableName: 'order_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = OrderItem;
