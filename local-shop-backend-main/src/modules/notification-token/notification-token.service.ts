import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FCMtoken } from './notificationToken.interface';
import { FCMtokenDto } from './notificationToken.dto';

@Injectable()
export class NotificationTokenService {

    constructor(
        @InjectModel('FCMtoken') private readonly Model: Model<FCMtoken>,
    ) {

    }

    async createModule(fcmToken: FCMtokenDto): Promise<any> {
          try {
            await this.Model.findOneAndUpdate({uuid: fcmToken.uuid}, fcmToken, {upsert: true} );
            return {message: "Created Successfully"};
          } catch (error) {
            if (error.code && error.code == 11000) {
              throw new HttpException(
                'UUID Aleary Exist',
                HttpStatus.CONFLICT,
              );
            } else {
               throw error;
            }
    
      }

}
}