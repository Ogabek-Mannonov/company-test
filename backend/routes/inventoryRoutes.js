const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

// Ombor ishchilariga (warehouse) va adminlarga ruxsat beriladi
router.get('/', authMiddleware, checkRole(['admin', 'warehouse']), inventoryController.getAllInventory);
router.get('/:id', authMiddleware, checkRole(['admin', 'warehouse']), inventoryController.getInventoryById);
router.post('/', authMiddleware, checkRole(['admin', 'warehouse']), inventoryController.createInventory);
router.put('/:id', authMiddleware, checkRole(['admin', 'warehouse']), inventoryController.updateInventory);
router.delete('/:id', authMiddleware, checkRole(['admin']), inventoryController.deleteInventory);

module.exports = router;
