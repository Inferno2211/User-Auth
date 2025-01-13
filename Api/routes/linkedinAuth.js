const express = require('express');
const router = express.Router();
const { linkedinCallback, initiateLinkedInAuth } = require('../controllers/linkedinAuth');

router.get('/auth/linkedin', initiateLinkedInAuth);
router.get('/oauth', linkedinCallback);

module.exports = router;