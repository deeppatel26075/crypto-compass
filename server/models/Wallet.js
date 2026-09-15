const mongoose = require('mongoose');
const { INITIAL_VIRTUAL_BALANCE_CENTS, WALLET_CURRENCY } = require('../constants/wallet');

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required for a virtual wallet.'],
      unique: true,
      index: true,
    },
    cashBalanceCents: {
      type: Number,
      required: [true, 'Cash balance in cents is required.'],
      default: INITIAL_VIRTUAL_BALANCE_CENTS,
      min: [0, 'Virtual cash balance cannot be negative.'],
      validate: {
        validator: Number.isInteger,
        message: 'cashBalanceCents must be an integer.',
      },
    },
    currency: {
      type: String,
      required: true,
      default: WALLET_CURRENCY,
      enum: [WALLET_CURRENCY],
    },
    initialized: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Returns a sanitized, client-safe representation of the wallet.
 * Exposes authoritative cashBalanceCents and presentation-friendly cashBalance.
 */
walletSchema.methods.toSafeJSON = function () {
  return {
    id: this._id.toString(),
    currency: this.currency,
    cashBalanceCents: this.cashBalanceCents,
    cashBalance: this.cashBalanceCents / 100,
    initialized: this.initialized,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('Wallet', walletSchema);
