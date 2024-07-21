import * as mongoose from 'mongoose';
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

export const CartSchemaObj = {
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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
    storeCustomId: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        trim: true,
        default: 1
    },
    totalSellingPrice: {
        type: Number,
        required: true
    },
    totalOriginalPrice: {
        type: Number,
        required: true
    },
    totalDiscount: {
        type: Number,
        required: true
    },
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
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    productName: {
        type: String,
        required: true,
        trim: true
    },
    storeProductId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sku: {
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
    sellingPrice: {
        type: Number,
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
    discount: {
        type: discountSchema
    },
    cartStatus: {
        type: String,
        enum: ["IN_CART", "CONVERTED"],
        default: "IN_CART",
        required: true
    },
    updatedAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    }
};

export const cart = new mongoose.Schema (CartSchemaObj,  { timestamps: true });

cart.index({storeId: 1, productId: 1, customerId: 1}, {unique: 1});
cart.index({customerId: 1, storeId: 1});



// storesCatalog.index({sku: 1});


cart.on('index', function(error) {
    console.log(error.message);
  });