import { Document } from 'mongoose';


export interface FCMtoken extends Document{
    readonly token: string;
    readonly uuid: string;
    readonly deviceInfo: any;
    readonly timestamp: string;
 }