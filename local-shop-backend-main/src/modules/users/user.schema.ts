import * as mongoose from 'mongoose';


export const companyDetails = {
    companyName: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
}


export const fcmToken = {
    token: {
        type: String
    },
    uuid: {
        type: String
    },
    deviceInfo: {
        type: mongoose.Schema.Types.Mixed,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}

export const user = new mongoose.Schema ({
    firstName: {
        type: String,
       },
    lastName: String,
    psw: {
        type: String
       },
    email: {
         type: String,
        },
    phoneNo: {
        type: String,
        required: true,
       },
    userType: {
        type: String,
        enum: ['STORE', 'CUSTOMER', 'ADMIN'],
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
       createdAt: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    },
    lastActiveDate: {
        type: Date,
        setDefaultsOnInsert: true,
        default: Date.now
    },
    fcmToken: {
        type: [fcmToken]
    }
},{ timestamps: true }, { strict: true })

user.index({phoneNo: 1, userType: 1}, {unique: true, background: true})
mongoose.model("users", user);
user.on('index', function(error) {
    console.log(error.message);
  });
