import { IsNotEmpty, Length, ArrayMinSize, IsBoolean, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";


export class IdProofDetails {
    idName: string;
    total: number;
    requiredNumber: number;
}
export class CategoryCreateDto {
    _id?: any;
    @IsNotEmpty()
    @Length(1, 20)
     name: string;
     @IsBoolean()
     status: boolean;
     image: CategoryMedia;
     manualRanking: number;
     isStoreInventorty?: boolean;
 }
 export class CategoryUpdateDto {
    @IsOptional()
    @IsNotEmpty()
    @Length(1, 20)
    name: string;
    @IsOptional()
    @IsBoolean()
    status: boolean;
    image: CategoryMedia;
    manualRanking: number;
    isStoreInventorty?: boolean;
}

 export class CategoryMedia {
      filePath: string;
      type: string;
 }

 export enum ICategoryMessage {
    createdSuccess = "Category Created Successfully",
    updateSuccess = "Category Details Update Successfully",
    deleteSuccess = "Category Details Deleted Successfully",
    foundSuccess = "Category Found Successully",
    notFound = "Category Not Found"
}

export class ICategoryfindOneByIdRes extends IModuleRes {
    data: CategoryCreateDto;
}

export class ICategoryfindManyRes extends IModuleRes  {
    data: CategoryCreateDto[];
    totalCount: number;
}

export class ICategoryTextManyRes extends IModuleRes {
    data: CategoryCreateDto[];
}

export class ICategoryDropDownRes extends IModuleRes {
    data: CategoryCreateDto[];
}