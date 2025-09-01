const mongoose = require('mongoose');
const crypto = require('crypto');

const OtpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['login', 'withdrawal', 'profile_update', 'email_verification', 'other'],
    required: true
  },
  otp: {
    value: {
      type: String,
      required: true,
      select: false
    },
    expiresAt: {
      type: Date,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedAt: {
      type: Date
    }
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 5
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index to automatically expire OTP documents
OtpSchema.index({ 'otp.expiresAt': 1 }, { expireAfterSeconds: 0 });

/**
 * Generate a new OTP
 * @param {number} length - Length of the OTP (default: 6)
 * @returns {string} - The generated OTP
 */
OtpSchema.methods.generateOTP = function(length = 6) {
  // Generate a random numeric OTP
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const otp = Math.floor(min + Math.random() * (max - min + 1)).toString();
  
  // Hash the OTP
  const hashedOtp = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');
  
  // Set OTP value and expiry
  this.otp.value = hashedOtp;
  
  // Set expiry time (default: 10 minutes)
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  this.otp.expiresAt = expiresAt;
  
  // Reset verification status and attempts
  this.otp.verified = false;
  this.otp.verifiedAt = undefined;
  this.attempts = 0;
  
  return otp;
};

/**
 * Verify an OTP
 * @param {string} enteredOtp - The OTP entered by the user
 * @returns {boolean} - Whether the OTP is valid
 */
OtpSchema.methods.verifyOTP = function(enteredOtp) {
  // Check if OTP is expired
  if (Date.now() > this.otp.expiresAt) {
    return false;
  }
  
  // Check if max attempts reached
  if (this.attempts >= this.maxAttempts) {
    return false;
  }
  
  // Increment attempts
  this.attempts += 1;
  
  // Hash the entered OTP
  const hashedEnteredOtp = crypto
    .createHash('sha256')
    .update(enteredOtp)
    .digest('hex');
  
  // Compare hashed OTPs
  const isValid = hashedEnteredOtp === this.otp.value;
  
  // If valid, mark as verified
  if (isValid) {
    this.otp.verified = true;
    this.otp.verifiedAt = Date.now();
  }
  
  return isValid;
};

/**
 * Check if OTP is expired
 * @returns {boolean} - Whether the OTP is expired
 */
OtpSchema.methods.isExpired = function() {
  return Date.now() > this.otp.expiresAt;
};

/**
 * Check if max attempts reached
 * @returns {boolean} - Whether max attempts reached
 */
OtpSchema.methods.isMaxAttemptsReached = function() {
  return this.attempts >= this.maxAttempts;
};

/**
 * Extend OTP expiry time
 * @param {number} minutes - Minutes to extend (default: 10)
 */
OtpSchema.methods.extendExpiry = function(minutes = 10) {
  const newExpiresAt = new Date(this.otp.expiresAt);
  newExpiresAt.setMinutes(newExpiresAt.getMinutes() + minutes);
  this.otp.expiresAt = newExpiresAt;
};

module.exports = mongoose.model('Otp', OtpSchema);