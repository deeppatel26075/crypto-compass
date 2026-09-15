const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required for a holding.'],
      index: true,
    },
    assetId: {
      type: String,
      required: [true, 'Asset identifier is required.'],
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, 'Asset symbol is required.'],
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Asset name is required.'],
      trim: true,
    },
    quantity: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, 'Holding quantity is required.'],
    },
    averageBuyPriceCents: {
      type: Number,
      required: [true, 'Average buy price in cents is required.'],
      validate: {
        validator: Number.isInteger,
        message: 'averageBuyPriceCents must be an integer.',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index: a user can only have one holding record per asset symbol
holdingSchema.index({ user: 1, symbol: 1 }, { unique: true });

const { parseCryptoToUnits, unitsToCryptoString } = require('../utils/decimalMath');

/**
 * Returns a sanitized client-safe representation of the holding
 */
holdingSchema.methods.toSafeJSON = function () {
  let cleanQty = '0';
  if (this.quantity) {
    try {
      cleanQty = unitsToCryptoString(parseCryptoToUnits(this.quantity));
    } catch {
      cleanQty = this.quantity.toString();
    }
  }
  return {
    id: this._id.toString(),
    assetId: this.assetId,
    symbol: this.symbol,
    name: this.name,
    quantity: cleanQty,
    averageBuyPriceCents: this.averageBuyPriceCents,
    averageBuyPrice: this.averageBuyPriceCents / 100,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('Holding', holdingSchema);
