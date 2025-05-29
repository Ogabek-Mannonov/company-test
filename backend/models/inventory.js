const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./product');

const Inventory = sequelize.define('Inventory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: 'id' },
    allowNull: false
  },
  quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  location: { type: DataTypes.STRING }
}, {
  tableName: 'inventory',
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: false
});

module.exports = Inventory;
