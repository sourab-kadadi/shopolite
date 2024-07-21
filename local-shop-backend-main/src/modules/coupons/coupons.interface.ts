import { Document } from 'mongoose';

export interface Coupons extends Document {
    providerLevel: ProvidedLevel,
    providerId?: any,
    applicableId?:any,
    city: string,
    coupon: Coupon,
    status: boolean
}

export interface CouponConfig{
    minOrderAmount: number,
    maxDiscountAmount?: number,
    discountValue: number
}

 export interface Coupon {
    code: string,
    type: string,
    title: string;
    description: string;
    couponConfig: CouponConfig
    couponUsage: string; // RESTRICTED, UNLIMITED
    totalNoOfCoupons?: number;
    totalNumberOfCouponUsed: number;
    totolNoOfCouponsPerPerson?: number;
    startDate?: Date;
    expiryDate?: Date;
}

export enum ProvidedLevel {
    COMPANY = "COMPANY",
    STORE = "STORE",
    COMPANY_STORE = "COMPANY_STORE",
    COMPANY_CUSTOMER = "COMPANY_CUSTOMER",
    STORE_CUSTOMER = "STORE_CUSTOMER"
}

export interface ValidateCouponRequest{
    providerId?: string;
    applicableId?: string;
    totalNumberCouponAppliedByUser?: number;
}