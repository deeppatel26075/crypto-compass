const mongoose = require('mongoose');
const { WALLET_CURRENCY, TRANSACTION_TYPES } = require('../constants/wallet');

const walletTransactionSchema = new mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      required: [true, 'Wallet reference is required for a transaction.'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required for a transaction.'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required.'],
      enum: Object.values(TRANSACTION_TYPES),
      default: TRANSACTION_TYPES.INITIAL_DEPOSIT,
    },
    amountCents: {
      type: Number,
      required: [true, 'Transaction amount in cents is required.'],
      validate: {
        validator: Number.isInteger,
        message: 'amountCents must be an integer.',
      },
    },
    currency: {
      type: String,
      required: true,
      default: WALLET_CURRENCY,
    },
    balanceAfterCents: {
      type: Number,
      required: [true, 'Balance after transaction in cents is required.'],
      validate: {
        validator: Number.isInteger,
        message: 'balanceAfterCents must be an integer.',
      },
    },
    description: {
      type: String,
      required: true,
      default: 'Initial virtual balance',
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound indexes for performant ledger chronological queries
walletTransactionSchema.index({ user: 1, createdAt: -1 });
walletTransactionSchema.index({ wallet: 1, createdAt: -1 });

/**
 * Returns a sanitized, client-safe representation of the transaction.
 */
walletTransactionSchema.methods.toSafeJSON = function () {
  return {
    id: this._id.toString(),
    wallet: this.wallet ? this.wallet.toString() : undefined,
    type: this.type,
    amountCents: this.amountCents,
    amount: this.amountCents / 100,
    currency: this.currency,
    balanceAfterCents: this.balanceAfterCents,
    balanceAfter: this.balanceAfterCents / 100,
    description: this.description,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
