const express = require('express');
const { protect } = require('../middleware/auth');
const otpController = require('../controllers/otp.controller');

const router = express.Router();

// Public routes
router.post('/generate', otpController.generateOTP);
router.post('/verify', otpController.verifyOTP);
router.post('/resend', otpController.resendOTP);

module.exports = router;