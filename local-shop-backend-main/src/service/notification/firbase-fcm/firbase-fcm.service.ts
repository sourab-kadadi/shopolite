import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HoganCompileType } from '../../utils/utils.dto';
import { UtilsService } from '../../utils/utils.service';
import { NoticaitonFCM, NotifiactionDefault, NotificationReq } from './firebase-fcm.dto';

@Injectable()
export class FirbaseFcmService {

    constructor(private readonly httpService: HttpService, private configService: ConfigService, public utils: UtilsService) { }


    async fcmNotification(notifactionReq: NotificationReq, isStoreOrder?: boolean){
        try {
            const msg = await this.utils.hoganTemplate(notifactionReq.bodyTemplate, notifactionReq.tempateData, HoganCompileType.TEXT);
            const fcmMessage: NoticaitonFCM = {
                registration_ids: notifactionReq.registration_ids,
                notification: {
                    title: notifactionReq?.title || NotifiactionDefault.TITLE,
                    body: msg,
                    image: NotifiactionDefault.IMAGE_URL,
                    ...(isStoreOrder ?{
                        "android_channel_id": "fcm_default_channel",
                        "channel_id": "fcm_default_channel",
                    } : {})
                },
                data: notifactionReq.data || undefined,
                android: {
                    notification: {
                      imageUrl: NotifiactionDefault.IMAGE_URL
                    }
                  }
            }
            this.sendNotification(fcmMessage);
        }  catch (error) {
            console.log(`FCM NOTIFICATION ERROR/////////////// ${error} //////////////////`);
        }
    }


    async sendNotification(fcmMessage: NoticaitonFCM) {
        try {
            let firebaseFMC = this.configService.get("firebaseNotification");
            const option: any = {
                headers: { 'Authorization': `key=${firebaseFMC?.firebase_fcm_server_key}`}
            };
            const body = fcmMessage;
            this.httpService.axiosRef.post(firebaseFMC?.firebase_fcm_url, body, option);
        } catch (error) {
            console.log(`FCM NOTIFICATION ERROR/////////////// ${error} //////////////////`);
        }
    }


    
}
