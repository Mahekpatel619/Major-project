const Session = require('../models/Session');
const Payment = require('../models/Payment');

/**
 * Calculates rule-based appointment attendance risk
 * @param {string|ObjectId} clientId 
 */
const calculateNoShowRisk = async (clientId) => {
  // 1. Fetch client session history
  const sessions = await Session.find({ clientId });
  
  // 2. Count missed appointments
  const missedSessions = sessions.filter((s) => s.status === 'No-show');
  const missedCount = missedSessions.length;

  // 3. Count late cancellations (cancelled within 24 hours or marked cancelled)
  const lateCancellations = sessions.filter((s) => s.status === 'Cancelled');
  const lateCancelCount = lateCancellations.length;

  // 4. Check pending/unpaid sessions or payments
  const unpaidSessions = sessions.filter(
    (s) => s.paymentStatus === 'Pending' && s.status !== 'Cancelled'
  );
  const unpaidCount = unpaidSessions.length;

  // Also check pending payments in Payment model
  const pendingPayments = await Payment.countDocuments({
    clientId,
    paymentStatus: 'Pending',
  });

  const paymentIssueCount = Math.max(unpaidCount, pendingPayments);

  // 5. Calculate the score:
  // Missed appointment = +3
  // Late cancellation = +2
  // Pending/unpaid payment = +2
  let score = 0;
  const contributingFactors = [];

  if (missedCount > 0) {
    const points = missedCount * 3;
    score += points;
    contributingFactors.push({
      factor: 'Missed Appointments (No-show)',
      count: missedCount,
      weight: 3,
      points,
      description: `${missedCount} recorded no-show session(s)`,
    });
  }

  if (lateCancelCount > 0) {
    const points = lateCancelCount * 2;
    score += points;
    contributingFactors.push({
      factor: 'Late Cancellations',
      count: lateCancelCount,
      weight: 2,
      points,
      description: `${lateCancelCount} cancelled appointment(s)`,
    });
  }

  if (paymentIssueCount > 0) {
    const points = paymentIssueCount * 2;
    score += points;
    contributingFactors.push({
      factor: 'Pending / Unsettled Fees',
      count: paymentIssueCount,
      weight: 2,
      points,
      description: `${paymentIssueCount} pending payment obligation(s)`,
    });
  }

  // 6. Risk levels
  let riskLevel = 'Low Risk';
  let badgeColor = 'emerald';
  let recommendedAction = 'Normal reminder: Standard automated reminder 24h prior.';

  if (score >= 6) {
    riskLevel = 'High Risk';
    badgeColor = 'rose';
    recommendedAction = 'High attention: Send personalized confirmation SMS/WhatsApp & require advance fee settlement.';
  } else if (score >= 3) {
    riskLevel = 'Medium Risk';
    badgeColor = 'amber';
    recommendedAction = 'Moderate attention: Send dual reminder 48h and 12h prior to reconfirm session attendance.';
  }

  return {
    score,
    riskLevel,
    badgeColor,
    contributingFactors,
    recommendedAction,
    metrics: {
      totalBookings: sessions.length,
      missedCount,
      lateCancelCount,
      unpaidCount: paymentIssueCount,
    },
    disclaimer: 'Rule-based operational metric for scheduling logistics only; not a clinical assessment.',
  };
};

module.exports = { calculateNoShowRisk };
