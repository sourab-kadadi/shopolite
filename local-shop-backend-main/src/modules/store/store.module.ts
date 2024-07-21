import { HttpModule, Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { MongooseModule } from '@nestjs/mongoose';
import { store } from './store.schema';
import { CatsModule } from '../users/user.module';
import { CategoryModule } from '../category/category.module';
import { UtilsService } from '../../service/utils/utils.service';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Stores', schema: store }]), CatsModule, CategoryModule, HttpModule],
  controllers: [StoreController],
  providers: [StoreService, UtilsService],
  exports: [StoreService]
})
export class StoreModule {}
