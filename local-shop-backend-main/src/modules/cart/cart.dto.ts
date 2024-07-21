import { IsNotEmpty, ArrayMinSize, IsOptional } from "class-validator";
import { IDurationCalculation } from "../../service/calculator/calculator.dto";
import { IModuleRes } from "../../common.service";
import { Cart } from "./cart.interface";
import { ValidateCouponsRes } from "../coupons/coupons.dto";
import { IDeliveryConfig } from "../store/store.dto";


export class CreateReqDto {
    @IsNotEmpty()
    storeCustomId: string;
    @IsNotEmpty()
    productId: string;
    quantity?: number;
}
export class CreateCartDto {
    @IsNotEmpty()
    customerId: any;
    // customerName: string;
    quantity: number;
    @IsNotEmpty()
     storeId: any;
     storeName: string;
     @IsNotEmpty()
     categoryId: any;
     categoryName: string;
     @IsNotEmpty()
     subCategoryId: any;
     subCategoryName: string;
     @IsNotEmpty()
     productId: any;
     productName: string;
     brandName: string;
     sku: string;
     name: string;
     description: string;
     status: Boolean;
     spec: keyValue;
     image: Media;
     media: Media;
     @IsNotEmpty()
     unitValue: number;
     @IsNotEmpty()
     unit: string;
     @IsNotEmpty()
     sellingPrice: number;
     updatedAt?: Date;
     createdAt?: string;
     storeProductId: any;
}



export class MyCartInfo {
    totalSellingPrice: number;
    totalDiscount: number;
    totalOriginalPrice: number;
    quantity: number;
    sellingPrice: number;
    unit: string;
    unitValue: number;
    _id: string;
}

export class TotalCartCost {
    totalCartCost: number;
    totalCartQuantity: number;
    totalCartOriginalPrice: number;
    totalCartDiscount: number;
}

export class CartTotalAmount {
    totalCartCost: number;
    totalCartQuantity: number;
    totalCartOriginalPrice: number;
    totalCartDiscount: number;
    totalDeliveryCost: number;
    distaceMatrix?: IDurationCalculation;
    totalCustomerOrderCost: number;
    couponDetails?: ValidateCouponsRes;
    isthresholdDeliveryKm: boolean;
    deliveryConfig: IDeliveryConfig;
}
export class MyCartReq extends CartTotalAmount {
    myCart: MyCartInfo;
    thresholdDeliveryKm: number;
}


export class UpdateCartDto {
    @IsNotEmpty()
    quantity: number;
    @IsNotEmpty()
    productId: string;
    @IsNotEmpty()
    storeCustomId: string;

}

export class  Media {
     filePath: string;
     type: string;
}

export class CartfindOneByIdRes extends IModuleRes {
    data: CreateCartDto;
}



export class CartfindManyByIdRes extends IModuleRes {
    data: Cart[];
    totalCartCost: number;
    totalCartQuantity: number;
    totalCartOriginalPrice: number;
    totalCartDiscount: number;
    totalDeliveryCost: number;
    distaceMatrix?: IDurationCalculation;
    totalCustomerOrderCost: number;
    couponDetails?: ValidateCouponsRes;
    deliveryConfig: IDeliveryConfig;
    isthresholdDeliveryKm: boolean;
    thresholdDeliveryKm: number;
}



export class keyValue {
    @IsNotEmpty()
    key: string;    
    @IsNotEmpty()
    value: string
}

export enum EItemStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    NOQUANTITY = "NOQUANTITY",
    KILL = "KILL"
}

export enum ICartMessage {
    createdSuccess = "Cart Created Successfully",
    updateSuccess = "Cart Details Update Successfully",
    deleteSuccess = "Cart Details Deleted Successfully",
    foundSuccess = "Cart Found Successully",
    notFound = "Cart Not Found"
}

export class ICartfindOneByIdRes extends IModuleRes {
    data: CreateCartDto;
}

export class ICartfindManyRes extends IModuleRes  {
    data: CreateCartDto[];
    totalCount: number;
}

export class ICartTextManyRes extends IModuleRes {
    data: CreateCartDto[];
}

export class ICartDropDownRes extends IModuleRes {
    data: CreateCartDto[];
}