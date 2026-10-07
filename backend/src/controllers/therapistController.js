const Therapist = require('../models/Therapist');
const Availability = require('../models/Availability');

// @desc    Get therapist's private full profile
// @route   GET /api/therapist/profile
// @access  Private (Therapist)
exports.getProfile = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.user._id);
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }
    res.json({ success: true, therapist });
  } catch (err) {
    next(err);
  }
};

// @desc    Update therapist profile
// @route   PUT /api/therapist/profile
// @access  Private (Therapist)
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'title',
      'bio',
      'specializations',
      'languages',
      'experience',
      'consultationFee',
      'services',
      'profileImage',
      'phone',
      'clinicAddress',
      'qualifications',
      'customBranding',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const therapist = await Therapist.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, therapist });
  } catch (err) {
    next(err);
  }
};

// @desc    Get public therapist profile by unique slug (e.g. /dr-sharma)
// @route   GET /api/therapists/:slug
// @access  Public
exports.getPublicProfileBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const therapist = await Therapist.findOne({ slug: slug.toLowerCase() })
      .select('name title bio specializations languages experience consultationFee services profileImage clinicAddress qualifications customBranding slug')
      .lean();

    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist profile not found' });
    }

    // Also fetch their active availability settings
    const availability = await Availability.findOne({ therapistId: therapist._id })
      .select('sessionDuration weeklySchedule blockedDates')
      .lean();

    res.json({
      success: true,
      therapist: {
        ...therapist,
        availability,
      },
    });
  } catch (err) {
    next(err);
  }
};
