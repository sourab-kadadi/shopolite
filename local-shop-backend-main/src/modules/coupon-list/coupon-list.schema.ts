import * as mongoose from 'mongoose';

const couponConfig = {
  minOrderAmount: {
    type: Number,
  },
  maxDiscountAmount: {
    type: Number,
  },
  discountValue: {
    type: Number,
  },
};

export const couponList = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  type: {
    type: String,
  },
  couponConfig: couponConfig,
  city: {
    type: String,
  },
  couponUsage: {
    type: String,
  }, // RESTRICTED, UNLIMITED
  totalNoOfCoupons: {
    type: Number,
  },
  totolNoOfCouponsPerPerson: {
    type: Number,
  },
  startDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
});

couponList.index({ code: 1 }, { unique: true });
