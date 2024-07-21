import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { IModuleRes } from "src/common.service";
import { Support } from "./support.interface";
// import { ProfileDto } from "../profile/profile.dto";
// import { Role } from "../roles/roles.enum";

export class clientSubmitDto {
    @IsNotEmpty()
    userId: any;
    @IsNotEmpty()
    storeId: any;
    @IsNotEmpty()
    userType: UserType;
    phoneNumberRes: number;
    @IsNotEmpty()
    messageRes: string;
    createdAt: Date;
    updatedAt: Date;
}

 export enum UserType {
     STORE = "STORE",
     CUSTOMER = "CUSTOMER"
 }


 export class adminSubmitDto {
    @IsNotEmpty()
    ticketResolvedStatus: any;
    @IsNotEmpty()
    ticketResolvedMessage: any;
    @IsNotEmpty()
    ticketResolvedDate: Date;
}

export class adminUpdateDto {
    @IsNotEmpty()
    ticketResolvedStatus: any;
    @IsNotEmpty()
    ticketResolvedMessage: any;
    @IsNotEmpty()
    ticketResolvedDate: Date;
}

export class SupportfindOneByIdRes extends IModuleRes {
    data: Support;
}

export enum ISupportMessage {
    createdSuccess = "Support request created Successfully",
    updateSuccess = "Support request updateed Successfully",
    deleteSuccess = "Support request deleted Successfully",
    foundSuccess = "Support request Found Successully",
    notFound = "Support request Not Found"
}

export class ISupportfindOneByIdRes extends IModuleRes {
    data: Support;
}

export class ISupportfindManyRes extends IModuleRes  {
    data: Support[];
    totalCount: number;
}

