const Client = require('../models/Client');
const Session = require('../models/Session');
const Payment = require('../models/Payment');
const Consent = require('../models/Consent');
const Mood = require('../models/Mood');
const Homework = require('../models/Homework');
const SessionNote = require('../models/SessionNote');
const { calculateNoShowRisk } = require('../services/riskCalculationService');
const entitlementService = require('../services/entitlementService');

// @desc    Get all clients of the logged-in therapist
// @route   GET /api/clients
// @access  Private (Therapist)
exports.getClients = async (req, res, next) => {
  try {
    const { search, status, tag, sort } = req.query;

    const query = { therapistId: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'name_asc') sortOption = { name: 1 };
    if (sort === 'name_desc') sortOption = { name: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const clients = await Client.find(query).sort(sortOption).lean();

    // Attach quick risk metrics to each client
    const enrichedClients = await Promise.all(
      clients.map(async (client) => {
        const risk = await calculateNoShowRisk(client._id);
        const totalSessions = await Session.countDocuments({ clientId: client._id });
        const lastSession = await Session.findOne({ clientId: client._id }).sort({ date: -1 });

        return {
          ...client,
          riskLevel: risk.riskLevel,
          riskScore: risk.score,
          badgeColor: risk.badgeColor,
          totalSessions,
          lastSessionDate: lastSession ? lastSession.date : null,
        };
      })
    );

    res.json({ success: true, count: enrichedClients.length, clients: enrichedClients });
  } catch (err) {
    next(err);
  }
};

// @desc    Create client manually by therapist
// @route   POST /api/clients
// @access  Private (Therapist)
exports.createClient = async (req, res, next) => {
  try {
    // Check entitlement limit on maxActiveClients
    const access = await entitlementService.canAccess(req.user._id, 'maxActiveClients');
    if (!access.allowed) {
      return res.status(403).json({
        success: false,
        upgradeRequired: true,
        message: access.reason,
      });
    }

    const { name, email, phone, tags, status, notesSummary, gender, dateOfBirth } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const existing = await Client.findOne({ email: email.toLowerCase(), therapistId: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Client with this email already exists in your practice' });
    }

    const client = await Client.create({
      therapistId: req.user._id,
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      password: 'ClientDefault123!', // Temporary password
      tags: tags || ['Individual Therapy'],
      status: status || 'Active',
      notesSummary: notesSummary || '',
      gender: gender || 'Prefer not to say',
      dateOfBirth: dateOfBirth || null,
    });

    res.status(201).json({ success: true, client });
  } catch (err) {
    next(err);
  }
};

// @desc    Get detailed client profile (info, sessions, payments, mood, homework, clinical notes, no-show risk)
// @route   GET /api/clients/:id
// @access  Private (Therapist)
exports.getClientDetails = async (req, res, next) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, therapistId: req.user._id });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found or not in your practice' });
    }

    const sessions = await Session.find({ clientId: client._id }).sort({ date: -1, startTime: -1 });
    const payments = await Payment.find({ clientId: client._id }).sort({ createdAt: -1 });
    const notes = await SessionNote.find({ clientId: client._id }).sort({ createdAt: -1 });
    const moods = await Mood.find({ clientId: client._id }).sort({ date: -1 }).limit(14);
    const homework = await Homework.find({ clientId: client._id }).sort({ createdAt: -1 });
    const consent = await Consent.findOne({ clientId: client._id }).sort({ signedAt: -1 });
    const risk = await calculateNoShowRisk(client._id);

    res.json({
      success: true,
      client,
      sessions,
      payments,
      notes,
      moods,
      homework,
      consent,
      risk,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private (Therapist)
exports.updateClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, therapistId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    res.json({ success: true, client });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete or Archive client
// @route   DELETE /api/clients/:id
// @access  Private (Therapist)
exports.deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, therapistId: req.user._id });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    res.json({ success: true, message: 'Client removed successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit client multi-step intake form
// @route   POST /api/clients/intake
// @access  Private (Client)
exports.submitIntake = async (req, res, next) => {
  try {
    const { presentingConcern, previousTherapyExperience, currentMedications, goalsForTherapy, emergencyContact } = req.body;

    const client = await Client.findByIdAndUpdate(
      req.user._id,
      {
        intakeCompleted: true,
        intakeData: {
          presentingConcern,
          previousTherapyExperience,
          currentMedications,
          goalsForTherapy,
        },
        emergencyContact,
      },
      { new: true }
    );

    res.json({ success: true, message: 'Intake form submitted successfully', client });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit informed consent
// @route   POST /api/clients/consent
// @access  Private (Client)
exports.submitConsent = async (req, res, next) => {
  try {
    const { consentText, signatureName } = req.body;

    if (!signatureName) {
      return res.status(400).json({ success: false, message: 'Electronic signature name is required' });
    }

    const consent = await Consent.create({
      clientId: req.user._id,
      therapistId: req.user.therapistId,
      consentVersion: 'v1.0-2026',
      consentText: consentText || 'I understand the confidentiality limits and practice policies of UNFAZED therapy services.',
      consentStatus: 'Agreed',
      clientSignatureName: signatureName,
      signedAt: new Date(),
      ipAddress: req.ip || '127.0.0.1',
    });

    await Client.findByIdAndUpdate(req.user._id, {
      consentSigned: true,
      consentSignedAt: new Date(),
    });

    res.json({ success: true, message: 'Consent signed and recorded', consent });
  } catch (err) {
    next(err);
  }
};
