import * as mongoose from 'mongoose';

export const orderGroup = new mongoose.Schema ({
    orderGroupId: {
        type: String,
        required: true,
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    orderStatus: {
        enum: ["REQUEST", "ACCEPT", "REJECT", "PACKED_UP", "ON_THE_WAY", "DELIVERED"],
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    }
},  
{ timestamps: true });