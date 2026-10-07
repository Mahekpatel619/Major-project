const mongoose = require('mongoose');

const consentSchema = new mongoose.Schema(
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
    consentVersion: {
      type: String,
      default: 'v1.0-2026',
    },
    consentText: {
      type: String,
      required: true,
    },
    consentStatus: {
      type: String,
      enum: ['Agreed', 'Revoked'],
      default: 'Agreed',
    },
    clientSignatureName: {
      type: String,
      required: true,
    },
    signedAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consent', consentSchema);
