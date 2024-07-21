import { IsEmail, IsNotEmpty, Length, ArrayMinSize, IsOptional, ArrayMaxSize, IsArray } from "class-validator";
import { IModuleRes } from "../../common.service";

class Iimage {
     filePath: string;
     type: string;
};

class Iaccount {
     accountNumber: string;
     AccountName: string;
};

class Iinvoice {
     invoiceNumber: string;
     invoicePrefix: string;
     TrnNumber: string;  
};

class Ilocation {
     type: string;
     @IsOptional()
     @ArrayMaxSize(2)
     coordinates: number[]
 }

class ISEO {
     @IsOptional()
    @ArrayMinSize(1)
     keyWords: string[];
     @IsOptional()
     @IsNotEmpty()
     description: string;
}

interface IStoreType {
     _id: any,
     name: string,
 }

class MinTimingTODeliver {
     time: string;
     timeUnit: string;
 }

class ITiming {
     startTime: string;
     endTime: string; // So you keep track on the offset with the base timezone 
 }


export class StoreDto {
     _id?: any;
     storeCustomId?: string;
     @IsNotEmpty()
     @Length(1, 30)
     businessName: string;
     @IsNotEmpty()
     @ArrayMinSize(1)
     businessCategoryId: any;
     @IsOptional()
     email?: string;
     @IsOptional()
     status: boolean;
     @IsOptional()
     phoneNo: string;
     @IsNotEmpty()
     address1: string;
     @IsOptional()
     address2?: string;
     landmark?: string;
     tradeLicence?: string;
     tradeLicenceExpDate?: Date;
     location?: Ilocation;
     storeImage?: Iimage;
     logo?: Iimage;
     accountDetails?: Iaccount;
     invoiceDetails?: Iinvoice;
     gstNumber?: string;
     SEO?: ISEO;
     createdAt?: Date;
     timing: ITiming;
     acceptDelivery?: boolean;
     @IsNotEmpty()
     storeType: IStoreType;
     minTimingToDeliver?: MinTimingTODeliver;
     mapFullAddress: string;
     userId?: any;
     openTimings?: OpenTimings[];
     storeOnline?: boolean;
     commissionRate?: number;
     deliveryConfig?: IDeliveryConfig;

}

interface OpenTimings {
     day: number;
     nameOfDay: string;
     timings: Timings[];
     isHoliday?: boolean;
 }
 
 interface Timings {
     startTime: string,
     endTime: string,
     startTimeMin: number,
     endTimeMin: number, 
 }


export class StoreUpdateDto {
     @IsOptional()
     storeCustomId?: string;
     @IsOptional()
     @Length(1, 30)
     businessName: string;
     @IsOptional()
     @IsArray()
     @ArrayMinSize(1)
     businessCategoryId: any[];
     @IsOptional()
     email?: string;
     @IsOptional()
     status: boolean;
     @IsOptional()
     storeOnline: boolean;
     @IsOptional()
     phoneNo: string;
     @IsOptional()
     address1: string;
     @IsOptional()
     address2?: string;
     landmark?: string;
     tradeLicence?: string;
     tradeLicenceExpDate?: Date;
     location?: Ilocation;
     storeImage?: Iimage;
     logo?: Iimage;
     accountDetails?: Iaccount;
     invoiceDetails?: Iinvoice;
     gstNumber?: string;
     SEO?: ISEO;
     createdAt?: Date;
     timing?: ITiming;
     acceptDelivery?: boolean;
     @IsOptional()
     storeType?: IStoreType;
     minTimingToDeliver?: MinTimingTODeliver;
     mapFullAddress?: string;
     openTimings?: OpenTimings;
     deliveryConfig?: IDeliveryConfig;

}

export class IDeliveryConfig {
     minDeliveryPrice: number;
     thresholdDeliveryKm: number;
     thresholdFlatCharges: number;
     deliveryChargePerKm: number;
   }

export class storeOnlineStatusDto {
     storeOnline: boolean;
}

export enum IStoreMessage {
    createdSuccess = "Store Created Successfully",
    updateSuccess = "Store Details Update Successfully",
    deleteSuccess = "Store Details Deleted Successfully",
    foundSuccess = "Store Found Successully",
    notFound = "Store Not Found"
}


export class StorefindOneByIdRes extends IModuleRes {
     data: StoreDto;
}

export class StorefindManyByIdRes extends IModuleRes {
     data: StoreDto;
     totalCount: number;
}

export class StorefindManyRes extends IModuleRes {
     data: StoreDto[];
     totalCount: number;
}