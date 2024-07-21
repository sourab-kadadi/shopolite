import { Document } from 'mongoose';

export interface CouponList extends Document {
  code: string;
  type: string;
  couponConfig: CouponConfig;
  title: string;
  description: string;
  city: string;
  couponUsage: string; // RESTRICTED, UNLIMITED
  totalNoOfCoupons?: number;
  totolNoOfCouponsPerPerson?: number;
  startDate?: Date;
  expiryDate?: Date;
}

export interface CouponConfig {
  minOrderAmount: number;
  maxDiscountAmount?: number;
  discountValue: number;
}
