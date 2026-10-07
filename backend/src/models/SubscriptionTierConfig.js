const mongoose = require('mongoose');

const subscriptionTierConfigSchema = new mongoose.Schema(
  {
    tierName: {
      type: String,
      enum: ['Free', 'Pro', 'Premium'],
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    monthlyPrice: {
      type: Number,
      required: true, // in INR
    },
    annualPrice: {
      type: Number,
      required: true, // in INR (discounted)
    },
    description: {
      type: String,
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    limits: {
      maxActiveClients: {
        type: Number, // e.g. 5 for Free, 30 for Pro, -1 for Unlimited
        default: 5,
      },
      advancedAnalytics: {
        type: Boolean,
        default: false,
      },
      advancedNoteTemplates: {
        type: Boolean, // SOAP / DAP templates
        default: false,
      },
      sessionPackages: {
        type: Boolean,
        default: false,
      },
      customBranding: {
        type: Boolean,
        default: false,
      },
      homeworkSharing: {
        type: Boolean,
        default: true,
      },
      noShowRiskAI: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SubscriptionTierConfig', subscriptionTierConfigSchema);
