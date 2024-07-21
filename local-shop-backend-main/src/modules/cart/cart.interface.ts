import { Document } from 'mongoose';
import { Discount } from '../store-product-catalog/store-product-catalog.dto';

export interface Cart extends Document {
    readonly customerId: any,
    // readonly customerName: string,
    readonly quantity: number,
    readonly totalSellingPrice: number,
    readonly totalOriginalPrice: number,
    readonly totalDiscount: number,
    readonly storeId: any,
    readonly storeName: string,
    readonly storeCustomId: string,
    readonly categoryId: any,
    readonly categoryName: string,
    readonly subCategoryId: any,
    readonly subCategoryName: string,
    readonly productId: any,
    readonly productName: string,
    readonly storeProductId: string;
    readonly brandName: string,
    readonly sku: string,
    readonly description: string,
    readonly status: Boolean,
    readonly spec?: keyValue,
    readonly image: Media,
    readonly media?: Media,
    readonly unitValue: number,
    readonly unit: string,
    readonly sellingPrice: number,
    readonly cartStatus: CartStatus,
    readonly offerUnit: string,
    readonly originalPrice: number,
    readonly barcode: string,
    readonly keyWord: string[],
    readonly discount?: Discount,
    readonly updatedAt?: Date
    readonly createdAt?: string
}


export enum CartStatus {
    IN_CART= "IN_CART",
    CONVERTED= "CONVERTED"
}

export interface keyValue {
    readonly key: string,
    readonly value: string
}

export interface Media {
    readonly filePath: string,
    readonly type: string,
}