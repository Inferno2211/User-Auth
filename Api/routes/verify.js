const express = require('express');
const { sendVerificationCode, checkVerificationCode } = require('../controllers/verify');

const router = express.Router();

router.post('/send', sendVerificationCode);

router.post('/check', checkVerificationCode);

module.exports = router;