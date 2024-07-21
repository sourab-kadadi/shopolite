import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CalculatorModule } from 'src/service/calculator/calculator.module';
import { CalculatorService } from '../../service/calculator/calculator.service';
import { AddressModule } from '../address/address.module';
import { CouponsModule } from '../coupons/coupons.module';
import { StoreProductCatalogModule } from '../store-product-catalog/store-product-catalog.module';
import { StoreModule } from '../store/store.module';
import { CartController } from './cart.controller';
import { cart } from './cart.schema';
import { CartService } from './cart.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cart', schema: cart }]), StoreProductCatalogModule, CalculatorModule, CouponsModule, AddressModule, StoreModule],
  controllers: [CartController],
  providers: [CartService, CalculatorService],
  exports: [CartService]
})
export class CartModule {}
