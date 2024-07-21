import * as mongoose from 'mongoose';

export const support = new mongoose.Schema ({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    userType: {
        type: String,
        enum: ['STORE', 'CUSTOMER'],
        required: true,
        trim: true,
    },
    phoneNumberRes: {
        type: String,
        trim: true,
    },
    messageRes: {
        type: String,
        required: true,
        trim: true,
    },
    ticketResolvedStatus: {
        type: String,
        trim: true,
    },
    ticketResolvedMessage: {
        type: String,
        trim: true,
    },
    ticketResolvedDate: {
        type: Date,
        trim: true,
    },
    createdAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    }
},  { timestamps: true });

support.on('index', function(error) {
    console.log(error.message);
  });