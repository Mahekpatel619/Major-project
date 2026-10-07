const express = require('express');
const router = express.Router();
const { register, registerClient, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/register-client', registerClient);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
