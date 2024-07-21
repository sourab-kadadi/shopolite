import { Document } from 'mongoose';
import { Role } from '../roles/roles.enum';

export interface Profile extends Document {
    readonly userId: Document;
    readonly roles: Role;
    readonly status: boolean;
    readonly location: Location;
    readonly joinDate: string;
    readonly companyName: string;
    readonly gstin: string;
    readonly addressDetails: AddressDetails;
    readonly accountDetails: AccountDetails;
    readonly createdAt: Date;
}``

export interface AddressDetails {
    readonly address1: string;
    readonly address2: string;
    readonly city: string;
    readonly taluka: string;
    readonly district: string;
    readonly state: string;
    readonly pincode: string;
}

export interface Location {
    readonly type: string;
    readonly coordinates: number[];
}

export interface AccountDetails {
    readonly accountNumber: string;
    readonly AccountName: string;
}


export enum IProfileMessage {
    createdSuccess = "GiverDetails Created Successfully",
    updateSuccess = "GiverDetails Details Update Successfully",
    deleteSuccess = "GiverDetails Details Deleted Successfully",
    foundSuccess = "GiverDetails Found Successully",
    notFound = "GiverDetails Not Found"
}