import * as mongoose from 'mongoose';


export const otp = new mongoose.Schema ({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: true
    },
    otp: {
    type: String,
    unique: true
    },
    otpKey: {
    type: String,
    unique: true
    }
}, { timestamps: true }, { strict: true });

otp.index({createdAt: 1}, {expireAfterSeconds: 600});
mongoose.model("OTP", otp);
otp.on('index', function(error) {
    console.log(error.message);
});