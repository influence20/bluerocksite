const express = require('express');
const { protect } = require('../middleware/auth');
const notificationController = require('../controllers/notification.controller');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Notification preferences routes
router.get('/preferences', notificationController.getNotificationPreferences);
router.put('/preferences', notificationController.updateNotificationPreferences);

// Two-factor authentication routes
router.get('/2fa', notificationController.getTwoFactorStatus);
router.post('/2fa/enable', notificationController.enableTwoFactor);
router.post('/2fa/disable', notificationController.disableTwoFactor);

module.exports = router;