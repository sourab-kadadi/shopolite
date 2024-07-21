import { IsNotEmpty, Length, ArrayMinSize, IsBoolean, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";


export class IdProofDetails {
    idName: string;
    total: number;
    requiredNumber: number;
}
export class StoreTypeCreateDto {
    _id?: any;
    @IsNotEmpty()
    @Length(1, 20)
     name: string;
     @IsBoolean()
     status: boolean;
     image: StoreTypeMedia;
 }
 export class StoreTypeUpdateDto {
    @IsOptional()
    @IsNotEmpty()
    @Length(1, 20)
    name: string;
    @IsOptional()
    @IsBoolean()
    status: boolean;
    image: StoreTypeMedia;
}

 export class StoreTypeMedia {
      filePath: string;
      type: string;
 }

 export enum IStoreTypeMessage {
    createdSuccess = "StoreType Created Successfully",
    updateSuccess = "StoreType Details Update Successfully",
    deleteSuccess = "StoreType Details Deleted Successfully",
    foundSuccess = "StoreType Found Successully",
    notFound = "StoreType Not Found"
}

export class IStoreTypefindOneByIdRes extends IModuleRes {
    data: StoreTypeCreateDto;
}

export class IStoreTypefindManyRes extends IModuleRes  {
    data: StoreTypeCreateDto[];
    totalCount: number;
}

export class IStoreTypeTextManyRes extends IModuleRes {
    data: StoreTypeCreateDto[];
}

export class IStoreTypeDropDownRes extends IModuleRes {
    data: StoreTypeCreateDto[];
}