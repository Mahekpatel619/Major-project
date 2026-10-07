const express = require('express');
const router = express.Router();
const { getTiers, getMyEntitlements, upgradePlan } = require('../controllers/subscriptionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/tiers', getTiers);
router.get('/my-entitlements', protect, authorize('therapist'), getMyEntitlements);
router.post('/upgrade', protect, authorize('therapist'), upgradePlan);

module.exports = router;
