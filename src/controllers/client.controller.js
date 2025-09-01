const Client = require('../models/client.model');
const User = require('../models/user.model');
const Investment = require('../models/investment.model');
const Transaction = require('../models/transaction.model');
const Withdrawal = require('../models/withdrawal.model');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private (Admin, Manager)
exports.getClients = async (req, res, next) => {
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
    query = Client.find(JSON.parse(queryStr)).populate({
      path: 'user',
      select: 'name email role status lastLogin'
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
      query = query.sort('-joinedDate');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Client.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const clients = await query;
    
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
      count: clients.length,
      pagination,
      data: clients
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private (Admin, Manager, Client - own profile)
exports.getClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id).populate({
      path: 'user',
      select: 'name email role status lastLogin'
    });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    // Check if client is requesting their own profile
    if (req.user.role === 'client') {
      const userClient = await Client.findOne({ user: req.user.id });
      
      if (!userClient || userClient._id.toString() !== req.params.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this client'
        });
      }
    }
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new client
// @route   POST /api/clients
// @access  Private (Admin, Manager)
exports.createClient = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, address, dateOfBirth, idType, idNumber } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    // Create user
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: Math.random().toString(36).slice(-8), // Generate random password
      role: 'client'
    });
    
    // Create client
    const client = await Client.create({
      user: user._id,
      firstName,
      lastName,
      email,
      phone,
      address,
      dateOfBirth,
      idType,
      idNumber
    });
    
    res.status(201).json({
      success: true,
      data: client
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private (Admin, Manager)
exports.updateClient = async (req, res, next) => {
  try {
    let client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    // Update client
    client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    // Update user if name or email changed
    if (req.body.firstName || req.body.lastName || req.body.email) {
      const user = await User.findById(client.user);
      
      if (user) {
        if (req.body.firstName || req.body.lastName) {
          user.name = `${req.body.firstName || client.firstName} ${req.body.lastName || client.lastName}`;
        }
        
        if (req.body.email) {
          user.email = req.body.email;
        }
        
        await user.save();
      }
    }
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private (Admin)
exports.deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    // Delete client
    await client.remove();
    
    // Delete user
    await User.findByIdAndDelete(client.user);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get client dashboard data
// @route   GET /api/clients/dashboard
// @access  Private (Client)
exports.getClientDashboard = async (req, res, next) => {
  try {
    // Get client
    const client = await Client.findOne({ user: req.user.id });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    // Get investments
    const investments = await Investment.find({ client: client._id });
    
    // Get recent transactions
    const transactions = await Transaction.find({ client: client._id })
      .sort('-createdAt')
      .limit(5);
    
    // Get recent withdrawals
    const withdrawals = await Withdrawal.find({ client: client._id })
      .sort('-createdAt')
      .limit(5);
    
    // Calculate total investment value
    const totalInvestmentValue = investments.reduce((total, investment) => {
      return total + (investment.currentValue || investment.amount);
    }, 0);
    
    // Calculate total returns
    const totalReturns = investments.reduce((total, investment) => {
      return total + ((investment.currentValue || investment.amount) - investment.amount);
    }, 0);
    
    // Calculate portfolio performance
    const portfolioPerformance = investments.length > 0 ? 
      (totalReturns / (totalInvestmentValue - totalReturns)) * 100 : 0;
    
    res.status(200).json({
      success: true,
      data: {
        client,
        accountSummary: {
          accountBalance: client.accountBalance,
          totalInvestments: client.totalInvestments,
          totalInvestmentValue,
          totalReturns,
          portfolioPerformance,
          pendingWithdrawals: client.pendingWithdrawals
        },
        investments,
        recentTransactions: transactions,
        recentWithdrawals: withdrawals
      }
    });
  } catch (err) {
    next(err);
  }
};