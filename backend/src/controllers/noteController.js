const SessionNote = require('../models/SessionNote');
const entitlementService = require('../services/entitlementService');

// @desc    Get clinical notes (Strictly filtered by role & privacy)
// @route   GET /api/notes
// @access  Private (Therapist or Client)
exports.getNotes = async (req, res, next) => {
  try {
    const { clientId, sessionId } = req.query;

    let query = {};

    if (req.user.role === 'therapist') {
      // Therapist sees all notes for their practice
      query.therapistId = req.user._id;
      if (clientId) query.clientId = clientId;
      if (sessionId) query.sessionId = sessionId;
    } else if (req.user.role === 'client') {
      // CRITICAL PRIVACY RULE: Client sees ONLY notes marked as 'shared' for themselves.
      // Private notes are STRICTLY filtered out at the database query level.
      query.clientId = req.user._id;
      query.noteType = 'shared';
    } else {
      return res.status(403).json({ success: false, message: 'Unauthorized role' });
    }

    const notes = await SessionNote.find(query)
      .populate('clientId', 'name email')
      .populate('sessionId', 'date startTime serviceName')
      .sort({ createdAt: -1 })
      .lean();

    // Additional serializer safeguard: double-check that no client response contains noteType === 'private'
    if (req.user.role === 'client') {
      const sanitizedNotes = notes.filter((n) => n.noteType === 'shared');
      return res.json({ success: true, count: sanitizedNotes.length, notes: sanitizedNotes });
    }

    res.json({ success: true, count: notes.length, notes });
  } catch (err) {
    next(err);
  }
};

// @desc    Create clinical note
// @route   POST /api/notes
// @access  Private (Therapist only)
exports.createNote = async (req, res, next) => {
  try {
    const { clientId, sessionId, title, noteType, templateType, content, soap, dap, riskAssessment } = req.body;

    if (!clientId) {
      return res.status(400).json({ success: false, message: 'Client ID is required' });
    }

    // If using SOAP or DAP, verify entitlement
    if (templateType === 'soap' || templateType === 'dap') {
      const access = await entitlementService.canAccess(req.user._id, 'advancedNoteTemplates');
      if (!access.allowed) {
        return res.status(403).json({
          success: false,
          upgradeRequired: true,
          message: access.reason || 'SOAP and DAP structured templates require Pro or Premium plan.',
        });
      }
    }

    const note = await SessionNote.create({
      therapistId: req.user._id,
      clientId,
      sessionId: sessionId || null,
      title: title || 'Clinical Session Note',
      noteType: noteType || 'private', // Defaults to private for practitioner safety
      templateType: templateType || 'soap',
      content: content || '',
      soap: soap || {},
      dap: dap || {},
      riskAssessment: riskAssessment || {},
    });

    res.status(201).json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

// @desc    Update clinical note
// @route   PUT /api/notes/:id
// @access  Private (Therapist only)
exports.updateNote = async (req, res, next) => {
  try {
    const note = await SessionNote.findOneAndUpdate(
      { _id: req.params.id, therapistId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
    }

    res.json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete clinical note
// @route   DELETE /api/notes/:id
// @access  Private (Therapist only)
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await SessionNote.findOneAndDelete({ _id: req.params.id, therapistId: req.user._id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized' });
    }

    res.json({ success: true, message: 'Clinical note deleted' });
  } catch (err) {
    next(err);
  }
};
