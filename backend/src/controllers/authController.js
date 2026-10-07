const jwt = require('jsonwebtoken');
const Therapist = require('../models/Therapist');
const Client = require('../models/Client');
const Availability = require('../models/Availability');
const slugify = require('../utils/slugify');

const signToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'unfazed_jwt_super_secret_key_2026_therapy_saas',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Register therapist
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    // Check if therapist exists
    const existingTherapist = await Therapist.findOne({ email: email.toLowerCase() });
    if (existingTherapist) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Generate unique slug
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    while (await Therapist.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const therapist = await Therapist.create({
      name,
      email: email.toLowerCase(),
      password,
      slug,
    });

    // Seed default availability for newly registered therapist
    await Availability.create({
      therapistId: therapist._id,
      sessionDuration: 50,
      bufferTime: 10,
      weeklySchedule: [
        { dayOfWeek: 1, dayName: 'Monday', enabled: true, startTime: '10:00', endTime: '18:00' },
        { dayOfWeek: 2, dayName: 'Tuesday', enabled: true, startTime: '10:00', endTime: '18:00' },
        { dayOfWeek: 3, dayName: 'Wednesday', enabled: true, startTime: '10:00', endTime: '18:00' },
        { dayOfWeek: 4, dayName: 'Thursday', enabled: true, startTime: '10:00', endTime: '18:00' },
        { dayOfWeek: 5, dayName: 'Friday', enabled: true, startTime: '10:00', endTime: '18:00' },
        { dayOfWeek: 6, dayName: 'Saturday', enabled: true, startTime: '10:00', endTime: '15:00' },
        { dayOfWeek: 0, dayName: 'Sunday', enabled: false, startTime: '10:00', endTime: '14:00' },
      ],
    });

    const token = signToken(therapist._id, 'therapist');

    res.status(201).json({
      success: true,
      token,
      user: {
        id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        role: 'therapist',
        slug: therapist.slug,
        subscriptionPlan: therapist.subscriptionPlan,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Register client
// @route   POST /api/auth/register-client
// @access  Public
exports.registerClient = async (req, res, next) => {
  try {
    const { name, email, password, therapistId, phone } = req.body;

    if (!name || !email || !password || !therapistId) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and therapistId are required',
      });
    }

    const existingClient = await Client.findOne({ email: email.toLowerCase(), therapistId });
    if (existingClient) {
      return res.status(400).json({ success: false, message: 'You are already registered with this therapist practice' });
    }

    const client = await Client.create({
      name,
      email: email.toLowerCase(),
      password,
      therapistId,
      phone: phone || '',
    });

    const token = signToken(client._id, 'client');

    res.status(201).json({
      success: true,
      token,
      user: {
        id: client._id,
        name: client.name,
        email: client.email,
        role: 'client',
        therapistId: client.therapistId,
        intakeCompleted: client.intakeCompleted,
        consentSigned: client.consentSigned,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user (therapist or client)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. If role specified or check Therapist first
    if (!role || role === 'therapist') {
      const therapist = await Therapist.findOne({ email: cleanEmail }).select('+password');
      if (therapist) {
        const isMatch = await therapist.matchPassword(password);
        if (isMatch) {
          const token = signToken(therapist._id, 'therapist');
          return res.json({
            success: true,
            token,
            user: {
              id: therapist._id,
              name: therapist.name,
              email: therapist.email,
              role: 'therapist',
              slug: therapist.slug,
              subscriptionPlan: therapist.subscriptionPlan,
              profileImage: therapist.profileImage,
            },
          });
        }
      }
    }

    // 2. Check Client
    if (!role || role === 'client') {
      const client = await Client.findOne({ email: cleanEmail }).select('+password').populate('therapistId', 'name slug');
      if (client) {
        const isMatch = await client.matchPassword(password);
        if (isMatch) {
          const token = signToken(client._id, 'client');
          return res.json({
            success: true,
            token,
            user: {
              id: client._id,
              name: client.name,
              email: client.email,
              role: 'client',
              phone: client.phone,
              therapistId: client.therapistId?._id || client.therapistId,
              therapistName: client.therapistId?.name,
              therapistSlug: client.therapistId?.slug,
              intakeCompleted: client.intakeCompleted,
              consentSigned: client.consentSigned,
            },
          });
        }
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    if (req.user.role === 'therapist') {
      const therapist = await Therapist.findById(req.user._id);
      return res.json({
        success: true,
        user: {
          id: therapist._id,
          name: therapist.name,
          email: therapist.email,
          role: 'therapist',
          slug: therapist.slug,
          subscriptionPlan: therapist.subscriptionPlan,
          profileImage: therapist.profileImage,
          consultationFee: therapist.consultationFee,
        },
      });
    } else {
      const client = await Client.findById(req.user._id).populate('therapistId', 'name slug profileImage consultationFee');
      return res.json({
        success: true,
        user: {
          id: client._id,
          name: client.name,
          email: client.email,
          role: 'client',
          phone: client.phone,
          therapistId: client.therapistId?._id,
          therapistName: client.therapistId?.name,
          therapistSlug: client.therapistId?.slug,
          therapistImage: client.therapistId?.profileImage,
          intakeCompleted: client.intakeCompleted,
          consentSigned: client.consentSigned,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};
