import { Document } from 'mongoose';

export interface User extends Document {
   readonly firstName: string,
   readonly lastName: string,
   readonly psw: string,
   readonly email: string,
   readonly phoneNo: string,
   readonly status: boolean,
   readonly createdAt: Date,
   readonly lastActiveDate: Date,
}


export interface FCMtoken {
   token: string;
   uuid: string;
   deviceInfo: any;
   timestamp: string;
}