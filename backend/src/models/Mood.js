const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
      index: true,
    },
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
      index: true,
    },
    mood: {
      type: String,
      enum: ['Happy', 'Okay', 'Sad', 'Angry', 'Stressed'],
      required: true,
    },
    energyLevel: {
      type: Number, // 1 to 5
      default: 3,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: String, // "YYYY-MM-DD"
      required: true,
      index: true,
    },
    loggedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for querying client moods by date order
moodSchema.index({ clientId: 1, date: -1 });

module.exports = mongoose.model('Mood', moodSchema);
