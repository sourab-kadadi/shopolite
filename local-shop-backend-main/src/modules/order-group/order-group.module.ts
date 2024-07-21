import { Module } from '@nestjs/common';
import { OrderGroupController } from './order-group.controller';
import { OrderGroupService } from './order-group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { orderGroup } from './order-group.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'OrderGroup', schema: orderGroup }])],
  controllers: [OrderGroupController],
  providers: [OrderGroupService]
})
export class OrderGroupModule {}
