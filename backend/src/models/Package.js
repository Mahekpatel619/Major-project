const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true, // e.g. "Foundation Care - 3 Sessions"
    },
    numberOfSessions: {
      type: Number,
      required: true, // 3, 6, 12
    },
    price: {
      type: Number,
      required: true, // in INR
    },
    discountPercentage: {
      type: Number,
      default: 10,
    },
    validityDays: {
      type: Number,
      default: 90, // e.g., 90 days validity
    },
    description: {
      type: String,
      default: 'A discounted care bundle for structured therapy continuity.',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);
