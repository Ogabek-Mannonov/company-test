const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { checkAdmin } = require('../middlewares/checkRole');

router.use(authenticateToken, checkAdmin);

router.get('/', customerController.getAllCustomers);
router.post('/', customerController.createCustomer);

module.exports = router;
