const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
      unique: true,
      index: true,
    },
    weeklySchedule: [
      {
        dayOfWeek: {
          type: Number, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
          required: true,
        },
        dayName: {
          type: String,
        },
        enabled: {
          type: Boolean,
          default: true,
        },
        startTime: {
          type: String, // e.g. "09:00" (24h)
          default: "10:00",
        },
        endTime: {
          type: String, // e.g. "18:00"
          default: "18:00",
        },
        breakStart: {
          type: String,
          default: "13:00",
        },
        breakEnd: {
          type: String,
          default: "14:00",
        },
      },
    ],
    sessionDuration: {
      type: Number,
      default: 50, // in minutes
    },
    bufferTime: {
      type: Number,
      default: 10, // in minutes
    },
    blockedDates: [
      {
        date: { type: String }, // "YYYY-MM-DD"
        reason: { type: String, default: 'Leave / Holiday' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Availability', availabilitySchema);
