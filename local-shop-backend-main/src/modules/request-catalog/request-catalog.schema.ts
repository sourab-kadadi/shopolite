import * as mongoose from 'mongoose';
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
}

export const requestCatalog = new mongoose.Schema ({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    categoryName: {
        type: String,
        required: true,
        trim: true,
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    storeName: {
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
        unique: true,
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
    requestStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Live', 'Reject'],
        default: "Pending"
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
    barcode: {
        type: String
    },
    updatedAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    }
},  { timestamps: true });

requestCatalog.index({name: 1, unitValue: 1}, {unique: true});
requestCatalog.index({sku: 1});
requestCatalog.index({barcode: 1}, { sparse: true, unique: true });

requestCatalog.on('index', function(error) {
    console.log(error.message);
  });