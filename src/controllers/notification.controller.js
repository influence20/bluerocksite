const User = require('../models/user.model');
const { requireOtpVerification } = require('../middleware/otpVerification');

/**
 * Get user notification preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.getNotificationPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        emailNotifications: user.emailNotifications,
        notificationPreferences: user.notificationPreferences
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update user notification preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.updateNotificationPreferences = async (req, res, next) => {
  try {
    const { emailNotifications, notificationPreferences } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update preferences
    if (emailNotifications !== undefined) {
      user.emailNotifications = emailNotifications;
    }
    
    if (notificationPreferences) {
      // Update only the provided preferences
      if (notificationPreferences.withdrawals !== undefined) {
        user.notificationPreferences.withdrawals = notificationPreferences.withdrawals;
      }
      
      if (notificationPreferences.deposits !== undefined) {
        user.notificationPreferences.deposits = notificationPreferences.deposits;
      }
      
      if (notificationPreferences.investments !== undefined) {
        user.notificationPreferences.investments = notificationPreferences.investments;
      }
      
      if (notificationPreferences.accountUpdates !== undefined) {
        user.notificationPreferences.accountUpdates = notificationPreferences.accountUpdates;
      }
      
      if (notificationPreferences.marketingEmails !== undefined) {
        user.notificationPreferences.marketingEmails = notificationPreferences.marketingEmails;
      }
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        emailNotifications: user.emailNotifications,
        notificationPreferences: user.notificationPreferences
      },
      message: 'Notification preferences updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Enable two-factor authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.enableTwoFactor = [
  requireOtpVerification('profile_update'),
  async (req, res, next) => {
    try {
      const { method } = req.body;
      
      // Validate method
      if (!method || !['email', 'app'].includes(method)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid 2FA method. Must be "email" or "app".'
        });
      }
      
      // Find user
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Enable 2FA
      user.twoFactorEnabled = true;
      user.twoFactorMethod = method;
      
      // If using app-based 2FA, generate secret
      if (method === 'app') {
        // This would typically generate a TOTP secret and QR code
        // For now, we'll just use email-based 2FA
        return res.status(400).json({
          success: false,
          message: 'App-based 2FA is not yet implemented. Please use email-based 2FA.'
        });
      }
      
      await user.save();
      
      res.status(200).json({
        success: true,
        data: {
          twoFactorEnabled: user.twoFactorEnabled,
          twoFactorMethod: user.twoFactorMethod
        },
        message: 'Two-factor authentication enabled successfully'
      });
    } catch (err) {
      next(err);
    }
  }
];

/**
 * Disable two-factor authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.disableTwoFactor = [
  requireOtpVerification('profile_update'),
  async (req, res, next) => {
    try {
      // Find user
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Disable 2FA
      user.twoFactorEnabled = false;
      user.twoFactorMethod = 'email'; // Reset to default
      user.twoFactorSecret = undefined;
      
      await user.save();
      
      res.status(200).json({
        success: true,
        data: {
          twoFactorEnabled: user.twoFactorEnabled
        },
        message: 'Two-factor authentication disabled successfully'
      });
    } catch (err) {
      next(err);
    }
  }
];

/**
 * Get two-factor authentication status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.getTwoFactorStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        twoFactorEnabled: user.twoFactorEnabled,
        twoFactorMethod: user.twoFactorMethod
      }
    });
  } catch (err) {
    next(err);
  }
};