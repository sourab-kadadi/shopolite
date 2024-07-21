import { Document } from 'mongoose';
import { Discount } from '../../service/calculator/calculator.service';

export interface StoreProductCatalog extends Document {
    readonly _id?: any;
    readonly storeId: any,
    readonly storeName: string,
    readonly storeCustomId: string,
    readonly barcode: string;
    readonly categoryId: any,
    readonly categoryName: string,
    readonly subCategoryId: any,
    readonly subCategoryName: string,
    readonly productId: any,
    readonly productName: string,
    readonly brandName: string,
    readonly sku: string,
    readonly description: string,
    readonly status: Boolean,
    readonly spec?: keyValue,
    readonly image: Media,
    readonly media?: Media[],
    readonly unitValue: number,
    readonly unit: string,
    readonly sellingPrice: number,
    readonly originalPrice: number,
    readonly actualStoreMrp: number;
    readonly offerUnit?: string,
    readonly discount?: Discount,
    readonly keyWord?: string[],
    readonly restaurantMenuDishType?: string;
    readonly referenceName?: string;
    readonly updatedAt?: Date,
    readonly createdAt?: string
}

export interface keyValue {
    readonly key: string,
    readonly value: string
}

export interface Media {
    readonly filePath: string,
    readonly type: string,
}