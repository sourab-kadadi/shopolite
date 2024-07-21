import { IsNotEmpty } from "class-validator";

export class OtpDto {
    @IsNotEmpty()
    userId: string;
    phoneNo: string;
}


export enum IOtpMessage {
    createdSuccess = "Otp Created Successfully",
    updateSuccess = "Otp Details Update Successfully",
    deleteSuccess = "Otp Details Deleted Successfully",
    foundSuccess = "Otp Found Successully",
    notFound = "Otp Not Found"
}


export interface  OtpRes {
    otpKey: string;
}

export interface VerifyOtpRes {
    verified: Boolean;
    userId: string;
}


export class LoingWithOtp {
    otpKey: string;
    otp: string;
}

export interface  ResendOtpReq {
    otpKey: string;
}