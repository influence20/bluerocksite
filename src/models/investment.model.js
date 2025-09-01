const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  investmentId: {
    type: String,
    unique: true,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  type: {
    type: String,
    enum: ['stocks', 'bonds', 'realEstate', 'cryptocurrency', 'commodities', 'mutualFunds', 'etf', 'other'],
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add an investment name']
  },
  description: {
    type: String
  },
  amount: {
    type: Number,
    required: [true, 'Please add an investment amount']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  duration: {
    type: Number, // in months
    default: 12
  },
  interestRate: {
    type: Number,
    required: true
  },
  expectedReturn: {
    type: Number
  },
  currentValue: {
    type: Number
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  payoutFrequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'biannually', 'annually', 'maturity'],
    default: 'maturity'
  },
  nextPayoutDate: {
    type: Date
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  ],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Generate investment ID
InvestmentSchema.pre('save', async function(next) {
  if (!this.investmentId) {
    // Generate an investment ID with format INV-XXXXX
    const count = await this.constructor.countDocuments();
    this.investmentId = `INV-${(10000 + count).toString().padStart(5, '0')}`;
  }
  
  // Calculate expected return if not provided
  if (!this.expectedReturn) {
    this.expectedReturn = this.amount * (1 + (this.interestRate / 100) * (this.duration / 12));
  }
  
  // Set current value to initial amount if not provided
  if (!this.currentValue) {
    this.currentValue = this.amount;
  }
  
  // Calculate end date if not provided
  if (!this.endDate) {
    const endDate = new Date(this.startDate);
    endDate.setMonth(endDate.getMonth() + this.duration);
    this.endDate = endDate;
  }
  
  // Calculate next payout date if not provided
  if (!this.nextPayoutDate) {
    const nextPayoutDate = new Date(this.startDate);
    
    switch (this.payoutFrequency) {
      case 'monthly':
        nextPayoutDate.setMonth(nextPayoutDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextPayoutDate.setMonth(nextPayoutDate.getMonth() + 3);
        break;
      case 'biannually':
        nextPayoutDate.setMonth(nextPayoutDate.getMonth() + 6);
        break;
      case 'annually':
        nextPayoutDate.setFullYear(nextPayoutDate.getFullYear() + 1);
        break;
      case 'maturity':
        nextPayoutDate = new Date(this.endDate);
        break;
    }
    
    this.nextPayoutDate = nextPayoutDate;
  }
  
  next();
});

module.exports = mongoose.model('Investment', InvestmentSchema);