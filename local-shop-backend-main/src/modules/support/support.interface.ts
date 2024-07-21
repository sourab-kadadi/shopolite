import { Document } from 'mongoose';

export interface Support extends Document {
    readonly userId: any,
    readonly storeId: string,
    readonly userType: any,
    readonly phoneNumberRes: number,
    readonly messageRes: string,
    readonly ticketResolvedStatus: string,
    readonly ticketResolvedMessage: string,
    readonly ticketResolvedDate: Date,
    readonly createdAt: Date,
    readonly updatedAt: Date
}

