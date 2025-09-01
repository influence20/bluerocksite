const Otp = require('../models/otp.model');
const User = require('../models/user.model');
const Client = require('../models/client.model');
const emailService = require('../utils/emailEnhanced');

/**
 * Generate and send OTP for various purposes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.generateOTP = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Your account is not active. Please contact support.'
      });
    }
    
    // Delete any existing OTPs for this user and purpose
    await Otp.deleteMany({ user: user._id, purpose });
    
    // Create new OTP
    const otpDoc = new Otp({
      user: user._id,
      email: user.email,
      purpose
    });
    
    // Generate OTP
    const otpValue = otpDoc.generateOTP(6); // 6-digit OTP
    
    // Save OTP document
    await otpDoc.save();
    
    // Get client details if user is a client
    let clientName = user.name;
    if (user.role === 'client') {
      const client = await Client.findOne({ user: user._id });
      if (client) {
        clientName = client.firstName;
      }
    }
    
    // Send OTP email
    try {
      // Format expiry time
      const expiryMinutes = Math.round((otpDoc.otp.expiresAt - Date.now()) / 60000);
      
      await emailService.sendOTPEmail({
        email: user.email,
        name: clientName,
        otp: otpValue,
        expiryTime: `${expiryMinutes} minutes`,
        purpose: getPurposeText(purpose)
      });
      
      res.status(200).json({
        success: true,
        message: `OTP sent to ${email}`,
        data: {
          email,
          purpose,
          expiresAt: otpDoc.otp.expiresAt
        }
      });
    } catch (err) {
      console.error('Error sending OTP email:', err);
      
      // Delete the OTP document if email fails
      await Otp.findByIdAndDelete(otpDoc._id);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Verify OTP
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, purpose } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Find OTP document
    const otpDoc = await Otp.findOne({ 
      user: user._id, 
      email, 
      purpose 
    }).select('+otp.value');
    
    if (!otpDoc) {
      return res.status(404).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }
    
    // Check if OTP is expired
    if (otpDoc.isExpired()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }
    
    // Check if max attempts reached
    if (otpDoc.isMaxAttemptsReached()) {
      return res.status(400).json({
        success: false,
        message: 'Maximum verification attempts reached. Please request a new OTP.'
      });
    }
    
    // Verify OTP
    const isValid = otpDoc.verifyOTP(otp);
    
    // Save updated attempts count
    await otpDoc.save();
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
        attemptsLeft: otpDoc.maxAttempts - otpDoc.attempts
      });
    }
    
    // Handle specific actions based on purpose
    let result = {};
    switch (purpose) {
      case 'login':
        // For 2FA login, we'll handle this in the auth controller
        result = { verified: true };
        break;
      
      case 'withdrawal':
        // For withdrawal verification, we'll handle this in the withdrawal controller
        result = { verified: true };
        break;
      
      case 'profile_update':
        // For profile updates, we'll handle this in the user controller
        result = { verified: true };
        break;
      
      case 'email_verification':
        // For email verification
        user.isEmailVerified = true;
        await user.save();
        result = { verified: true, emailVerified: true };
        break;
      
      default:
        result = { verified: true };
    }
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Resend OTP
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
exports.resendOTP = async (req, res, next) => {
  try {
    const { email, purpose } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Find existing OTP document
    let otpDoc = await Otp.findOne({ user: user._id, email, purpose });
    
    // If no existing OTP or OTP is expired, create a new one
    if (!otpDoc || otpDoc.isExpired()) {
      // Delete any existing OTPs
      if (otpDoc) {
        await Otp.findByIdAndDelete(otpDoc._id);
      }
      
      // Create new OTP
      otpDoc = new Otp({
        user: user._id,
        email: user.email,
        purpose
      });
    } else {
      // Check if resend is allowed (prevent abuse)
      const lastCreatedAt = new Date(otpDoc.createdAt);
      const currentTime = new Date();
      const timeDiff = (currentTime - lastCreatedAt) / 1000; // in seconds
      
      if (timeDiff < 60) { // Allow resend after 60 seconds
        return res.status(429).json({
          success: false,
          message: `Please wait ${Math.ceil(60 - timeDiff)} seconds before requesting a new OTP`,
          retryAfter: Math.ceil(60 - timeDiff)
        });
      }
      
      // Reset attempts and generate new OTP
      otpDoc.attempts = 0;
    }
    
    // Generate new OTP
    const otpValue = otpDoc.generateOTP(6);
    
    // Save OTP document
    await otpDoc.save();
    
    // Get client details if user is a client
    let clientName = user.name;
    if (user.role === 'client') {
      const client = await Client.findOne({ user: user._id });
      if (client) {
        clientName = client.firstName;
      }
    }
    
    // Send OTP email
    try {
      // Format expiry time
      const expiryMinutes = Math.round((otpDoc.otp.expiresAt - Date.now()) / 60000);
      
      await emailService.sendOTPEmail({
        email: user.email,
        name: clientName,
        otp: otpValue,
        expiryTime: `${expiryMinutes} minutes`,
        purpose: getPurposeText(purpose)
      });
      
      res.status(200).json({
        success: true,
        message: `OTP resent to ${email}`,
        data: {
          email,
          purpose,
          expiresAt: otpDoc.otp.expiresAt
        }
      });
    } catch (err) {
      console.error('Error sending OTP email:', err);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Get human-readable purpose text
 * @param {string} purpose - OTP purpose code
 * @returns {string} - Human-readable purpose text
 */
function getPurposeText(purpose) {
  switch (purpose) {
    case 'login':
      return 'Two-Factor Authentication';
    case 'withdrawal':
      return 'Withdrawal Verification';
    case 'profile_update':
      return 'Profile Update Verification';
    case 'email_verification':
      return 'Email Verification';
    default:
      return 'Account Verification';
  }
}