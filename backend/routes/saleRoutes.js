const express = require('express');
const router = express.Router();
const { createSale, getSales, getStats, getDailyReport, exportSales } = require('../controllers/saleController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createSale).get(protect, admin, getSales);
router.get('/stats', protect, getStats);
router.get('/daily', protect, admin, getDailyReport);
router.get('/export', protect, admin, exportSales);

module.exports = router;
