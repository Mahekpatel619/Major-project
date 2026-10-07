const express = require('express');
const router = express.Router();
const { logMood, getClientMoods } = require('../controllers/moodController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', authorize('client'), logMood);
router.get('/:clientId', getClientMoods);

module.exports = router;
