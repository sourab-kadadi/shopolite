import { Document } from 'mongoose';

export interface JobPost extends Document {
     giverId: any,
     companyName: string;
     giverType: EGiverType,
     jobTitle: string,
     jobDescription: string,
     vacancies: number,
     keyWord: IkeyWords[],
     workExp: IworkExp,
     ctc: Ictc,
     industry: string,
     funcArea: string,
     location: Ilocation,
     upload: string,
     type: string,
     logo: string,
     categoryId: any,
     categoryName: any,
     subCategoryId: any,
     product_category_1stlevel: any,
     image_link_front: any,
     name: any,
     brandName: any,
     status: any,
     unitValue: any,
     unit: any,
 }

 enum EGiverType {
    COMPANY="COMPANY",
    INDIVIDUAL="INDIVIDUAL"
 }

 interface Ilocation {
   country: string;
   state: string;
   city: string;
 }

 interface IworkExp {
    min: number,
    max: number
 }

 interface Ictc {
    min: number,
    max: number,
    currency: Icurrency
 }

 interface IkeyWords {
   name: string;
 }

 interface Icurrency {
   name: string,
   symbol: string;
 }