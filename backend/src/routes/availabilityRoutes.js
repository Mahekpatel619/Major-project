const express = require('express');
const router = express.Router();
const { getAvailability, updateAvailability } = require('../controllers/availabilityController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('therapist'));
router.route('/').get(getAvailability).post(updateAvailability).put(updateAvailability);

module.exports = router;
