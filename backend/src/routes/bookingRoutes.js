const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  createBooking,
  getTherapistBookings,
  getClientBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Public endpoints
router.post('/', createBooking);

// Protected routes
router.get('/therapist', protect, authorize('therapist'), getTherapistBookings);
router.get('/client', protect, authorize('client'), getClientBookings);
router.put('/:id', protect, updateBookingStatus);

module.exports = router;
