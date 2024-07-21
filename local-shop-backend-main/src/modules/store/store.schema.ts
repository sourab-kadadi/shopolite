import * as mongoose from 'mongoose';
const shortid = require('shortid');

var images = new mongoose.Schema({ filePath: String, type: String });
var account = new mongoose.Schema({
  accountNumber: String,
  AccountName: String,
});
var invoice = new mongoose.Schema({
  invoiceNumber: Number,
  invoicePrefix: String,
  TrnNumber: String,
});
var SEO = new mongoose.Schema({
  keyWords: { type: [String] },
  description: String,
});
const location = new mongoose.Schema({
  type: { type: String, default: 'Point' },
  coordinates: { type: [Number] },
});

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

const minTimeDelivery = {
  time: { type: String },
  timeUnit: { type: String }
}
// var timing = new mongoose.Schema({ start: Number, end: String, holiday: {type: String, enum: ['Open', "Close"]} });
const timeing = {
  startTime: { type: String },
  endTime: { type: String }
};

const StoreType = {
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String }
};

const timings = {
  startTime: {
    type: String
},
  endTime: {
      type: String
  },
  startTimeMin: {
    type: Number
},
  endTimeMin: {
      type: Number
  }
};


const openTimings = {
  day: {
      type: Number,
      min: 1,
      max: 7,
      required: true
  },
  nameOfDay: { type: String },
  timings: { type: [timings] },
  isHoliday: {
      type: Boolean,
      default: false
  }

}

export const store = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    businessCategoryId: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: 'category',
    },
    storeCustomId: {
      type: String,
      default: shortid.generate,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
    },
    gstNumber: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    storeOnline: {
      type: Boolean,
      required: true,
      default: true,
    },
    address1: {
      type: String,
      required: true,
      trim: true,
    },
    address2: {
      type: String,
      trim: true,
    },
    place: {
      type: String,
      trim: true,
      default: 'Bellary',
    },
    state: {
      type: String,
      trim: true,
      default: 'Karnataka',
    },
    landmark: {
      type: String,
      trim: true,
    },
    tradeLicence: {
      type: String,
      trim: true,
    },
    tradeLicenceExpDate: {
      type: Date,
    },
    location: {
      type: location,
    },
    logo: {
      type: images,
      default: undefined,
    },
    storeImage: {
      type: images,
      default: undefined,
    },
    accountDetails: {
      type: account,
      default: undefined,
    },
    invoiceDetails: {
      type: invoice,
      default: undefined,
    },
    createdAt: {
      type: Date,
      setDefaultsOnInsert: true,
      default: Date.now,
    },
    SEO: {
      type: SEO,
    },
    timing: {
      type: timeing
    },
    acceptDelivery: {
      type: Boolean,
      default: true,
    },
    mapFullAddress: {
      type: String
    },
    storeType: {
      type: StoreType
    },
    minTimingToDeliver: {
      type: minTimeDelivery,
    },
    openTimings: {
      type: [openTimings]
    },
    commissionRate: {
      type: Number
    },
    deliveryConfig: {
      type: deliveryConfig
    }
  },
  { timestamps: true },
);

store.index({ userId: 1 });
store.index({ location: '2dsphere' });


store.on('index', function (error) {
  console.log(error.message);
});
