const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getTherapistPayments,
  getClientPayments,
  downloadInvoice,
  handleWebhook,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.post('/webhook', handleWebhook);
router.get('/:id/invoice', downloadInvoice);

router.get('/', protect, authorize('therapist'), getTherapistPayments);
router.get('/client', protect, authorize('client'), getClientPayments);

module.exports = router;
