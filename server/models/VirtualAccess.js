const mongoose = require('mongoose');
const {
  VIRTUAL_ACCESS_PRICE_PAISE,
  ACCESS_STATUS,
  UNLOCK_SOURCE,
} = require('../constants/access');

const virtualAccessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required for virtual access.'],
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ACCESS_STATUS),
      default: ACCESS_STATUS.LOCKED,
      required: true,
    },
    pricePaise: {
      type: Number,
      default: VIRTUAL_ACCESS_PRICE_PAISE,
      required: true,
    },
    discountPaise: {
      type: Number,
      default: 0,
      required: true,
    },
    finalAmountPaise: {
      type: Number,
      default: VIRTUAL_ACCESS_PRICE_PAISE,
      required: true,
    },
    couponCode: {
      type: String,
      default: null,
      trim: true,
    },
    unlockSource: {
      type: String,
      enum: [...Object.values(UNLOCK_SOURCE), null],
      default: null,
    },
    unlockedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Returns a sanitized client representation of VirtualAccess
 */
virtualAccessSchema.methods.toSafeJSON = function () {
  return {
    unlocked: this.status === ACCESS_STATUS.UNLOCKED,
    status: this.status,
    pricePaise: this.pricePaise,
    priceINR: Math.round(this.pricePaise / 100),
    discountPaise: this.discountPaise,
    discountINR: Math.round(this.discountPaise / 100),
    finalAmountPaise: this.finalAmountPaise,
    finalAmountINR: Math.round(this.finalAmountPaise / 100),
    couponCode: this.couponCode,
    unlockSource: this.unlockSource,
    unlockedAt: this.unlockedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('VirtualAccess', virtualAccessSchema);
