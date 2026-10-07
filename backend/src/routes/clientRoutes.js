const express = require('express');
const router = express.Router();
const {
  getClients,
  createClient,
  getClientDetails,
  updateClient,
  deleteClient,
  submitIntake,
  submitConsent,
} = require('../controllers/clientController');
const { protect, authorize } = require('../middleware/auth');

// Client portal intake & consent routes
router.post('/intake', protect, authorize('client'), submitIntake);
router.post('/consent', protect, authorize('client'), submitConsent);

// Therapist CRM routes
router.use(protect, authorize('therapist'));
router.route('/').get(getClients).post(createClient);
router.route('/:id').get(getClientDetails).put(updateClient).delete(deleteClient);

module.exports = router;
