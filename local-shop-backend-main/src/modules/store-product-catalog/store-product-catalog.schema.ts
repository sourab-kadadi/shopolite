import * as mongoose from 'mongoose';
import { ERestaurantMenuDishType } from '../catalog/catalog.dto';
const shortid = require('shortid');
var media = new mongoose.Schema({ 
    filePath:{
        type: String,
        required: true
    }, type: {
     type: String,
     required: true,
 }});

 var discountSchema = new mongoose.Schema({
    value: {
        type: Number
    },
    status: {
        type: Boolean
    },
    type: {
        type: String,
        enum: ['AMOUNT', 'PERCENTAGE'],
    }
 });
 
const keyPair = {
    key: {
        type: String,
    },
    value: {
        type: String,
    },
    required: {
        type: Boolean,
    },
};

export const storesCatalog = new mongoose.Schema ({
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    storeName: {
        type: String,
        required: true,
        trim: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    storeCustomId: {
        type: String,
        required: true,
    },
    categoryName: {
        type: String,
        required: true,
        trim: true,
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    subCategoryName: {
        type: String,
        required: true,
        trim: true
    },
    barcode: {
        type: String
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    sku: {
        type: String
    },
    referenceName: {
        type: String
    },
    brandName: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean
    },

    spec: {
        type:[keyPair]
    },
    image: {
        type: media,
        required: true
    },
    media: {
        type: [media],
        default: []
    },
    unitValue: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        // enum: ['kg', 'lt', 'cm', 'hr'],
        required: true
    },
    offerUnit: {
        type: String
    },
    originalPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: discountSchema
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    actualStoreMrp: {
        type: Number,
        required: true
    },
    keyWord: {
        type: [String]
    },
    restaurantMenuDishType: {
        type: String,
        enum: [ERestaurantMenuDishType.VEG, ERestaurantMenuDishType.NON_VEG, ERestaurantMenuDishType.EGG],
    },
    updatedAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    }
},  { timestamps: true });

storesCatalog.index({storeId: 1, productId: 1}, {unique: 1});
storesCatalog.index({productName: 1});
storesCatalog.index({brandName: 1});
storesCatalog.index({subCategoryName: 1});






storesCatalog.on('index', function(error) {
    console.log(error.message);
  });