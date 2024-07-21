import { IModuleRes } from "../../common.service";
import { IDurationCalculation } from "../../service/calculator/calculator.dto";
import { Address } from "../address/address.interface";
import { Cart } from "../cart/cart.interface";
import { CouponType, ICouponConfig } from "../coupons/coupons.dto";
import { IDeliveryConfig } from "../store/store.dto";

export class CreateOrder {
    customerId: any;
    orderGroupId: string;
    customerName: string;
    storeId: any;
    storeName: any;
    storeCustomId: string;
    totalCartCost: number;
    totalCartQuantity: number;
    totalCartDiscount: number;
    totalCartOriginalPrice: number;
    totalCustomerOrderCost: number;
    totalStoreCommisionCost: number;
    totalStoreOrderCost: number;
    storeCommisionRate: number;
    totalDeliveryCost: number;
    isthresholdDeliveryKm: boolean;
    deliveryDistanceMatrix: IDurationCalculation;
    orderList: Cart[];
    address: Address;
    note: string;
    couponDetails: CouponDetails;
    deliveryConfig: IDeliveryConfig;
}

export class  CouponDetails{
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
export interface OpenTimings {
   readonly day: number;
   readonly startDate: Date;
   readonly endDate: Date;
   readonly isHoliday: boolean;
}



export enum IOrderMessage {
   createdSuccess = "Order Created Successfully",
   updateSuccess = "Order Details Update Successfully",
   deleteSuccess = "Order Details Deleted Successfully",
   foundSuccess = "Order Found Successully",
   notFound = "Order Not Found",
   unableToUpdateTheStatus = "Unable to Update Status",
   STORE_IS_OFFLINE = "Sorry for inconvenience store is closed at this time"
}


export class OrderfindOneByIdRes extends IModuleRes {
    data: CreateOrder;
}

export class IOrderwithId extends CreateOrder {
   _id: any;
}

export class IOrderfindManyRes extends IModuleRes  {
   data: CreateOrder[];
   totalCount: number;
}

export class IOrderTextManyRes extends IModuleRes {
   data: CreateOrder[];
}