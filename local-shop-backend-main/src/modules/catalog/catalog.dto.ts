import { IsNotEmpty, ArrayMinSize, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";
import { Catalog } from "./catalog.interface";

export class CreateCatalogDto {
    _id?: any;
    categoryId: any;
    categoryName: string;
    barcode: string;
    subCategoryId: any;
    subCategoryName: string;
    name: string;
    brandName: string;
    description?: string;
    status: Boolean;
    spec?: keyValue;
    image: Media;
    media: Media;
    unitValue: number;
    unit: string;
    offerUnit: string;
    originalPrice: number;
    keyWord: string[];
    restaurantMenuDishType?: string;
    verified: boolean;
    verifiedDate?: Date;
    comment?: String;
}


export class UpdateCatalogDto {
    storeId: any;
    categoryId: any;
    categoryName: string;
    barcode: string;
    subCatalogId: any;
    subCatalogName: string;
    name: string;
    brandName: string;
    description: string;
    status: Boolean;
    spec?: keyValue;
    image: Media;
    media: Media;
    unitValue: number;
    unit: string;
    offerUnit: string;
    originalPrice: number;
    keyWord: string[];
    restaurantMenuDishType?: string;
    verified: boolean;
    verifiedDate?: Date;
    comment?: String;
}

export class Media {
    filePath: string;
    type: string;
}

export class CatalogfindOneByIdRes extends IModuleRes {
    data: Catalog;
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

export enum ERestaurantMenuDishType {
    VEG = "VEG",
    NON_VEG = "NON_VEG",
    EGG = "EGG",
}

export enum ICatalogMessage {
    createdSuccess = "Catalog Created Successfully",
    updateSuccess = "Catalog Details Update Successfully",
    deleteSuccess = "Catalog Details Deleted Successfully",
    foundSuccess = "Catalog Found Successully",
    notFound = "Catalog Not Found"
}

export class ICatalogfindOneByIdRes extends IModuleRes {
    data: CreateCatalogDto;
}

export class ICatalogfindManyRes extends IModuleRes {
    data: CreateCatalogDto[];
    totalCount: number;
}

export class ICatalogTextManyRes extends IModuleRes {
    data: CreateCatalogDto[];
}

export class ICatalogDropDownRes extends IModuleRes {
    data: CreateCatalogDto[];
}