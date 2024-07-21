import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HoganCompileType } from '../../utils/utils.dto';
import { UtilsService } from '../../utils/utils.service';

@Injectable()
export class SmsService {

    constructor(private readonly httpService: HttpService, private configService: ConfigService, private utils: UtilsService) { }


    async sendOtp(otp: string, phoneNo: string) {
        try {
            const msg = `OTP for Login on SHOPOLITE is ${otp} and is valid for 10 minutes only. Do not share with anyone.`
            this.sendSms(msg, phoneNo)
        } catch (error) {
            console.log(error);
        }
    }


    async sendSmSByOrderStatus(phoneNo: string, template: string, data: any) {
        try {
            let msg = await this.utils.hoganTemplate(template, data, HoganCompileType.TEXT);
            this.sendSms(msg, phoneNo);
        }  catch (error) {
            console.log(`FCM NOTIFICATION ERROR/////////////// ${error} //////////////////`);
        }
    }




    async sendSms(message: string, phoneNo: string) {
        try {
            let smsEnv = this.configService.get("sms");
            let url=`${smsEnv.sms_url}?apiKey=${smsEnv.sms_api_key}&sender=${smsEnv.sms_sender}&numbers=${phoneNo}&message=${message}`;
            this.httpService.axiosRef.post(url);
        } catch (error) {
            console.log(`FCM NOTIFICATION ERROR/////////////// ${error} //////////////////`);
        }
    }
    
}
