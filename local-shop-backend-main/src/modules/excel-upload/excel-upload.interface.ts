export interface ExcelUpload extends Document {
    readonly fileName: string,
    readonly data: any,
    readonly referenceName: string,
    readonly index: number
}



export interface ProductData {
    readonly PRODUCT_NAME: string;
    readonly MRP: number;
    readonly BARCODE: number;
    readonly FULL_PRODUCT_NAME: string;
    readonly UNIT_VALUE: number;
    readonly UNIT: number;
    readonly MULTIPACK: string;
    readonly BRAND: string;
    readonly CATEGORY_ID: string;
    readonly CATEGORY: string;
    readonly SUB_CATEGORY_ID: string;
    readonly SUB_CATEGORY: string;
    readonly PRODUCT_IMAGE_FRONT: string;
    readonly PRODUCT_IMAGE_BACK: string;
    readonly IMG_1: string;
    readonly IMG_2: string;
    readonly IMG_3: string;
    readonly IMG_4: string;
    readonly IMG_5: string;
    readonly IMG_6: string;
}


export interface StoreProductData {
    readonly PRODUCT_NAME: string;
    readonly MRP: number;
    readonly SELLING_PRICE: number;
    readonly BARCODE: number;
    readonly FULL_PRODUCT_NAME: string;
    readonly UNIT_VALUE: number;
    readonly UNIT: number;
    readonly MULTIPACK: string;
    readonly BRAND: string;
    readonly CATEGORY_ID: string;
    readonly CATEGORY: string;
    readonly SUB_CATEGORY_ID: string;
    readonly SUB_CATEGORY: string;
    readonly PRODUCT_IMAGE_FRONT: string;
    readonly PRODUCT_IMAGE_BACK: string;
    readonly IMG_1: string;
    readonly IMG_2: string;
    readonly IMG_3: string;
    readonly IMG_4: string;
    readonly IMG_5: string;
    readonly IMG_6: string;
}