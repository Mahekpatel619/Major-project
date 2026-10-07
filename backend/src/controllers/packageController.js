const Package = require('../models/Package');
const ClientPackage = require('../models/ClientPackage');
const Payment = require('../models/Payment');
const entitlementService = require('../services/entitlementService');

// @desc    Get therapist's defined packages
// @route   GET /api/packages
// @access  Public / Private
exports.getPackages = async (req, res, next) => {
  try {
    const therapistId = req.user ? (req.user.role === 'therapist' ? req.user._id : req.user.therapistId) : req.query.therapistId;
    if (!therapistId) {
      return res.status(400).json({ success: false, message: 'Therapist ID is required' });
    }

    const packages = await Package.find({ therapistId, isActive: true }).lean();
    res.json({ success: true, count: packages.length, packages });
  } catch (err) {
    next(err);
  }
};

// @desc    Create package (gated by entitlement)
// @route   POST /api/packages
// @access  Private (Therapist)
exports.createPackage = async (req, res, next) => {
  try {
    const access = await entitlementService.canAccess(req.user._id, 'sessionPackages');
    if (!access.allowed) {
      return res.status(403).json({
        success: false,
        upgradeRequired: true,
        message: access.reason,
      });
    }

    const { name, numberOfSessions, price, discountPercentage, validityDays, description } = req.body;

    const pkg = await Package.create({
      therapistId: req.user._id,
      name,
      numberOfSessions,
      price,
      discountPercentage: discountPercentage || 10,
      validityDays: validityDays || 90,
      description: description || '',
    });

    res.status(201).json({ success: true, package: pkg });
  } catch (err) {
    next(err);
  }
};

// @desc    Purchase package for client
// @route   POST /api/packages/purchase
// @access  Private (Client or Therapist)
exports.purchasePackage = async (req, res, next) => {
  try {
    const { packageId, clientId, therapistId } = req.body;

    const targetClientId = clientId || req.user._id;
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const targetTherapistId = therapistId || pkg.therapistId;
    const validityDays = pkg.validityDays || 90;
    const expiresAt = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000);

    const clientPackage = await ClientPackage.create({
      therapistId: targetTherapistId,
      clientId: targetClientId,
      packageId: pkg._id,
      packageName: pkg.name,
      totalSessions: pkg.numberOfSessions,
      usedSessions: 0,
      remainingSessions: pkg.numberOfSessions,
      expiresAt,
      status: 'Active',
    });

    // Record invoice
    const invoiceNumber = `PKG-${Date.now().toString().slice(-6)}`;
    await Payment.create({
      therapistId: targetTherapistId,
      clientId: targetClientId,
      clientPackageId: clientPackage._id,
      amount: pkg.price,
      currency: 'INR',
      paymentStatus: 'Successful',
      orderId: `pkg_ord_${Date.now()}`,
      transactionId: `pkg_tx_${Date.now()}`,
      paymentMethod: 'Package Bundle Purchase',
      invoiceNumber,
      paidAt: new Date(),
    });

    res.status(201).json({ success: true, message: 'Package purchased successfully', clientPackage });
  } catch (err) {
    next(err);
  }
};

// @desc    Get client packages balance
// @route   GET /api/packages/client
// @access  Private (Client or Therapist)
exports.getClientPackages = async (req, res, next) => {
  try {
    const clientId = req.query.clientId || req.user._id;
    const packages = await ClientPackage.find({ clientId, status: 'Active' })
      .populate('packageId')
      .sort({ createdAt: -1 });

    res.json({ success: true, packages });
  } catch (err) {
    next(err);
  }
};
