import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CouponListController } from './coupon-list.controller';
import { couponList } from './coupon-list.schema';
import { CouponListService } from './coupon-list.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'CouponList', schema: couponList }])],
  controllers: [CouponListController],
  providers: [CouponListService],
  exports: [CouponListService]
})
export class CouponListModule {}
