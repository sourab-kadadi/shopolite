import * as mongoose from 'mongoose';

const location = {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' },
  };

export const address = new mongoose.Schema ({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    tag: {
        type: String,
        enum: ['HOME', 'WORK', 'HOTEL', 'OUTDOOR', 'OTHER']
    },
    fullName: {
        type: String,
        required: true,
        trim: true
       },
    buildingNumber: {
        type: String,
        required: true,
        trim: true
       },
    buildingName: {
        type: String,
        required: true,
        trim: true
    },
    area: {
        type: String,
        required: true,
        trim: true
    },
    landmark: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    reciverPhoneNumber: {
        type: String,
        trim: true
    },
    location: location,
    mapFullAddress: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        default: true,
        trim: true
    },
});

address.index({customerId: 1});