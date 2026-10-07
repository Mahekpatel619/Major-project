const SubscriptionTierConfig = require('../models/SubscriptionTierConfig');
const Therapist = require('../models/Therapist');
const entitlementService = require('../services/entitlementService');

// @desc    Get all available subscription tier configurations
// @route   GET /api/subscriptions/tiers
// @access  Public
exports.getTiers = async (req, res, next) => {
  try {
    const tiers = await SubscriptionTierConfig.find().sort({ monthlyPrice: 1 }).lean();
    res.json({ success: true, tiers });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current therapist subscription tier and computed limits
// @route   GET /api/subscriptions/my-entitlements
// @access  Private (Therapist)
exports.getMyEntitlements = async (req, res, next) => {
  try {
    const entitlements = await entitlementService.getTherapistEntitlements(req.user._id);
    res.json({ success: true, entitlements });
  } catch (err) {
    next(err);
  }
};

// @desc    Upgrade or change therapist subscription tier
// @route   POST /api/subscriptions/upgrade
// @access  Private (Therapist)
exports.upgradePlan = async (req, res, next) => {
  try {
    const { tierName } = req.body; // 'Free', 'Pro', 'Premium'

    if (!['Free', 'Pro', 'Premium'].includes(tierName)) {
      return res.status(400).json({ success: false, message: 'Invalid subscription tier' });
    }

    const therapist = await Therapist.findByIdAndUpdate(
      req.user._id,
      {
        subscriptionPlan: tierName,
        subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
      { new: true }
    );

    const entitlements = await entitlementService.getTherapistEntitlements(therapist._id);

    res.json({
      success: true,
      message: `Successfully updated subscription to ${tierName} plan`,
      currentPlan: tierName,
      entitlements,
    });
  } catch (err) {
    next(err);
  }
};
