import { IsNotEmpty, Length, ArrayMinSize, IsBoolean, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";

export interface CouponConfig {
    minOrderAmount: number;
    maxDiscountAmount?: number;
    discountValue: number;
  }

export class CouponListCreateDto {
    code: string;
    type: string;
    couponConfig: CouponConfig;
    city: string;
    title: string;
    description: string;
    couponUsage: string; // RESTRICTED, UNLIMITED
    totalNoOfCoupons?: number;
    totolNoOfCouponsPerPerson?: number;
    startDate?: Date;
    expiryDate?: Date;
 }

 export class CouponListUpdateDto {
    code: string;
    type: CouponType;
    couponConfig: CouponConfig;
    city: string;
    title: string;
    description: string;
    couponUsage: string; // RESTRICTED, UNLIMITED
    totalNoOfCoupons?: number;
    totolNoOfCouponsPerPerson?: number;
    startDate?: Date;
    expiryDate?: Date;
}

export enum CouponType {
    PERCENTAGE = "PERCENTAGE",
    FLAT = "FLAT",
}

 export enum ICouponListMessage {
    createdSuccess = "CouponList Created Successfully",
    updateSuccess = "CouponList Details Update Successfully",
    deleteSuccess = "CouponList Details Deleted Successfully",
    foundSuccess = "CouponList Found Successully",
    notFound = "CouponList Not Found"
}

export class ICouponListfindOneByIdRes extends IModuleRes {
    data: CouponListCreateDto;
}

export class ICouponListfindManyRes extends IModuleRes  {
    data: CouponListCreateDto[];
    totalCount: number;
}

export class ICouponListTextManyRes extends IModuleRes {
    data: CouponListCreateDto[];
}

export class ICouponListDropDownRes extends IModuleRes {
    data: CouponListCreateDto[];
}