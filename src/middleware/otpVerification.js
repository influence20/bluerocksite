const Otp = require('../models/otp.model');

/**
 * Middleware to verify if a valid OTP exists for a user and purpose
 * @param {string} purpose - The purpose of the OTP
 * @returns {Function} - Express middleware function
 */
exports.requireOtpVerification = (purpose) => {
  return async (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to access this route'
        });
      }
      
      // Find verified OTP for this user and purpose
      const verifiedOtp = await Otp.findOne({
        user: req.user.id,
        purpose,
        'otp.verified': true,
        'otp.verifiedAt': { $exists: true }
      });
      
      if (!verifiedOtp) {
        return res.status(403).json({
          success: false,
          message: 'OTP verification required',
          data: {
            requireOtp: true,
            purpose
          }
        });
      }
      
      // Check if OTP verification is recent (within 30 minutes)
      const verifiedAt = new Date(verifiedOtp.otp.verifiedAt);
      const currentTime = new Date();
      const timeDiffMinutes = (currentTime - verifiedAt) / (1000 * 60);
      
      if (timeDiffMinutes > 30) {
        return res.status(403).json({
          success: false,
          message: 'OTP verification expired. Please verify again.',
          data: {
            requireOtp: true,
            purpose
          }
        });
      }
      
      // OTP is verified and recent, proceed to next middleware
      next();
    } catch (err) {
      console.error('OTP verification middleware error:', err);
      return res.status(500).json({
        success: false,
        message: 'Error verifying OTP'
      });
    }
  };
};

/**
 * Middleware to check if 2FA is enabled for a user
 * @returns {Function} - Express middleware function
 */
exports.check2faEnabled = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    // If user has 2FA enabled, require OTP verification
    if (req.user.twoFactorEnabled) {
      // Find verified OTP for this user and login purpose
      const verifiedOtp = await Otp.findOne({
        user: req.user.id,
        purpose: 'login',
        'otp.verified': true,
        'otp.verifiedAt': { $exists: true }
      });
      
      if (!verifiedOtp) {
        return res.status(403).json({
          success: false,
          message: '2FA verification required',
          data: {
            requireOtp: true,
            purpose: 'login'
          }
        });
      }
      
      // Check if OTP verification is recent (within session time)
      const verifiedAt = new Date(verifiedOtp.otp.verifiedAt);
      const currentTime = new Date();
      const timeDiffMinutes = (currentTime - verifiedAt) / (1000 * 60);
      
      if (timeDiffMinutes > 30) { // Session time: 30 minutes
        return res.status(403).json({
          success: false,
          message: '2FA session expired. Please verify again.',
          data: {
            requireOtp: true,
            purpose: 'login'
          }
        });
      }
    }
    
    // 2FA is not enabled or already verified, proceed to next middleware
    next();
  } catch (err) {
    console.error('2FA check middleware error:', err);
    return res.status(500).json({
      success: false,
      message: 'Error checking 2FA status'
    });
  }
};