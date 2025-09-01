const mongoose = require('mongoose');
const crypto = require('crypto');

const WithdrawalSchema = new mongoose.Schema({
  withdrawalId: {
    type: String,
    unique: true,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add a withdrawal amount']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  method: {
    type: String,
    enum: ['bankTransfer', 'cryptocurrency'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'rejected', 'cancelled'],
    default: 'pending'
  },
  destination: {
    // For bank transfers
    bankAccount: {
      bankName: String,
      accountNumber: String,
      routingNumber: String,
      accountType: String,
      accountHolderName: String
    },
    // For cryptocurrency
    cryptoWallet: {
      currency: {
        type: String,
        enum: ['BTC', 'ETH', 'USDT', 'BNB']
      },
      address: String
    }
  },
  pin: {
    value: {
      type: String,
      select: false
    },
    expiresAt: {
      type: Date
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedAt: {
      type: Date
    }
  },
  fees: {
    amount: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 1.5
    }
  },
  notes: {
    type: String
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: {
    type: Date
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }
}, {
  timestamps: true
});

// Generate withdrawal ID and calculate fees
WithdrawalSchema.pre('save', async function(next) {
  if (!this.withdrawalId) {
    // Generate a withdrawal ID with format WD-XXXXX
    const count = await this.constructor.countDocuments();
    this.withdrawalId = `WD-${(10000 + count).toString().padStart(5, '0')}`;
  }
  
  // Calculate fees if not already set
  if (this.fees.amount === 0) {
    const feePercentage = this.fees.percentage || parseFloat(process.env.WITHDRAWAL_FEE_PERCENTAGE) || 1.5;
    this.fees.amount = (this.amount * feePercentage) / 100;
  }
  
  next();
});

// Generate withdrawal PIN
WithdrawalSchema.methods.generateWithdrawalPin = function() {
  // Generate a random 6-digit PIN
  const pinLength = parseInt(process.env.PIN_LENGTH) || 6;
  const min = Math.pow(10, pinLength - 1);
  const max = Math.pow(10, pinLength) - 1;
  const pin = Math.floor(min + Math.random() * (max - min + 1)).toString();
  
  // Hash the PIN
  const hashedPin = crypto
    .createHash('sha256')
    .update(pin)
    .digest('hex');
  
  // Set PIN expiry (default 48 hours)
  const pinExpiryHours = parseInt(process.env.PIN_EXPIRY_HOURS) || 48;
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + pinExpiryHours);
  
  // Save the hashed PIN and expiry
  this.pin.value = hashedPin;
  this.pin.expiresAt = expiresAt;
  this.pin.verified = false;
  
  return pin; // Return the unhashed PIN to be sent to the client
};

// Verify withdrawal PIN
WithdrawalSchema.methods.verifyPin = function(enteredPin) {
  // Check if PIN is expired
  if (Date.now() > this.pin.expiresAt) {
    return false;
  }
  
  // Hash the entered PIN and compare
  const hashedPin = crypto
    .createHash('sha256')
    .update(enteredPin)
    .digest('hex');
  
  const isValid = hashedPin === this.pin.value;
  
  // If valid, mark as verified
  if (isValid) {
    this.pin.verified = true;
    this.pin.verifiedAt = Date.now();
  }
  
  return isValid;
};

// Update client's pending withdrawals amount
WithdrawalSchema.post('save', async function() {
  const Client = mongoose.model('Client');
  const client = await Client.findById(this.client);
  
  if (client) {
    // Calculate total pending withdrawals
    const Withdrawal = this.constructor;
    const pendingWithdrawals = await Withdrawal.aggregate([
      {
        $match: {
          client: client._id,
          status: { $in: ['pending', 'processing'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    client.pendingWithdrawals = pendingWithdrawals.length > 0 ? pendingWithdrawals[0].total : 0;
    await client.save();
  }
});

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);