import { Document } from 'mongoose';

export interface StoreType extends Document {
   readonly name: string,
   readonly image: StoreTypeMedia,
   readonly media: StoreTypeMedia[],
   readonly status: boolean,
}

export interface StoreTypeMedia {
    readonly filePath: string,
    readonly type: string,
}