import { Document } from 'mongoose';

export interface Address extends Document {
    tag: AddressTag,
    fullName: string;
    buildingNumber: string;
    buildingName: string;
    area: string;
    landmark: string;
    phoneNumber: string;
    reciverPhoneNumber: string;
    location: Ilocation;
    mapFullAddress: string;
} 


export enum AddressTag {
    HOME= "HOME",
    WORK = "WORK",
    HOTEL = "HOTEL",
    OUTDOOR = "OUTDOOR",
    OTHER = "OTHER"
}


interface Ilocation {
    type: string;
    coordinates: number[]
}