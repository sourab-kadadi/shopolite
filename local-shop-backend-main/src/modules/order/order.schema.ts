import * as mongoose from 'mongoose';
import { address } from '../address/address.schema';
import { CartSchemaObj } from '../cart/cart.schema';
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderListSchema = new mongoose.Schema({
    isPacked: {
        type: Boolean,
        default: false
    }, ...CartSchemaObj
});

const deliveryDistanceMatrix = {
    duration: {
        type: Number,
        required: true
    },
    durationUnit: {
        type: String,
        trim: true,
    },
    distance: {
        type: Number,
        required: true
    },
    distanceUnit: {
        type: String,
        trim: true,
    },
    deliveryCharge: {
        type: Number,
        required: true
    },
};

const openTimings = {
    day: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    isHoliday: {
        type: Boolean
    }
};

const couponConfig = {
    minOrderAmount: {
        type: Number,
    },
    maxDiscountAmount: {
        type: Number,
    },
    discountValue: {
        type: Number,
    }
};

const couponDetails = {
    couponId: {
        type: String,
        trim: true,
    },
    validate: {
        type: Boolean,
        trim: true,
    },
    couponConfig: couponConfig,
    discountAmount: {
        type: Number,
    },
    totalOrderAmount: {
        type: Number
    },
    error: {
        type: String,
    },
    startDate:  {
        type: Date
    },
    exiptyDate:  {
        type: Date
    },
    type: {
        type: String,
        trim: true,
    },
    couponUsage: {
        type: String,
        trim: true,
    },
    code: {
        type: String,
        trim: true,
    },
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    }
}

const deliveryConfig = {
    minDeliveryPrice: {
      type: Number,
      default: 0
    },
    thresholdDeliveryKm: {
      type: Number,
      default: 0
    },
    thresholdFlatCharges: {
      type: Number,
      default: 0
    },
    deliveryChargePerKm: {
        type: Number,
        default: 0
      }
  }

export const order = new mongoose.Schema({
    orderGroupId: {
        type: String,
        required: true,
        unique: true
    }, // New
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
    totalCartCost: {
        type: Number,
        required: true,
        trim: true,
    },
    totalCartQuantity: {
        type: Number,
        required: true
    },
    totalCartDiscount: {
        type: Number,
        required: true
    },
    totalCartOriginalPrice: {
        type: Number,
        required: true
    },
    totalStoreCommisionCost: {
        type: Number,
        // required: true
    },
    totalStoreOrderCost: {
        type: Number,
        // required: true
    },
    storeCommisionRate: {
        type: Number,
        // required: true
    },
    totalDeliveryCost: {
        type: Number,
        // required: true
    },
    totalCustomerOrderCost: {
        type: Number,
        // required: true      
    },
    isthresholdDeliveryKm: {
        type: Boolean,
    },
    orderList: {
        type: [orderListSchema],
        required: true,
    },
    couponDetails: couponDetails,
    orderStatus: {
        type: String,
        enum: ["PENDING", 'ACCEPT', 'REJECT', "READY_TO_DELIVER", 'DELIVERED', 'RETURN', ],
        default: "PENDING"
    },
    address: {
        type: address
    },
    note: {
        type: String,
        trim: true,
    },
    openTimings: {
        type: [openTimings]
    },
    deliveryDistanceMatrix: deliveryDistanceMatrix,
    deliveryConfig: deliveryConfig,
    createdAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    }
}, { timestamps: true });

// order.index({storeId: 1, productId: 1}, {unique: 1});
// order.index({customerId: 1, storeId: 1});
order.index({orderGroupId: 'text', storeName: 'text', 'orderList.productName': 'text', 'orderList.brandName': 'text'})
// order.plugin(AutoIncrement, {inc_field: 'orderGroupId', start_seq: 10000, inc_amount: 4});

// storesCatalog.index({sku: 1});
mongoose.model('Orders', order);
order.on('index', function (error) {
    console.log(error.message);
});