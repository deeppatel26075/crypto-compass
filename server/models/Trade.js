const mongoose = require('mongoose');
const { ORDER_SIDES, ORDER_TYPES, TRADE_STATUS } = require('../constants/trading');

const tradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required for a trade.'],
      index: true,
    },
    assetId: {
      type: String,
      required: [true, 'Asset ID is required.'],
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
    side: {
      type: String,
      required: [true, 'Order side is required.'],
      enum: Object.values(ORDER_SIDES),
    },
    orderType: {
      type: String,
      required: [true, 'Order type is required.'],
      enum: Object.values(ORDER_TYPES),
      default: ORDER_TYPES.MARKET,
    },
    quantity: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, 'Trade quantity is required.'],
    },
    executionPriceCents: {
      type: Number,
      required: [true, 'Execution price in cents is required.'],
      validate: {
        validator: Number.isInteger,
        message: 'executionPriceCents must be an integer.',
      },
    },
    grossValueCents: {
      type: Number,
      required: [true, 'Gross trade value in cents is required.'],
      validate: {
        validator: Number.isInteger,
        message: 'grossValueCents must be an integer.',
      },
    },
    feeCents: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'feeCents must be an integer.',
      },
    },
    costBasisCents: {
      type: Number,
      default: null,
      validate: {
        validator: (v) => v === null || Number.isInteger(v),
        message: 'costBasisCents must be an integer or null.',
      },
    },
    realizedProfitLossCents: {
      type: Number,
      default: null,
      validate: {
        validator: (v) => v === null || Number.isInteger(v),
        message: 'realizedProfitLossCents must be an integer or null.',
      },
    },
    realizedProfitLossPercentage: {
      type: Number,
      default: null,
    },
    netCashChangeCents: {
      type: Number,
      required: [true, 'Net cash change in cents is required.'],
      validate: {
        validator: Number.isInteger,
        message: 'netCashChangeCents must be an integer.',
      },
    },
    status: {
      type: String,
      required: [true, 'Trade status is required.'],
      enum: Object.values(TRADE_STATUS),
      default: TRADE_STATUS.EXECUTED,
    },
    idempotencyKey: {
      type: String,
      required: [true, 'Idempotency key is required.'],
      trim: true,
    },
    isFullPositionExit: {
      type: Boolean,
      default: false,
    },
    executedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index preventing duplicate trade execution per user + idempotencyKey
tradeSchema.index({ user: 1, idempotencyKey: 1 }, { unique: true });

// Compound index for user trade history queries
tradeSchema.index({ user: 1, executedAt: -1 });

const { parseCryptoToUnits, unitsToCryptoString } = require('../utils/decimalMath');

/**
 * Returns a sanitized client-safe representation of the trade
 */
tradeSchema.methods.toSafeJSON = function () {
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
    side: this.side,
    orderType: this.orderType,
    quantity: cleanQty,
    executionPriceCents: this.executionPriceCents,
    executionPrice: this.executionPriceCents / 100,
    grossValueCents: this.grossValueCents,
    grossValue: this.grossValueCents / 100,
    feeCents: this.feeCents,
    costBasisCents: this.costBasisCents ?? null,
    costBasis: this.costBasisCents !== null && this.costBasisCents !== undefined ? this.costBasisCents / 100 : null,
    realizedProfitLossCents: this.realizedProfitLossCents ?? null,
    realizedProfitLoss: this.realizedProfitLossCents !== null && this.realizedProfitLossCents !== undefined ? this.realizedProfitLossCents / 100 : null,
    realizedProfitLossPercentage: this.realizedProfitLossPercentage ?? null,
    isFullPositionExit: Boolean(this.isFullPositionExit),
    netCashChangeCents: this.netCashChangeCents,
    status: this.status,
    idempotencyKey: this.idempotencyKey,
    executedAt: this.executedAt,
  };
};

module.exports = mongoose.model('Trade', tradeSchema);
