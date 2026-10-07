const Therapist = require('../models/Therapist');
const Client = require('../models/Client');
const SubscriptionTierConfig = require('../models/SubscriptionTierConfig');

// Default fallback configuration in case DB is not yet populated
const DEFAULT_TIERS = {
  Free: {
    limits: {
      maxActiveClients: 5,
      advancedAnalytics: false,
      advancedNoteTemplates: false,
      sessionPackages: false,
      customBranding: false,
      homeworkSharing: true,
      noShowRiskAI: false,
    },
  },
  Pro: {
    limits: {
      maxActiveClients: 30,
      advancedAnalytics: true,
      advancedNoteTemplates: true,
      sessionPackages: true,
      customBranding: true,
      homeworkSharing: true,
      noShowRiskAI: true,
    },
  },
  Premium: {
    limits: {
      maxActiveClients: -1, // Unlimited
      advancedAnalytics: true,
      advancedNoteTemplates: true,
      sessionPackages: true,
      customBranding: true,
      homeworkSharing: true,
      noShowRiskAI: true,
    },
  },
};

class EntitlementService {
  /**
   * Get subscription tier configuration from DB or fallback
   */
  async getTierConfig(tierName) {
    const config = await SubscriptionTierConfig.findOne({ tierName });
    if (config) return config;
    return DEFAULT_TIERS[tierName] || DEFAULT_TIERS.Free;
  }

  /**
   * Centralized check whether a therapist has entitlement for a given feature key
   * @param {string|ObjectId} therapistId
   * @param {string} featureKey e.g. 'advancedAnalytics', 'advancedNoteTemplates', 'sessionPackages', 'maxActiveClients'
   * @returns {Promise<{ allowed: boolean, reason?: string, currentTier: string, limit?: any }>}
   */
  async canAccess(therapistId, featureKey) {
    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return { allowed: false, reason: 'Therapist not found', currentTier: 'Free' };
    }

    const currentTier = therapist.subscriptionPlan || 'Free';
    const tierConfig = await this.getTierConfig(currentTier);
    const limits = tierConfig.limits || {};

    // Check specific feature key
    if (featureKey === 'maxActiveClients') {
      const maxLimit = limits.maxActiveClients ?? 5;
      if (maxLimit === -1) {
        return { allowed: true, currentTier, limit: -1 };
      }
      const activeClientsCount = await Client.countDocuments({
        therapistId,
        status: 'Active',
      });
      if (activeClientsCount >= maxLimit) {
        return {
          allowed: false,
          currentTier,
          limit: maxLimit,
          currentUsage: activeClientsCount,
          reason: `Your ${currentTier} plan allows up to ${maxLimit} active clients. You currently have ${activeClientsCount}.`,
        };
      }
      return { allowed: true, currentTier, limit: maxLimit, currentUsage: activeClientsCount };
    }

    // Boolean feature flags
    const isAllowed = Boolean(limits[featureKey]);
    if (!isAllowed) {
      return {
        allowed: false,
        currentTier,
        reason: `Feature '${featureKey}' is not included in your ${currentTier} plan. Please upgrade to unlock.`,
      };
    }

    return { allowed: true, currentTier };
  }

  /**
   * Get summary of all feature entitlements for frontend consumption
   */
  async getTherapistEntitlements(therapistId) {
    const therapist = await Therapist.findById(therapistId);
    if (!therapist) return null;

    const currentTier = therapist.subscriptionPlan || 'Free';
    const tierConfig = await this.getTierConfig(currentTier);
    const activeClientsCount = await Client.countDocuments({
      therapistId,
      status: 'Active',
    });

    return {
      tier: currentTier,
      expiresAt: therapist.subscriptionExpiresAt,
      limits: tierConfig.limits || {},
      usage: {
        activeClients: activeClientsCount,
        maxClients: tierConfig.limits?.maxActiveClients ?? 5,
      },
    };
  }
}

module.exports = new EntitlementService();
