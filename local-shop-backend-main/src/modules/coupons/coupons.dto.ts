import {
  IsNotEmpty
} from 'class-validator';
import { IModuleRes } from '../../common.service';
import { ProvidedLevel } from './coupons.interface';

export class CouponConfig {
    @IsNotEmpty()
    minOrderAmount: number;
    maxDiscountAmount?: number;
    @IsNotEmpty()
    discountValue: number;
}

 export class Coupon {
    @IsNotEmpty()
    code: string;
    @IsNotEmpty()
    type: CouponType;
    @IsNotEmpty()
    title: string;
    description: string;
    @IsNotEmpty()
    couponConfig: CouponConfig;
    couponUsage: CouponUsage; // RESTRICTED, UNLIMITED
    totalNoOfCoupons?: number;
    totolNoOfCouponsPerPerson?: number;
    totalNumberOfCouponUsed?: number;
    startDate?: Date;
    expiryDate?: Date;
}

export enum CouponUsage {
    RESTRICTED = "RESTRICTED",
    UNLIMITED = "UNLIMITED"
}

export enum CouponType {
    PERCENTAGE = "PERCENTAGE",
    FLAT = "FLAT",
}

export class ProviderCouponsCreateDto {
    startDate?: Date;
    expiryDate?: Date;
}

export class CouponsCreateDto {
    _id: any;
    @IsNotEmpty()
    providerLevel: ProvidedLevel;
    providerId?: any;
    applicableId?:any;
    @IsNotEmpty()
    city: string;
    @IsNotEmpty()
    coupon: Coupon;
    status: boolean 
}

export class StoreCouponsCreateDto {
    @IsNotEmpty()
    providerLevel: ProvidedLevel;
    providerId?: any;
    applicableId?:any;
    @IsNotEmpty()
    city: string;
    @IsNotEmpty()
    status: boolean 
}

export class CouponsUpdateDto {
    @IsNotEmpty()
    providerLevel: ProvidedLevel;
    providerId?: any;
    applicableId?:any;
    @IsNotEmpty()
    city: string;
    @IsNotEmpty()
    coupon: Coupon;
    status: boolean
}

export enum ICouponsMessage {
  createdSuccess = 'Coupons Created Successfully',
  updateSuccess = 'Coupons Details Update Successfully',
  deleteSuccess = 'Coupons Details Deleted Successfully',
  foundSuccess = 'Coupons Found Successully',
  notFound = 'Coupons Not Found',
}

export class ICouponsfindOneByIdRes extends IModuleRes {
  data: CouponsCreateDto;
}

export class ICouponsfindManyRes extends IModuleRes {
  data: CouponsCreateDto[];
  totalCount: number;
}

export class ICouponsTextManyRes extends IModuleRes {
  data: CouponsCreateDto[];
}

export class ICouponsCustomerDataManyRes extends IModuleRes {
    code: string;
    title: string;
    type: string;
    description: string; 
}

export class ICouponsDropDownRes extends IModuleRes {
  data: ICouponsCustomerDataManyRes[];
}


export class ICouponConfig{
    minOrderAmount: number;
    maxDiscountAmount?: number;
    discountValue: number;
} 

export class ValidateCouponsRes {
    couponId?: string;
    validate: boolean;
    couponConfig?: ICouponConfig;
    discountAmount?: number;
    totalOrderAmount?: number;
    error?: string;
    startDate?: Date;
    exiptyDate?: Date;
    type?: CouponType;
    providerLevel?: ProvidedLevel;
    couponUsage?: string;
    code?: string;
    title?: string;
    description?: string;
}