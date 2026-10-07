const { calculateNoShowRisk } = require('../services/riskCalculationService');
const Client = require('../models/Client');

// @desc    Calculate rule-based attendance and no-show risk score for a client
// @route   GET /api/risk/:clientId
// @access  Private (Therapist)
exports.getClientRisk = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const client = await Client.findOne({ _id: clientId, therapistId: req.user._id });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found in your practice' });
    }

    const riskAssessment = await calculateNoShowRisk(clientId);

    res.json({
      success: true,
      clientId,
      clientName: client.name,
      ...riskAssessment,
    });
  } catch (err) {
    next(err);
  }
};
