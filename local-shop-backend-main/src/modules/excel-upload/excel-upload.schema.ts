import { String } from 'aws-sdk/clients/cloudsearchdomain';
import * as mongoose from 'mongoose';

const productData  =  {
    PRODUCT_NAME: {
       type: String
    },
    MRP: {
       type: Number
    },
    BARCODE: {
       type: Number
    },
    FULL_PRODUCT_NAME: {
       type: String
    },
    UNIT_VALUE: {
       type: Number
    },
    UNIT: {
       type: Number
    },
    MULTIPACK: {
       type: String
    },
    BRAND: {
       type: String
    },
    CATEGORY_ID: {
       type: String
    },
    CATEGORY: {
       type: String
    },
    SUB_CATEGORY_ID: {
       type: String
    },
    SUB_CATEGORY: {
       type: String
    },
    PRODUCT_IMAGE_FRONT: {
       type: String
    },
    PRODUCT_IMAGE_BACK: {
       type: String
    },
    IMG_1: {
       type: String
    },
    IMG_2: {
       type: String
    },
    IMG_3: {
       type: String
    },
    IMG_4: {
       type: String
    },
    IMG_5: {
       type: String
    },
    IMG_6: {
       type: String
    }
}



export const excelUpload = new mongoose.Schema ({
    data: {
        type: Object
    },
    error: {
        type: String
    },
    referenceName: {
        type: String
    },
    index: {
        type: Number
    },
    createdAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    }
},  { timestamps: true });