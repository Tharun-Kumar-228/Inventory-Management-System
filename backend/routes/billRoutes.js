const express = require('express');
const router = express.Router();
const { createBill, getBills } = require('../controllers/billController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getBills)
    .post(protect, createBill);

module.exports = router;
