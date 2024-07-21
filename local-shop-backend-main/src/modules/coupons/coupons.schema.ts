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
    }
}

 const coupon = {
    code: {
        type: String,
        required: true,
    },
    type: {
        type: String,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    couponConfig: couponConfig,
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
}

export const coupons = new mongoose.Schema ({
    providerId:{
        type: String
    },
    applicableId:{
        type: String
    },
    providerLevel: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    coupon: coupon,
    status: {
        type: Boolean,
        required: true, 
        default: true
    },
    totalNumberOfCouponUsed: {
        type: Number,
        default: 0
    }
});

coupons.index({"coupon.code": 1, "providerId": 1}, {unique: 1});
