const Mood = require('../models/Mood');
const notificationService = require('../services/notificationService');

// Mood numerical scores for trending
const MOOD_SCORES = {
  Happy: 5,
  Okay: 4,
  Stressed: 3,
  Sad: 2,
  Angry: 1,
};

// @desc    Log client mood entry
// @route   POST /api/moods
// @access  Private (Client)
exports.logMood = async (req, res, next) => {
  try {
    const { mood, note, date, energyLevel } = req.body;

    if (!mood) {
      return res.status(400).json({ success: false, message: 'Please select a mood' });
    }

    const todayDate = date || new Date().toISOString().split('T')[0];

    const moodEntry = await Mood.create({
      clientId: req.user._id,
      therapistId: req.user.therapistId,
      mood,
      note: note || '',
      energyLevel: energyLevel || 3,
      date: todayDate,
    });

    // Notify therapist if mood is Sad or Angry (supportive check-in nudge)
    if (['Sad', 'Angry', 'Stressed'].includes(mood)) {
      await notificationService.notify({
        recipientId: req.user.therapistId,
        recipientRole: 'therapist',
        type: 'MoodLogged',
        title: 'Client Mood Update',
        message: `${req.user.name} logged feeling ${mood} today.`,
        link: `/clients/${req.user._id}`,
      });
    }

    res.status(201).json({ success: true, mood: moodEntry });
  } catch (err) {
    next(err);
  }
};

// @desc    Get mood logs for a specific client (Therapist or Client self)
// @route   GET /api/moods/:clientId
// @access  Private
exports.getClientMoods = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    // Authorization check
    if (req.user.role === 'client' && req.user._id.toString() !== clientId) {
      return res.status(403).json({ success: false, message: 'Cannot access another client moods' });
    }

    const moods = await Mood.find({ clientId }).sort({ date: -1, createdAt: -1 }).limit(30).lean();

    // Calculate mood distribution and trend data for Recharts
    const distribution = { Happy: 0, Okay: 0, Sad: 0, Angry: 0, Stressed: 0 };
    moods.forEach((m) => {
      if (distribution[m.mood] !== undefined) {
        distribution[m.mood]++;
      }
    });

    // Chronological points for trend line
    const trends = [...moods]
      .reverse()
      .map((m) => ({
        date: m.date,
        mood: m.mood,
        score: MOOD_SCORES[m.mood] || 3,
        energy: m.energyLevel || 3,
        note: m.note,
      }));

    res.json({
      success: true,
      count: moods.length,
      distribution,
      trends,
      moods,
      disclaimer: 'Wellness journaling tracking for therapeutic reflection; not a clinical diagnostic assessment.',
    });
  } catch (err) {
    next(err);
  }
};
