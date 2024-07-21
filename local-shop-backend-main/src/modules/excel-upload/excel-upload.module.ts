import { HttpModule, HttpService, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilsService } from '../../service/utils/utils.service';
import { AwsService } from '../aws/aws.service';
import { CatalogModule } from '../catalog/catalog.module';
import { StoreProductCatalogModule } from '../store-product-catalog/store-product-catalog.module';
import { StoreModule } from '../store/store.module';
import { ExcelUploadController } from './excel-upload.controller';
import { excelUpload } from './excel-upload.schema';
import { ExcelUploadService } from './excel-upload.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ExcelUpload', schema: excelUpload }]), HttpModule, CatalogModule, StoreProductCatalogModule, StoreModule],
  controllers: [ExcelUploadController],
  providers: [ExcelUploadService, UtilsService, AwsService]
})
export class ExcelUploadModule {}
