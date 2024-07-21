import { HttpService, Module } from '@nestjs/common';
import { RequestCatalogController } from './request-catalog.controller';
import { RequestCatalogService } from './request-catalog.service';
import { MongooseModule } from '@nestjs/mongoose';
import { requestCatalog } from './request-catalog.schema';
import { CalculatorService } from '../../service/calculator/calculator.service';
import { CalculatorModule } from '../../service/calculator/calculator.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'RequestCatalog', schema: requestCatalog }]), CalculatorModule],
  controllers: [RequestCatalogController],
  providers: [RequestCatalogService]
})
export class RequestCatalogModule {}
