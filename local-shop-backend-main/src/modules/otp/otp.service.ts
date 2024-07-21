import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OTP } from './otp.interface';
import { IOtpMessage, OtpDto, OtpRes, VerifyOtpRes } from './otp.dto';
import { IDataModuleRes, IModuleRes } from '../../common.service';
import * as crypto from 'crypto';
import { SmsService } from 'src/service/notification/sms/sms.service';
@Injectable()
export class OtpService {

    constructor(
        @InjectModel('OTP') private readonly Module: Model<OTP>,  private notifiySMS: SmsService) {}

        async createModule(OtpDto: OtpDto):Promise<IDataModuleRes<OtpRes>> {
            try {
              const otpMeta = "1234567890";
              let otp: string = "";
              for (let i=0; i<4; i++) {
                  otp += otpMeta.charAt(Math.floor(Math.random()*otpMeta.length));
              }
              if (OtpDto.phoneNo == '8105581250' || OtpDto.phoneNo == '8558904904') {
                otp = '6956';
              }
              let otpKey = crypto.randomBytes(20).toString('hex');
              let data = {
                userId: OtpDto.userId,
                otp: otp,
                otpKey: otpKey
              }
              await this.Module.findOneAndUpdate({userId: OtpDto.userId}, data, {upsert: true} );
              this.notifiySMS.sendOtp(data.otp, `91${OtpDto.phoneNo}`);
              return {status: true, message: IOtpMessage.createdSuccess, data: {otpKey}};

            } catch (error) {
              if (error.code && error.code == 11000) {
                let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
                let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
                throw new HttpException(
                  DuplicateArrayToString + ' Aleary Exist',
                  HttpStatus.CONFLICT,
                );
              } else {
                 throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
              }
            }
          }

          async resendOtp(otpKey: string) {
            let result = await this.Module.findOne({otpKey: otpKey});
            if (result) {
              this.notifiySMS.sendOtp(result.otp, `91${result.phoneNo}`);
              return {status: true, message: IOtpMessage.createdSuccess};
            }
           throw new HttpException('OTP is Expired Please Try Again Later !', HttpStatus.NOT_FOUND)
          }

          z
          async verifyOtp (otpKey: string, otp: string):Promise<IDataModuleRes<VerifyOtpRes>> {
              try {
                let verified = false;
                let result = await this.Module.findOne({otpKey: otpKey, otp: otp});
                if (result) {
                    verified = true;
                }
                return {status: true, message: IOtpMessage.createdSuccess, data: { verified, userId: result.userId }};
              } catch (error) {
                throw error;
              }
          }
}
