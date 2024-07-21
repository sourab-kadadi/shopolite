import { HttpModule, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { order } from './order.schema'
import { CartModule } from '../cart/cart.module';
import { AddressModule } from '../address/address.module';
import { CatsModule } from '../users/user.module';
import { StoreModule } from '../store/store.module';
import { SmsService } from '../../service/notification/sms/sms.service';
import { FirbaseFcmService } from '../../service/notification/firbase-fcm/firbase-fcm.service';
import { UtilsService } from '../../service/utils/utils.service';
import { CalculatorModule } from '../../service/calculator/calculator.module';
import { CouponsModule } from '../coupons/coupons.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Orders', schema: order }]), CartModule, AddressModule, CatsModule, StoreModule, HttpModule, CalculatorModule, CouponsModule],
  providers: [OrderService, SmsService, FirbaseFcmService, UtilsService],
  controllers: [OrderController]
})
export class OrderModule {}
