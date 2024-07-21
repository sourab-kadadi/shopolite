import { IsNotEmpty, ArrayMinSize, IsOptional } from "class-validator";
import { DiscountType } from "../../service/calculator/calculator.service";
import { IModuleRes } from "../../common.service";
import { StoreProductCatalog } from "./store-product-catalog.interface";


export class CreateReqDto {
    referenceName?: string;
    storeId: string;
    storeName: string;
    storeCustomId: string;
    @IsNotEmpty()
    status: boolean;
    @IsNotEmpty()
    originalPrice: number;
    discount: Discount;
    actualStoreMrp: number;
}

export class Discount {
    @IsNotEmpty()
     type: DiscountType;
     @IsNotEmpty()
     value: number;
}
export class CreateStoreProductCatalogDto {
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
     originalPrice: number;
     @IsNotEmpty()
     sellingPrice: number;
     offerUnit?: string;
     keyWord?: string[];
     restaurantMenuDishType?: string;
     updatedAt?: Date;
     createdAt?: string;
}


export class UpdateStoreProductCatalogDto {
    referenceName?: string;
    status: Boolean;
    @IsNotEmpty()
    originalPrice: number;
    discount: Discount;
    actualStoreMrp: number;
}

export interface UpdateProcuctPrice {
    status: Boolean;
    originalPrice: number;
    discount: Discount;
    sellingPrice: number;
    actualStoreMrp: number;
}

export class StatusUpdateStoreProductCatalogDto {
    @IsNotEmpty()
    status: Boolean;
}

export class  Media {
     filePath: string;
     type: string;
}

export class StoreProductCatalogfindOneByIdRes extends IModuleRes {
    data: StoreProductCatalog;
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

export enum IStoreProductCatalogMessage {
    createdSuccess = "StoreProductCatalog Created Successfully",
    updateSuccess = "StoreProductCatalog Details Update Successfully",
    deleteSuccess = "StoreProductCatalog Details Deleted Successfully",
    foundSuccess = "StoreProductCatalog Found Successully",
    notFound = "StoreProductCatalog Not Found"
}

export class IStoreProductCatalogfindOneByIdRes extends IModuleRes {
    data: CreateStoreProductCatalogDto;
}

export class IStoreProductCatalogfindManyRes extends IModuleRes  {
    data: CreateStoreProductCatalogDto[];
    totalCount: number;
}

export class IStoreProductCatalogTextManyRes extends IModuleRes {
    data: CreateStoreProductCatalogDto[];
}

export class IStoreProductCatalogDropDownRes extends IModuleRes {
    data: CreateStoreProductCatalogDto[];
}

export class IActiveSubCat {
    name: string;
    image: string;
}

export class IActiveCategory {
    name: string;
    image: string;
}


export class IStoreActiveSubCategroy extends IModuleRes {
    data: IActiveSubCat;
}


export class IStoreActiveCategory extends IModuleRes {
    data: IActiveCategory;
}