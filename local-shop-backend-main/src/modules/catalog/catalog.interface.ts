import { Document } from 'mongoose';

export interface Catalog extends Document {
    readonly _id?: any;
    readonly categoryId: any,
    readonly categoryName: string,
    readonly barcode: string,
    readonly subCategoryId: any,
    readonly subCategoryName: string,
    readonly sku: string,
    readonly name: string;
    readonly brandName: string;
    readonly description?: string,
    readonly status: Boolean,
    readonly spec: keyValue,
    readonly image: Media,
    readonly media: Media[],
    readonly unitValue: number,
    readonly unit: string,
    readonly offerUnit: string,
    readonly originalPrice: number,
    readonly keyWord: string[],
    readonly updatedAt: Date,
    readonly createdAt: string,
    readonly restaurantMenuDishType?: string;
    readonly verified?: string;
    readonly verifiedDate?: Date;
    readonly comment?: string;
}

export interface keyValue {
    readonly key: string,
    readonly value: string
}

export interface Media {
    readonly filePath: string,
    readonly type: string,
}