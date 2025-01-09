const express = require('express');
const { registerUser, loginUser, logout, getProfile, updateProfile } = require('../controllers/user');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', logout);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;