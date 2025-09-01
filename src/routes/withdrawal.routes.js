const express = require('express');
const {
  createWithdrawal,
  verifyWithdrawalPin,
  getWithdrawals,
  getMyWithdrawals,
  getWithdrawal,
  updateWithdrawalStatus,
  generateNewPin,
  cancelWithdrawal,
  getWithdrawalStats
} = require('../controllers/withdrawal.controller');

const router = express.Router();

// Import middleware
const { protect, authorize } = require('../middleware/auth');

// Routes for all authenticated users
router.use(protect);

// Routes for clients
router.post('/', authorize('client'), createWithdrawal);
router.get('/my', authorize('client'), getMyWithdrawals);
router.post('/:id/verify', authorize('client'), verifyWithdrawalPin);

// Routes for admins and managers
router.get('/', authorize('admin', 'manager'), getWithdrawals);
router.get('/stats', authorize('admin', 'manager'), getWithdrawalStats);
router.put('/:id', authorize('admin', 'manager'), updateWithdrawalStatus);
router.post('/:id/generate-pin', authorize('admin'), generateNewPin);

// Routes for both clients and admins
router.get('/:id', getWithdrawal);
router.delete('/:id', cancelWithdrawal);

module.exports = router;