import * as mongoose from 'mongoose';

const location = new mongoose.Schema({
  type: { type: String, default: 'Point' },
  coordinates: { type: [Number], require: true, index: '2dsphere' },
});

var account = {
  accountNumber: String,
  AccountName: String,
};
var addressDetails =  new mongoose.Schema({
  address1: {
    type: String,
    required: true,
    trim: true,
  },
  address2: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  taluka: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  pincode: {
    type: String,
    trim: true,
  },
});


export const Profile = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      trim: true,
    },
    roles: {
      type: [String],
      enum: ['ADMIN', 'SALES_OFFICER', 'MANAGER', 'ACCOUNTANT', 'DISTRIBUTER', 'COMPANY'],
      required: true,
    },
    joinDate: {
      type: Date
    },
    status: {
      type: Boolean,
      default: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    gstin: {
      type: String,
      trim: true,
    },
    location: {
      type: location
    },
    addressDetails: {
      type: addressDetails,
      required: true,
    },
    accountDetails: {
      type: account,
      default: undefined,
    },
    createdAt: {
      type: Date,
      setDefaultsOnInsert: true,
      default: Date.now,
    },
  },
  { timestamps: true },
  { strict: true }
);

Profile.index({ name: 1 });

Profile.on('index', function(error) {
  console.log(error.message);
});
