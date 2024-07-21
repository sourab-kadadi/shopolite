import { IsNotEmpty, ArrayMinSize, ArrayMaxSize, ValidateIf } from 'class-validator';
import { IModuleRes } from '../../common.service';
import { Role } from '../roles/roles.enum';
import { Profile } from './profile.interface';


export class AddressDetails {
  address1: string;
  address2: string;
  city: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
}

export class Location {
  type: string;
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  coordinates: number[];
}

export class AccountDetails {
  accountNumber: string;
  AccountName: string;
}

export class ProfileDto {
  userId: any;
  roles: Role;
  @ValidateIf(o => o.roles.includes(Role.DISTRIBUTER))
  @IsNotEmpty()
  location: Location | [];
  @ValidateIf(o => o.roles != (Role.DISTRIBUTER))
  @IsNotEmpty()
  joinDate: string;
  @ValidateIf(o => o.roles.includes(Role.DISTRIBUTER))
  @IsNotEmpty()
  companyName: string;
  @ValidateIf(o => o.roles.includes(Role.DISTRIBUTER))
  @IsNotEmpty()
  gstin: string;
  @IsNotEmpty()
  addressDetails: AddressDetails;
  accountDetails?: AccountDetails;
  createdAt: Date;
}

export class ProfileUpdateDto extends  ProfileDto {
}

export class ProfilefindOneByIdRes extends IModuleRes {
  data: Profile;
}


export class ProfilefindManyRes extends IModuleRes {
  data: Profile[];
  totalCount: number;
}

export enum IProfileMessage {
  createdSuccess = "Profile Created Successfully",
  updateSuccess = "Profile Details Update Successfully",
  deleteSuccess = "Profile Details Deleted Successfully",
  foundSuccess = "Profile Found Successully",
  notFound = "Profile Not Found"
}