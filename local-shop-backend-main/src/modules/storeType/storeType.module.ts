import { Module } from '@nestjs/common';
import { StoreTypeController } from './storeType.controller';
import { StoreTypeService } from './storeType.service';
import { MongooseModule } from '@nestjs/mongoose';
import { storeType } from './storeType.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'storeTypes', schema: storeType }])],
  controllers:
   [StoreTypeController],
  providers: [StoreTypeService]
})
export class StoreTypeModule {}
