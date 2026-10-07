const express = require('express');
const router = express.Router();
const {
  getHomework,
  createHomework,
  updateHomework,
  deleteHomework,
} = require('../controllers/homeworkController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getHomework).post(authorize('therapist'), createHomework);
router.route('/:id').put(updateHomework).delete(authorize('therapist'), deleteHomework);

module.exports = router;
