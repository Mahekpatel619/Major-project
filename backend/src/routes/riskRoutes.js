const express = require('express');
const router = express.Router();
const { getClientRisk } = require('../controllers/riskController');
const { protect, authorize } = require('../middleware/auth');

router.get('/:clientId', protect, authorize('therapist'), getClientRisk);

module.exports = router;
