import { Document } from 'mongoose';
import { Discount } from '../store-product-catalog/store-product-catalog.dto';

export interface RequestCatalog extends Document {
    readonly _id?: any;
    readonly storeId: any,
    readonly storeName: string,
    readonly categoryId: any,
    readonly categoryName: string,
    readonly barcode: string,
    readonly subCategoryId: any,
    readonly subCategoryName: string,
    readonly sku: string,
    readonly name: string;
    readonly brandName: string;
    readonly description: string,
    readonly status: Boolean,
    readonly spec: keyValue,
    readonly image: Media,
    readonly media: Media,
    readonly requestStatus: REQUEST_STATUS,
    readonly unitValue: number,
    readonly unit: string,
    readonly originalPrice: number,
    readonly discount?: Discount,
    readonly sellingPrice: number,
    readonly updatedAt: Date
    readonly createdAt: string
}

export enum REQUEST_STATUS {
    Pending = 'Pending',
    Approved = 'Approved',
    Live = 'Live',
    Reject = 'Reject    '
}

export interface keyValue {
    readonly key: string,
    readonly value: string
}

export interface Media {
    readonly filePath: string,
    readonly type: string,
}