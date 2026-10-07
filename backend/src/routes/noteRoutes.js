const express = require('express');
const router = express.Router();
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotes); // Accessible to therapist (all practice notes) and client (shared notes only)
router.post('/', authorize('therapist'), createNote);
router.put('/:id', authorize('therapist'), updateNote);
router.delete('/:id', authorize('therapist'), deleteNote);

module.exports = router;
