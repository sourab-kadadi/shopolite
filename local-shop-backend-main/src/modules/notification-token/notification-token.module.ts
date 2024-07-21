import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationTokenController } from './notification-token.controller';
import { NotificationTokenService } from './notification-token.service';
import { fcmToken } from './notificationToken.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'FCMtoken', schema: fcmToken }])],
  controllers: [NotificationTokenController],
  providers: [NotificationTokenService]
})
export class NotificationTokenModule {}
