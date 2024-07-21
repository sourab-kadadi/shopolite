import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponListModule } from '../coupon-list/coupon-list.module';
import { CouponsController } from './coupons.controller';
import { coupons } from './coupons.schema';
import { CouponsService } from './coupons.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Coupons', schema: coupons }]), CouponListModule],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService]
})
export class CouponsModule {}
