const mongoose = require('mongoose');
const Session = require('../models/Session');
const Payment = require('../models/Payment');
const Client = require('../models/Client');
const entitlementService = require('../services/entitlementService');

// @desc    Get therapist analytics dashboard with MongoDB aggregations
// @route   GET /api/analytics/dashboard
// @access  Private (Therapist)
exports.getAnalyticsDashboard = async (req, res, next) => {
  try {
    const therapistId = new mongoose.Types.ObjectId(req.user._id);

    // Entitlement check for advanced analytics
    const access = await entitlementService.canAccess(therapistId, 'advancedAnalytics');

    // 1. Basic Stats (Available on all tiers)
    const totalClients = await Client.countDocuments({ therapistId });
    const activeClients = await Client.countDocuments({ therapistId, status: 'Active' });
    const totalSessions = await Session.countDocuments({ therapistId });
    const upcomingSessions = await Session.countDocuments({ therapistId, status: 'Upcoming' });
    const completedSessions = await Session.countDocuments({ therapistId, status: 'Completed' });
    const noShowSessions = await Session.countDocuments({ therapistId, status: 'No-show' });
    const cancelledSessions = await Session.countDocuments({ therapistId, status: 'Cancelled' });

    // No-show rate calculation
    const attendanceEligible = completedSessions + noShowSessions;
    const noShowRate = attendanceEligible > 0 ? Math.round((noShowSessions / attendanceEligible) * 100) : 0;

    // Monthly Revenue aggregation (last 6 months)
    const revenueAgg = await Payment.aggregate([
      {
        $match: {
          therapistId,
          paymentStatus: 'Successful',
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalRevenue: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format monthly revenue for charts
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueTrends = revenueAgg.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: item.totalRevenue,
      transactions: item.transactionCount,
    }));

    // If empty, supply current month anchor with 0 so charts render gracefully
    if (revenueTrends.length === 0) {
      const currentMonth = monthNames[new Date().getMonth()];
      revenueTrends.push({ month: currentMonth, revenue: 0, transactions: 0 });
    }

    // Total Revenue collected all time
    const totalRevenueResult = await Payment.aggregate([
      { $match: { therapistId, paymentStatus: 'Successful' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Pending payments amount
    const pendingRevenueResult = await Payment.aggregate([
      { $match: { therapistId, paymentStatus: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const pendingRevenue = pendingRevenueResult[0]?.total || 0;

    // Sessions by status aggregation
    const sessionStatusBreakdown = [
      { name: 'Completed', value: completedSessions, color: '#10b981' },
      { name: 'Upcoming', value: upcomingSessions, color: '#3b82f6' },
      { name: 'No-show', value: noShowSessions, color: '#ef4444' },
      { name: 'Cancelled', value: cancelledSessions, color: '#94a3b8' },
    ];

    // Client growth over recent months
    const clientGrowthAgg = await Client.aggregate([
      { $match: { therapistId } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const clientGrowthTrends = clientGrowthAgg.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      clients: item.count,
    }));

    res.json({
      success: true,
      hasAdvancedAccess: access.allowed,
      overview: {
        totalRevenue,
        pendingRevenue,
        totalClients,
        activeClients,
        totalSessions,
        upcomingSessions,
        completedSessions,
        noShowSessions,
        noShowRate, // in percentage
      },
      revenueTrends,
      sessionStatusBreakdown,
      clientGrowthTrends,
    });
  } catch (err) {
    next(err);
  }
};
