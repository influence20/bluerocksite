const Withdrawal = require('../models/withdrawal.model');
const Client = require('../models/client.model');
const Transaction = require('../models/transaction.model');
const emailService = require('../utils/emailEnhanced');

// @desc    Create new withdrawal request
// @route   POST /api/withdrawals
// @access  Private (Client)
exports.createWithdrawal = async (req, res, next) => {
  try {
    const { amount, method, destination } = req.body;
    
    // Get client
    const client = await Client.findOne({ user: req.user.id });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    // Check if amount is valid
    const minAmount = parseFloat(process.env.MIN_WITHDRAWAL_AMOUNT) || 100;
    const maxAmount = parseFloat(process.env.MAX_WITHDRAWAL_AMOUNT) || 50000;
    
    if (amount < minAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum withdrawal amount is $${minAmount}`
      });
    }
    
    if (amount > maxAmount) {
      return res.status(400).json({
        success: false,
        message: `Maximum withdrawal amount is $${maxAmount}`
      });
    }
    
    // Check if client has sufficient balance
    if (client.accountBalance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }
    
    // Create withdrawal request
    const withdrawal = new Withdrawal({
      client: client._id,
      amount,
      method,
      destination
    });
    
    // Generate PIN
    const pin = withdrawal.generateWithdrawalPin();
    
    await withdrawal.save();
    
    // Create transaction record
    const transaction = await Transaction.create({
      client: client._id,
      type: 'withdrawal',
      amount,
      status: 'pending',
      method,
      description: `Withdrawal request ${withdrawal.withdrawalId}`,
      relatedWithdrawal: withdrawal._id
    });
    
    // Update withdrawal with transaction reference
    withdrawal.transaction = transaction._id;
    await withdrawal.save();
    
    // Send PIN to client's email
    try {
      await emailService.sendOTPEmail({
        email: client.email,
        name: client.firstName,
        otp: pin,
        expiryTime: `${process.env.PIN_EXPIRY_HOURS || 48} hours`,
        purpose: 'Withdrawal Verification'
      });
    } catch (err) {
      console.log('Email could not be sent', err);
    }
    
    res.status(201).json({
      success: true,
      data: {
        withdrawal: {
          id: withdrawal._id,
          withdrawalId: withdrawal.withdrawalId,
          amount: withdrawal.amount,
          method: withdrawal.method,
          status: withdrawal.status,
          createdAt: withdrawal.createdAt
        },
        message: 'Withdrawal request created successfully. Please check your email for the verification PIN.'
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify withdrawal PIN
// @route   POST /api/withdrawals/:id/verify
// @access  Private (Client)
exports.verifyWithdrawalPin = async (req, res, next) => {
  try {
    const { pin } = req.body;
    
    // Get withdrawal with PIN data
    const withdrawal = await Withdrawal.findById(req.params.id).select('+pin.value +pin.expiresAt');
    
    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal request not found'
      });
    }
    
    // Check if client owns this withdrawal
    const client = await Client.findOne({ user: req.user.id });
    if (!client || withdrawal.client.toString() !== client._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to verify this withdrawal'
      });
    }
    
    // Check if PIN is already verified
    if (withdrawal.pin.verified) {
      return res.status(400).json({
        success: false,
        message: 'PIN already verified'
      });
    }
    
    // Check if PIN is expired
    if (Date.now() > withdrawal.pin.expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'PIN has expired. Please request a new withdrawal.'
      });
    }
    
    // Verify PIN
    const isValid = withdrawal.verifyPin(pin);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid PIN'
      });
    }
    
    // Update withdrawal status
    withdrawal.status = 'processing';
    await withdrawal.save();
    
    // Update transaction status
    if (withdrawal.transaction) {
      await Transaction.findByIdAndUpdate(withdrawal.transaction, {
        status: 'processing'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        withdrawal: {
          id: withdrawal._id,
          withdrawalId: withdrawal.withdrawalId,
          amount: withdrawal.amount,
          method: withdrawal.method,
          status: withdrawal.status,
          createdAt: withdrawal.createdAt
        },
        message: 'PIN verified successfully. Your withdrawal is now being processed.'
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all withdrawals
// @route   GET /api/withdrawals
// @access  Private (Admin/Manager)
exports.getWithdrawals = async (req, res, next) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Withdrawal.find(JSON.parse(queryStr))
      .populate({
        path: 'client',
        select: 'firstName lastName email phone'
      })
      .populate({
        path: 'processedBy',
        select: 'name'
      });
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Withdrawal.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const withdrawals = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: withdrawals.length,
      pagination,
      data: withdrawals
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get client withdrawals
// @route   GET /api/withdrawals/my
// @access  Private (Client)
exports.getMyWithdrawals = async (req, res, next) => {
  try {
    const client = await Client.findOne({ user: req.user.id });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    const withdrawals = await Withdrawal.find({ client: client._id })
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: withdrawals.length,
      data: withdrawals
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single withdrawal
// @route   GET /api/withdrawals/:id
// @access  Private
exports.getWithdrawal = async (req, res, next) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id)
      .populate({
        path: 'client',
        select: 'firstName lastName email phone accountBalance'
      })
      .populate({
        path: 'processedBy',
        select: 'name'
      })
      .populate({
        path: 'transaction',
        select: 'transactionId amount status'
      });
    
    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }
    
    // Check if user is authorized to view this withdrawal
    if (req.user.role === 'client') {
      const client = await Client.findOne({ user: req.user.id });
      
      if (!client || withdrawal.client._id.toString() !== client._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this withdrawal'
        });
      }
    }
    
    res.status(200).json({
      success: true,
      data: withdrawal
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update withdrawal status (Admin/Manager)
// @route   PUT /api/withdrawals/:id
// @access  Private (Admin/Manager)
exports.updateWithdrawalStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    
    // Find withdrawal
    let withdrawal = await Withdrawal.findById(req.params.id);
    
    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }
    
    // Update withdrawal
    withdrawal.status = status;
    if (notes) withdrawal.notes = notes;
    
    // If status is completed or rejected, set processedBy and processedAt
    if (status === 'completed' || status === 'rejected') {
      withdrawal.processedBy = req.user.id;
      withdrawal.processedAt = Date.now();
    }
    
    await withdrawal.save();
    
    // Update transaction status
    if (withdrawal.transaction) {
      await Transaction.findByIdAndUpdate(withdrawal.transaction, {
        status: status === 'completed' ? 'completed' : 
               status === 'rejected' ? 'failed' : 
               status === 'processing' ? 'processing' : 'pending',
        processedBy: req.user.id,
        processedAt: status === 'completed' || status === 'rejected' ? Date.now() : undefined
      });
    }
    
    // Get client
    const client = await Client.findById(withdrawal.client);
    
    // Send email notification
    try {
      const dashboardUrl = `${process.env.FRONTEND_URL || 'https://bluerock-asset.com'}/dashboard`;
      
      await emailService.sendWithdrawalNotification({
        email: client.email,
        name: client.firstName,
        withdrawalId: withdrawal.withdrawalId,
        amount: withdrawal.amount,
        status: status,
        notes: notes || '',
        dashboardUrl: dashboardUrl,
        formatDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
    } catch (err) {
      console.log('Email could not be sent', err);
    }
    
    res.status(200).json({
      success: true,
      data: withdrawal
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate new PIN for withdrawal
// @route   POST /api/withdrawals/:id/generate-pin
// @access  Private (Admin)
exports.generateNewPin = async (req, res, next) => {
  try {
    // Find withdrawal
    const withdrawal = await Withdrawal.findById(req.params.id).select('+pin.value +pin.expiresAt');
    
    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }
    
    // Generate new PIN
    const pin = withdrawal.generateWithdrawalPin();
    await withdrawal.save();
    
    // Get client
    const client = await Client.findById(withdrawal.client);
    
    // Send PIN to client's email
    try {
      await emailService.sendOTPEmail({
        email: client.email,
        name: client.firstName,
        otp: pin,
        expiryTime: `${process.env.PIN_EXPIRY_HOURS || 48} hours`,
        purpose: `Withdrawal Verification (${withdrawal.withdrawalId})`
      });
    } catch (err) {
      console.log('Email could not be sent', err);
    }
    
    res.status(200).json({
      success: true,
      message: 'New PIN generated and sent to client'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel withdrawal
// @route   DELETE /api/withdrawals/:id
// @access  Private
exports.cancelWithdrawal = async (req, res, next) => {
  try {
    // Find withdrawal
    const withdrawal = await Withdrawal.findById(req.params.id);
    
    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }
    
    // Check if user is authorized to cancel this withdrawal
    if (req.user.role === 'client') {
      const client = await Client.findOne({ user: req.user.id });
      
      if (!client || withdrawal.client.toString() !== client._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this withdrawal'
        });
      }
    }
    
    // Check if withdrawal can be cancelled
    if (withdrawal.status === 'completed' || withdrawal.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a withdrawal that is already ${withdrawal.status}`
      });
    }
    
    // Update withdrawal status
    withdrawal.status = 'cancelled';
    await withdrawal.save();
    
    // Update transaction status
    if (withdrawal.transaction) {
      await Transaction.findByIdAndUpdate(withdrawal.transaction, {
        status: 'cancelled'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {},
      message: 'Withdrawal cancelled successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get withdrawal statistics
// @route   GET /api/withdrawals/stats
// @access  Private (Admin/Manager)
exports.getWithdrawalStats = async (req, res, next) => {
  try {
    // Get total withdrawals
    const totalWithdrawals = await Withdrawal.countDocuments();
    
    // Get pending withdrawals
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
    
    // Get processing withdrawals
    const processingWithdrawals = await Withdrawal.countDocuments({ status: 'processing' });
    
    // Get completed withdrawals
    const completedWithdrawals = await Withdrawal.countDocuments({ status: 'completed' });
    
    // Get rejected withdrawals
    const rejectedWithdrawals = await Withdrawal.countDocuments({ status: 'rejected' });
    
    // Get total withdrawal amount
    const totalAmount = await Withdrawal.aggregate([
      {
        $match: { status: { $in: ['pending', 'processing'] } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    // Get withdrawals processed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const processedToday = await Withdrawal.countDocuments({
      processedAt: { $gte: today },
      status: { $in: ['completed', 'rejected'] }
    });
    
    // Get average processing time
    const avgProcessingTime = await Withdrawal.aggregate([
      {
        $match: {
          status: 'completed',
          processedAt: { $exists: true }
        }
      },
      {
        $project: {
          processingTime: {
            $divide: [
              { $subtract: ['$processedAt', '$createdAt'] },
              3600000 // Convert milliseconds to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$processingTime' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalWithdrawals,
        pendingWithdrawals,
        processingWithdrawals,
        completedWithdrawals,
        rejectedWithdrawals,
        totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
        processedToday,
        averageProcessingTime: avgProcessingTime.length > 0 ? avgProcessingTime[0].avgTime : 0
      }
    });
  } catch (err) {
    next(err);
  }
};