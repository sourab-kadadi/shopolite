import { HttpModule, Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { otp } from './otp.schema';
import { SmsService } from 'src/service/notification/sms/sms.service';
import { UtilsService } from 'src/service/utils/utils.service';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'OTP', schema: otp }]), HttpModule],
  controllers: [OtpController],
  providers: [OtpService,SmsService, UtilsService],
  exports: [OtpService]
})
export class OtpModule {}
