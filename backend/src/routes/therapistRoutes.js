const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getPublicProfileBySlug } = require('../controllers/therapistController');
const { protect, authorize } = require('../middleware/auth');

// Private profile
router.get('/profile', protect, authorize('therapist'), getProfile);
router.put('/profile', protect, authorize('therapist'), updateProfile);

// Public profile by slug (also mapped to /api/therapists/:slug in server.js)
router.get('/:slug', getPublicProfileBySlug);

module.exports = router;
