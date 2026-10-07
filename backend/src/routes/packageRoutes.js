const express = require('express');
const router = express.Router();
const {
  getPackages,
  createPackage,
  purchasePackage,
  getClientPackages,
} = require('../controllers/packageController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getPackages);
router.post('/', protect, authorize('therapist'), createPackage);
router.post('/purchase', protect, purchasePackage);
router.get('/client', protect, getClientPackages);

module.exports = router;
