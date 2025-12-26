const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUsers, deleteUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authUser);
// Just for setting up initial users, might want to protect this later or leave open for dev
router.post('/register', protect, admin, registerUser); // Protect register for admin only now
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
