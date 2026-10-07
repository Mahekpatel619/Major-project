const entitlementService = require('../services/entitlementService');

const requireEntitlement = (featureKey) => {
  return async (req, res, next) => {
    try {
      const therapistId = req.therapistId || req.user?._id;
      if (!therapistId) {
        return res.status(403).json({ success: false, message: 'Therapist context missing' });
      }

      const access = await entitlementService.canAccess(therapistId, featureKey);
      if (!access.allowed) {
        return res.status(403).json({
          success: false,
          upgradeRequired: true,
          featureKey,
          currentTier: access.currentTier,
          message: access.reason || 'Upgrade required to access this feature',
        });
      }

      next();
    } catch (err) {
      console.error('Entitlement check error:', err);
      next(err);
    }
  };
};

module.exports = { requireEntitlement };
