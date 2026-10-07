const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, markAsRead } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/:otherUserId', getMessages);
router.post('/', sendMessage);
router.put('/read/:otherUserId', markAsRead);

module.exports = router;
