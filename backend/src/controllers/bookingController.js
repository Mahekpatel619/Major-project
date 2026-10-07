const Session = require('../models/Session');
const Availability = require('../models/Availability');
const Therapist = require('../models/Therapist');
const Client = require('../models/Client');
const notificationService = require('../services/notificationService');

// Helper: Convert "HH:MM" to minutes from midnight
const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// Helper: Convert minutes from midnight to "HH:MM"
const minutesToTime = (totalMinutes) => {
  const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const m = (totalMinutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

// @desc    Get available time slots for a therapist on a given date
// @route   GET /api/slots/:therapistId
// @access  Public
exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { therapistId } = req.params;
    const { date, duration } = req.query; // date: "YYYY-MM-DD"

    if (!date) {
      return res.status(400).json({ success: false, message: 'Please provide a date query parameter (YYYY-MM-DD)' });
    }

    const targetDate = new Date(date + 'T00:00:00');
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, ...

    // Fetch availability
    const availability = await Availability.findOne({ therapistId });
    if (!availability) {
      return res.status(404).json({ success: false, message: 'Availability schedule not configured for this therapist' });
    }

    // Check if blocked date
    const isBlocked = availability.blockedDates.some((b) => b.date === date);
    if (isBlocked) {
      return res.json({ success: true, slots: [], message: 'Practitioner is unavailable on this date' });
    }

    // Find schedule for day of week
    const daySchedule = availability.weeklySchedule.find((s) => s.dayOfWeek === dayOfWeek);
    if (!daySchedule || !daySchedule.enabled) {
      return res.json({ success: true, slots: [], message: 'Practitioner does not take sessions on this day' });
    }

    const sessionDuration = Number(duration) || availability.sessionDuration || 50;
    const bufferTime = availability.bufferTime || 10;
    const slotIncrement = sessionDuration + bufferTime;

    const dayStartMin = timeToMinutes(daySchedule.startTime);
    const dayEndMin = timeToMinutes(daySchedule.endTime);
    const breakStartMin = daySchedule.breakStart ? timeToMinutes(daySchedule.breakStart) : null;
    const breakEndMin = daySchedule.breakEnd ? timeToMinutes(daySchedule.breakEnd) : null;

    // Fetch existing booked sessions on this date that are active
    const bookedSessions = await Session.find({
      therapistId,
      date,
      status: { $in: ['Upcoming'] },
    }).lean();

    const bookedTimeRanges = bookedSessions.map((s) => ({
      start: timeToMinutes(s.startTime),
      end: timeToMinutes(s.endTime),
    }));

    const slots = [];
    let currentMin = dayStartMin;

    while (currentMin + sessionDuration <= dayEndMin) {
      const slotEndMin = currentMin + sessionDuration;
      const slotStartStr = minutesToTime(currentMin);
      const slotEndStr = minutesToTime(slotEndMin);

      // Check break overlap
      let overlapsBreak = false;
      if (breakStartMin !== null && breakEndMin !== null) {
        if (currentMin < breakEndMin && slotEndMin > breakStartMin) {
          overlapsBreak = true;
        }
      }

      // Check booked session overlap
      let isBooked = false;
      for (const booked of bookedTimeRanges) {
        if (currentMin < booked.end && slotEndMin > booked.start) {
          isBooked = true;
          break;
        }
      }

      if (!overlapsBreak) {
        slots.push({
          startTime: slotStartStr,
          endTime: slotEndStr,
          duration: sessionDuration,
          available: !isBooked,
        });
      }

      currentMin += slotIncrement;
    }

    res.json({
      success: true,
      date,
      dayName: daySchedule.dayName,
      totalSlots: slots.length,
      availableCount: slots.filter((s) => s.available).length,
      slots,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new booking with STRICT double-booking prevention
// @route   POST /api/bookings
// @access  Public / Client Authenticated
exports.createBooking = async (req, res, next) => {
  try {
    const {
      therapistId,
      date,
      startTime,
      endTime,
      duration,
      serviceName,
      sessionType,
      clientName,
      clientEmail,
      clientPhone,
      clientNotes,
      paymentMethod,
    } = req.body;

    if (!therapistId || !date || !startTime || !clientEmail || !clientName) {
      return res.status(400).json({
        success: false,
        message: 'Therapist, date, startTime, clientName, and clientEmail are required',
      });
    }

    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    // 1. CRITICAL: DOUBLE-BOOKING PREVENTATIVE CHECK
    const existingConflict = await Session.findOne({
      therapistId,
      date,
      startTime,
      status: { $in: ['Upcoming'] },
    });

    if (existingConflict) {
      return res.status(409).json({
        success: false,
        message: 'Conflict: This time slot has just been reserved by another client. Please select another slot.',
      });
    }

    // 2. Identify or automatically register Client record
    let client = await Client.findOne({ email: clientEmail.toLowerCase(), therapistId });
    if (!client) {
      client = await Client.create({
        therapistId,
        name: clientName,
        email: clientEmail.toLowerCase(),
        phone: clientPhone || '',
        password: 'ClientDefault123!',
        status: 'Active',
        tags: ['New Booking'],
      });
    }

    const calculatedEndTime =
      endTime ||
      minutesToTime(timeToMinutes(startTime) + (Number(duration) || therapist.services?.[0]?.duration || 50));

    const fee = therapist.consultationFee || 1500;

    // 3. Create Session in DB
    const session = await Session.create({
      therapistId,
      clientId: client._id,
      serviceName: serviceName || therapist.services?.[0]?.name || 'Individual Therapy Session',
      date,
      startTime,
      endTime: calculatedEndTime,
      duration: Number(duration) || 50,
      fee,
      sessionType: sessionType || 'Online Video',
      clientNotes: clientNotes || '',
      paymentStatus: paymentMethod === 'offline' ? 'Pending' : 'Pending',
      status: 'Upcoming',
    });

    // 4. Send notifications
    await notificationService.notify({
      recipientId: therapist._id,
      recipientRole: 'therapist',
      type: 'BookingConfirmation',
      title: 'New Appointment Booked',
      message: `${client.name} booked a session for ${date} at ${startTime}.`,
      link: `/appointments`,
      email: therapist.email,
    });

    await notificationService.notify({
      recipientId: client._id,
      recipientRole: 'client',
      type: 'BookingConfirmation',
      title: 'Session Booking Confirmed',
      message: `Your session with ${therapist.name} is confirmed for ${date} at ${startTime}.`,
      link: `/portal/appointments`,
      email: client.email,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      booking: session,
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get therapist's sessions/bookings
// @route   GET /api/bookings/therapist
// @access  Private (Therapist)
exports.getTherapistBookings = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const query = { therapistId: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }
    if (date) {
      query.date = date;
    }

    const bookings = await Session.find(query)
      .populate('clientId', 'name email phone status intakeCompleted consentSigned')
      .sort({ date: 1, startTime: 1 })
      .lean();

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
};

// @desc    Get client's sessions
// @route   GET /api/bookings/client
// @access  Private (Client)
exports.getClientBookings = async (req, res, next) => {
  try {
    const bookings = await Session.find({ clientId: req.user._id })
      .populate('therapistId', 'name title clinicAddress profileImage slug')
      .sort({ date: -1, startTime: -1 })
      .lean();

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
};

// @desc    Update appointment status (Completed, Cancelled, No-show)
// @route   PUT /api/bookings/:id
// @access  Private (Therapist or Client)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, cancellationReason, paymentStatus } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session booking not found' });
    }

    // Role verification
    if (req.user.role === 'therapist' && session.therapistId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized practice access' });
    }
    if (req.user.role === 'client' && session.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized client access' });
    }

    if (status) {
      session.status = status;
      if (status === 'Cancelled') {
        session.cancellationReason = cancellationReason || 'Cancelled by user';
        session.cancelledAt = new Date();
      }
    }

    if (paymentStatus && req.user.role === 'therapist') {
      session.paymentStatus = paymentStatus;
    }

    await session.save();

    res.json({ success: true, session });
  } catch (err) {
    next(err);
  }
};
