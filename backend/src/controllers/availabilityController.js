const Availability = require('../models/Availability');

// @desc    Get therapist availability
// @route   GET /api/availability
// @access  Private (Therapist)
exports.getAvailability = async (req, res, next) => {
  try {
    let availability = await Availability.findOne({ therapistId: req.user._id });
    if (!availability) {
      // Create default
      availability = await Availability.create({
        therapistId: req.user._id,
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
    }

    res.json({ success: true, availability });
  } catch (err) {
    next(err);
  }
};

// @desc    Update therapist availability & schedule rules
// @route   PUT /api/availability
// @access  Private (Therapist)
exports.updateAvailability = async (req, res, next) => {
  try {
    const { weeklySchedule, sessionDuration, bufferTime, blockedDates } = req.body;

    let availability = await Availability.findOne({ therapistId: req.user._id });
    if (!availability) {
      availability = new Availability({ therapistId: req.user._id });
    }

    if (weeklySchedule) availability.weeklySchedule = weeklySchedule;
    if (sessionDuration !== undefined) availability.sessionDuration = sessionDuration;
    if (bufferTime !== undefined) availability.bufferTime = bufferTime;
    if (blockedDates) availability.blockedDates = blockedDates;

    await availability.save();

    res.json({ success: true, availability });
  } catch (err) {
    next(err);
  }
};
