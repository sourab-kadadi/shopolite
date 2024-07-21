import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalculatorModule } from '../../service/calculator/calculator.module';
import { CalculatorService } from '../../service/calculator/calculator.service';
import { CatalogModule } from '../catalog/catalog.module';
import { StoreProductCatalogController } from './store-product-catalog.controller';
import { storesCatalog } from './store-product-catalog.schema';
import { StoreProductCatalogService } from './store-product-catalog.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'StoreProductCatalog', schema: storesCatalog }]), CatalogModule, CalculatorModule],
  controllers: [StoreProductCatalogController],
  providers: [StoreProductCatalogService, CalculatorService],
  exports: [StoreProductCatalogService]
})
export class StoreProductCatalogModule {}
