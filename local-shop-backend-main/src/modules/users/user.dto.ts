import { IsEmail, IsNotEmpty, Length } from "class-validator";
import { ProfileDto } from "../profile/profile.dto";
import { Role } from "../roles/roles.enum";

export class UserDto {
    readonly firstName: string;
    readonly lastName: string;
    // @IsNotEmpty({message: "Password Should Not Be Empty!"})
    // psw: string;
    readonly email: string;
    @IsNotEmpty({message: "Please enter your mobile number"})
    readonly phoneNo: string;
 }


 export class PasswordUserDto {
    readonly firstName: string;
    readonly lastName: string;
    @IsNotEmpty({message: "Password Should Not Be Empty!"})
    psw: string;
    readonly email: string;
    @IsNotEmpty({message: "Please enter your mobile number"})
    readonly phoneNo: string;
 }



 export class UserDetails {
    @IsNotEmpty({message: "First Name Should Not Be Empty!"})
    readonly firstName: string;
    @IsNotEmpty({message: "Last Name Should Not Be Empty!"})
    readonly lastName: string;
    readonly email?: string;
 }


 export class   UpdateUserDto {
    @IsNotEmpty({message: "First Name Should Not be Empty!"})
    @Length(1, 10)
    readonly firstName: string;
    @IsNotEmpty({message: "Last Name Should Not be Empty!"})
    readonly lastName: string;
    @IsEmail()
    readonly email: string;
    @IsNotEmpty({message: "Phone Number Should Not be Empty!"})
    readonly phoneNo: string;
    readonly userType: string;
    // @IsNotEmpty({message: "Phone Number  Should Not be Empty!"})
    // readonly gender: Gender
 }

 export enum UserType {
     STORE = "STORE",
     CUSTOMER = "CUSTOMER"
 }

 export class CompanyDetailsUpdateDto {
    logo: string;
}

 export class CompanyUpdateDto  extends UpdateUserDto {
    readonly companyDetails: CompanyDetailsUpdateDto;
 }

export class LoginDto {
    @IsEmail()
    readonly email: string;
    @IsNotEmpty()
    readonly psw: string;
}


export class LoginOtpDto {
    readonly otpKey: string;
    readonly otp: string;
}

export interface ILoginqRes {
    accessToken: ITokenRes;
    refreshToken: ITokenRes;
}

export interface ITokenRes {
    cookies: string;
    token: string;
}

export interface ILoginTokenPayload extends ILoginqRes {
    payload: ILoginStorePayload;
}

export interface ILoginPayload {
    firstName: string;
    lastName: string;
    email: string;
    roles: Role;
    phoneNo: string;
    userId: string;
    profileId: string;
    iat: number;
}

export interface ILoginStorePayload {
    name: string;
    phoneNo: string;
    storeId?: string;
    storeName?: string;
    userId: string;
    businessCategoryId?: string;
    iat: number;
    userType: UserType,
    storeCustomId: string
}

export class IRenewRefreshToken {
    refreshToken: string;
}


export class FCMtoken {
    @IsNotEmpty({message: "Token Should Not Be Empty!"})
    token: string;
    uuid: string;
    timestamp: string;
    deviceInfo: any;
 }
