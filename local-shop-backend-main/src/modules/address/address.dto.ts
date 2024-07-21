import { IsNotEmpty, Length, ArrayMinSize, IsBoolean, IsOptional } from "class-validator";
import { IModuleRes } from "../../common.service";
import { AddressTag } from "./address.interface";


class IGeolocation {
    type: string;
    coordinates: number[]
}


export class AddressCreateDto {
    _id?: any;
    @IsNotEmpty()
    tag: AddressTag;
    @IsNotEmpty()
    fullName: string;
    @IsNotEmpty()
    buildingNumber: string;
    @IsNotEmpty()
    buildingName: string;
    @IsNotEmpty()
    area: string;
    @IsOptional()
    landmark: string;
    @IsNotEmpty()
    phoneNumber: string;
    @IsOptional()
    reciverPhoneNumber: string;
    @IsNotEmpty()
    location: IGeolocation;
    @IsNotEmpty()
    mapFullAddress: string;

 }




 export class AddressUpdateDto {
    @IsNotEmpty()
    tag: AddressTag;
    @IsNotEmpty()
    fullName: string;
    @IsNotEmpty()
    buildingNumber: string;
    @IsNotEmpty()
    buildingName: string;
    @IsNotEmpty()
    area: string;
    @IsOptional()
    landmark: string;
    @IsNotEmpty()
    phoneNumber: string;
    @IsOptional()
    reciverPhoneNumber: string;
    @IsNotEmpty()
    location: IGeolocation;
    @IsNotEmpty()
    mapFullAddress: string;
    status: boolean;
}

 export enum IAddressMessage {
    createdSuccess = "Address Created Successfully",
    updateSuccess = "Address Details Update Successfully",
    deleteSuccess = "Address Details Deleted Successfully",
    foundSuccess = "Address Found Successully",
    notFound = "Address Not Found"
}

export class IAddressfindOneByIdRes extends IModuleRes {
    data: AddressCreateDto;
}

export class IAddressfindManyRes extends IModuleRes  {
    data: AddressCreateDto[];
    totalCount: number;
}

export class IAddressTextManyRes extends IModuleRes {
    data: AddressCreateDto[];
}

export class IAddressDropDownRes extends IModuleRes {
    data: AddressCreateDto[];
}