import { IModuleRes } from "src/common.service";

export interface CatalogUploadData {
    PRODUCT_NAME: string;
    MRP: number;
    BARCODE: number;
    FULL_PRODUCT_NAME: string;
    UNIT_VALUE: number;
    UNIT: number;
    MULTIPACK: string;
    BRAND: string;
    CATEGORY_ID: string;
    CATEGORY: string;
    SUB_CATEGORY_ID: string;
    SUB_CATEGORY: string;
    PRODUCT_IMAGE_FRONT: string;
    PRODUCT_IMAGE_BACK: string;
    IMG_1: string;
    IMG_2: string;
    IMG_3: string;
    IMG_4: string;
    IMG_5: string;
    IMG_6: string;
}

export class IExcelfindOneByIdRes extends IModuleRes {
    data: CatalogUploadData;
}



export enum ICatalogMessage {
    deleteSuccess = "Excel Details Deleted Successfully",
    foundSuccess = "Excel data Found Successully",
    notFound = "Excel dataNot Found"
}


export class IExcelDatafindManyRes extends IModuleRes  {
    data: CatalogUploadData[];
    totalCount: number;
}