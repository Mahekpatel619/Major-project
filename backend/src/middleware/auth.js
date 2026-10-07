const jwt = require('jsonwebtoken');
const Therapist = require('../models/Therapist');
const Client = require('../models/Client');

// Protect routes - verifies JWT
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route, token missing',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'unfazed_jwt_super_secret_key_2026_therapy_saas');

    if (decoded.role === 'therapist') {
      const therapist = await Therapist.findById(decoded.id).select('-password');
      if (!therapist) {
        return res.status(401).json({ success: false, message: 'Therapist account not found' });
      }
      req.user = therapist;
      req.user.role = 'therapist';
      req.therapistId = therapist._id;
    } else if (decoded.role === 'client') {
      const client = await Client.findById(decoded.id).select('-password');
      if (!client) {
        return res.status(401).json({ success: false, message: 'Client account not found' });
      }
      req.user = client;
      req.user.role = 'client';
      req.therapistId = client.therapistId;
    } else {
      return res.status(401).json({ success: false, message: 'Invalid token role' });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or expired',
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
