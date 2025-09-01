const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientId: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  dateOfBirth: {
    type: Date
  },
  idType: {
    type: String,
    enum: ['passport', 'driverLicense', 'nationalId', 'other']
  },
  idNumber: {
    type: String
  },
  idVerified: {
    type: Boolean,
    default: false
  },
  accountBalance: {
    type: Number,
    default: 0
  },
  pendingWithdrawals: {
    type: Number,
    default: 0
  },
  totalInvestments: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'pending'
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  bankAccounts: [
    {
      bankName: String,
      accountNumber: String,
      routingNumber: String,
      accountType: String,
      accountHolderName: String,
      isDefault: {
        type: Boolean,
        default: false
      }
    }
  ],
  cryptoWallets: [
    {
      currency: {
        type: String,
        enum: ['BTC', 'ETH', 'USDT', 'BNB']
      },
      address: String,
      isDefault: {
        type: Boolean,
        default: false
      }
    }
  ],
  notes: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
ClientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Generate client ID
ClientSchema.pre('save', async function(next) {
  if (!this.clientId) {
    // Generate a client ID with format CL-XXXXX
    const count = await this.constructor.countDocuments();
    this.clientId = `CL-${(10000 + count).toString().padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Client', ClientSchema);