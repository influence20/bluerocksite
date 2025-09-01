const User = require('../models/user.model');
const Client = require('../models/client.model');
const emailService = require('../utils/emailEnhanced');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'client',
      phone
    });

    // If role is client, create a client profile
    if (user.role === 'client') {
      await Client.create({
        user: user._id,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' '),
        email,
        phone
      });
    }

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail({
        email: user.email,
        name: user.name
      });
    } catch (err) {
      console.log('Email could not be sent', err);
    }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Your account is not active. Please contact support.'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // If OTP is not provided, send OTP and require 2FA
      if (!otp) {
        // Delete any existing OTPs for this user and login purpose
        const Otp = require('../models/otp.model');
        await Otp.deleteMany({ user: user._id, purpose: 'login' });
        
        // Create new OTP
        const otpDoc = new Otp({
          user: user._id,
          email: user.email,
          purpose: 'login'
        });
        
        // Generate OTP
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
            purpose: 'Two-Factor Authentication'
          });
          
          return res.status(200).json({
            success: true,
            message: 'Two-factor authentication required',
            data: {
              requireOtp: true,
              email: user.email,
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
      } else {
        // Verify OTP
        const Otp = require('../models/otp.model');
        const otpDoc = await Otp.findOne({ 
          user: user._id, 
          email: user.email, 
          purpose: 'login' 
        }).select('+otp.value');
        
        if (!otpDoc) {
          return res.status(400).json({
            success: false,
            message: 'OTP not found or expired. Please request a new one.'
          });
        }
        
        // Check if OTP is expired
        if (otpDoc.isExpired()) {
          return res.status(400).json({
            success: false,
            message: 'OTP has expired. Please request a new one.',
            data: {
              requireOtp: true
            }
          });
        }
        
        // Check if max attempts reached
        if (otpDoc.isMaxAttemptsReached()) {
          return res.status(400).json({
            success: false,
            message: 'Maximum verification attempts reached. Please request a new OTP.',
            data: {
              requireOtp: true
            }
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
            attemptsLeft: otpDoc.maxAttempts - otpDoc.attempts,
            data: {
              requireOtp: true
            }
          });
        }
      }
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // If user is a client, get client details
    let clientData = null;
    if (user.role === 'client') {
      clientData = await Client.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        client: clientData
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    // If user is a client, update client details
    if (user.role === 'client' && (req.body.firstName || req.body.lastName)) {
      const clientFields = {};
      if (req.body.firstName) clientFields.firstName = req.body.firstName;
      if (req.body.lastName) clientFields.lastName = req.body.lastName;
      if (req.body.email) clientFields.email = req.body.email;
      if (req.body.phone) clientFields.phone = req.body.phone;
      
      await Client.findOneAndUpdate({ user: user._id }, clientFields, {
        new: true,
        runValidators: true
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'There is no user with that email'
      });
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || req.protocol + '://' + req.get('host')}/reset-password/${resetToken}`;

    try {
      await emailService.sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        resetToken: resetToken
      });

      res.status(200).json({
        success: true,
        message: 'Email sent'
      });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
};