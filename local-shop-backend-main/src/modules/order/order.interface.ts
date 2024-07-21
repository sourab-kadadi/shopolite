import { Document } from 'mongoose';
import { Address } from '../address/address.interface';
import { Cart } from '../cart/cart.interface';
import { CouponType, ICouponConfig } from '../coupons/coupons.dto';
import { IDeliveryConfig } from '../store/store.dto';

export interface Order extends Document {
    readonly orderGroupId: string; // New
    readonly customerId: any;
    readonly customerName: string;
    readonly storeId: any;
    readonly storeName: any;
    readonly storeCustomId: string;
    readonly totalCartCost: number;
    readonly totalCartQuantity: number;
    readonly totalCartDiscount: number;
    readonly totalCartOriginalPrice: number;
    readonly storeCommisionRate: number;
    readonly storeTotalSellingPrice: number;
    readonly totalDeliveryCharge: number;
    readonly totalCustomerOrderCost: number;
    readonly totalStoreCommisionCost: number;
    readonly totalStoreOrderCost: number;
    readonly isthresholdDeliveryKm: boolean;
    readonly address: Address;
    readonly orderStatus: OrderStatus;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly note: string;
    readonly couponDetails: CouponDetails;
    readonly deliveryConfig?: IDeliveryConfig;
}


export interface CouponDetails {
    couponId?: string;
    validate: boolean;
    couponConfig?: ICouponConfig;
    discountAmount?: number;
    totalOrderAmount?: number;
    error?: string;
    startDate?: Date;
    exiptyDate?: Date;
    type?: CouponType;
    couponUsage?: string;
    code?: string;
    title?: string;
    description?: string;
}

export class OrderUpdate {
   readonly orderStatus: OrderStatus
}


export enum OrderStatus {
    PENDING = "PENDING",
    READY_TO_DELIVER = "READY_TO_DELIVER",
    DELIVERED = "DELIVERED",
    RETURN = "RETURN",
    ACCEPT = "ACCEPT",
    REJECT = "REJECT"
}