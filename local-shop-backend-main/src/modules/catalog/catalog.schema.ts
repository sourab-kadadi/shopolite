import * as mongoose from 'mongoose';
import { isString } from 'util';
import { ERestaurantMenuDishType } from './catalog.dto';
const shortid = require('shortid');
var media = new mongoose.Schema({ 
    filePath:{
        type: String,
        required: true
    }, type: {
     type: String,
     required: true,
 }});
 
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
}

export const catalog = new mongoose.Schema ({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
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
    sku: {
        type: String,
        default: shortid.generate,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
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
    barcode: {
        type: String
    },
    keyWord: {
        type: [String]
    },
    restaurantMenuDishType: {
        type: String,
        enum: [ERestaurantMenuDishType.VEG, ERestaurantMenuDishType.NON_VEG, ERestaurantMenuDishType.EGG],
    },
    verified: {
        type: Boolean,
        default: false,
        required: true,
    },
    verifiedDate: {
        type: Date
    },
    comment: {
        type: String
    },
    updatedAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    }
},  { timestamps: true });

catalog.index({sku: 1});
catalog.index({barcode: 1}, { unique: true });
catalog.index({brandName: 1});
catalog.index({name: 1});
catalog.index({subCategoryName: 1});


catalog.on('index', function(error) {
    console.log(error.message);
  });