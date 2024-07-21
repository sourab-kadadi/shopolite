import { Document } from 'mongoose';

export interface Category extends Document {
   readonly name: string,
   readonly image: CategoryMedia,
   readonly media: CategoryMedia[],
   readonly status: boolean,
   readonly manualRanking: number,
   readonly isStoreInventorty?: boolean;

}

export interface CategoryMedia {
    readonly filePath: string,
    readonly type: string,
}