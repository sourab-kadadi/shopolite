import * as mongoose from 'mongoose';


export const fcmToken = new mongoose.Schema ({
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
}, { timestamps: true });

fcmToken.index({uuid: 1}, {unique: true, background: true})
