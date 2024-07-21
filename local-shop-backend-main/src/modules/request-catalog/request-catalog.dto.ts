import { IsNotEmpty, ArrayMinSize, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";
import { Discount } from "../store-product-catalog/store-product-catalog.dto";
import { RequestCatalog } from "./request-catalog.interface";

export class CreateRequestCatalogDto {
    _id?: any;
     categoryId: any;
     catalogName: string;
     barcode?: string;
     storeName: string;
     storeId: string;
     subCatalogId: any;
     subCatalogName: string;
     sku: string;
     name: string;
     brandName: string;
     description: string;
     status: Boolean;
     spec: keyValue;
     image: Media;
     media: Media;
     unitValue: number;
     unit: string;
     originalPrice: number;
     discount?: Discount;
     updatedAt: Date
     createdAt: string
}


export class UpdateRequestCatalogDto {
     storeName: string;
     storeId: string;
     catalogId: any;
     catalogName: string;
     subCatalogId: any;
     barcode?: string;
     subCatalogName: string;
     sku: string;
     name: string;
     brandName: string;
     description: string;
     status: Boolean;
     spec: keyValue;
     image: Media;
     media: Media;
     unitValue: number;
     unit: string;
     originalPrice: number;
     discount?: Discount;
     updatedAt: Date
     createdAt: string
}

export class  Media {
     filePath: string;
     type: string;
}

export class RequestCatalogfindOneByIdRes extends IModuleRes {
    data: RequestCatalog;
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

export enum IRequestCatalogMessage {
    createdSuccess = "Request Catalog Created Successfully",
    updateSuccess = "Request Catalog Details Update Successfully",
    deleteSuccess = "Request Catalog Details Deleted Successfully",
    foundSuccess = "Request Catalog Found Successully",
    notFound = "Request Catalog Not Found"
}

export class IRequestCatalogfindOneByIdRes extends IModuleRes {
    data: CreateRequestCatalogDto;
}

export class IRequestCatalogfindManyRes extends IModuleRes  {
    data: CreateRequestCatalogDto[];
    totalCount: number;
}

export class IRequestCatalogTextManyRes extends IModuleRes {
    data: CreateRequestCatalogDto[];
}

export class IRequestCatalogDropDownRes extends IModuleRes {
    data: CreateRequestCatalogDto[];
}