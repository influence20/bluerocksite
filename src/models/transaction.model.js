const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionId: {
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
    enum: ['deposit', 'withdrawal', 'investment', 'return', 'fee', 'transfer', 'other'],
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add a transaction amount']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  method: {
    type: String,
    enum: ['bankTransfer', 'creditCard', 'cryptocurrency', 'cash', 'check', 'other']
  },
  reference: {
    type: String
  },
  relatedInvestment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investment'
  },
  relatedWithdrawal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Withdrawal'
  },
  fees: {
    amount: {
      type: Number,
      default: 0
    },
    description: {
      type: String
    }
  },
  notes: {
    type: String
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate transaction ID
TransactionSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    // Generate a transaction ID with format TX-XXXXX
    const count = await this.constructor.countDocuments();
    this.transactionId = `TX-${(10000 + count).toString().padStart(5, '0')}`;
  }
  next();
});

// Update client balance after transaction is completed
TransactionSchema.post('save', async function() {
  if (this.status === 'completed') {
    const Client = mongoose.model('Client');
    const client = await Client.findById(this.client);
    
    if (client) {
      let balanceChange = 0;
      
      switch (this.type) {
        case 'deposit':
          balanceChange = this.amount;
          break;
        case 'withdrawal':
          balanceChange = -this.amount;
          break;
        case 'investment':
          balanceChange = -this.amount;
          client.totalInvestments += this.amount;
          break;
        case 'return':
          balanceChange = this.amount;
          break;
        case 'fee':
          balanceChange = -this.amount;
          break;
        case 'transfer':
          // Transfer logic would depend on direction
          break;
      }
      
      client.accountBalance += balanceChange;
      await client.save();
    }
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);