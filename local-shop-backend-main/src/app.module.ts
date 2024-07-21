import { HttpModule, HttpService, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './modules/users/user.module';
import { StoreModule } from './modules/store/store.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { OrderModule } from './modules/order/order.module';
import { CategoryModule } from './modules/category/category.module';
import { StoreRegistrationModule } from './modules/StoreRegistration/storeRegistration.module';
import { GiverPostModule } from './modules/giver-post/giver-post.module';
import { GiverDetailsModule } from './modules/giver-details/giver-details.module';
import { JobPostModule } from './modules/job-post/job-post.module';
import { UtilsService } from './service/utils/utils.service';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './modules/aws/aws.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SubCategoryModule } from './modules/sub-category/sub-category.module';
import configuration from './config/configeration';
import { RedisModule } from './modules/redis/redis.module';
import { ServiceConfigModule } from './modules/service-config/service-config.module';
import { ServiceDataModule } from './modules/service-data/service-data.module';
import { UserServiceModule } from './modules/user-service/user-service.module';
import { CandidateProfileModule } from './modules/candidate-profile/candidate-profile.module';
import { JobApplyModule } from './modules/job-apply/job-apply.module';
import { HealthCheckController } from './modules/health-check/health-check.controller';
import { FinCompanyModule } from './modules/fin-company/fin-company.module';
import { OtpModule } from './modules/otp/otp.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './modules/Auth/jwt.strategy';
import { StoreProductCatalogModule } from './modules/store-product-catalog/store-product-catalog.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderGroupModule } from './modules/order-group/order-group.module';
import { AddressModule } from './modules/address/address.module';
import { FirbaseFcmService } from './service/notification/firbase-fcm/firbase-fcm.service';
import { StoreTypeModule } from './modules/storeType/storeType.module';
import { SmsService } from './service/notification/sms/sms.service';
import { SupportModule } from './modules/support/support.module';
import { RequestCatalogModule } from './modules/request-catalog/request-catalog.module';
import { CalculatorService } from './service/calculator/calculator.service';
import { ExcelUploadModule } from './modules/excel-upload/excel-upload.module';
import { NotificationTokenModule } from './modules/notification-token/notification-token.module';
import { MapService } from './service/map/map.service';
import { MapModule } from './service/map/map.module';
import { CalculatorModule } from './service/calculator/calculator.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { CouponListModule } from './modules/coupon-list/coupon-list.module';
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://iknowjobs:Samarth123@iknowjobsdb.a6cww.mongodb.net/shopolite-prod?retryWrites=true',
      { useNewUrlParser: true, poolSize: 10 },
    ),
    CatsModule,
    StoreModule,
    CatalogModule,
    OrderModule,  
    CategoryModule,
    StoreRegistrationModule,
    GiverPostModule,
    GiverDetailsModule,
    JobPostModule,
    ConfigModule.forRoot({ load: [configuration], isGlobal: true, envFilePath: ['.env.dev'] }),
    AwsModule,
    ProfileModule,
    SubCategoryModule,
    RedisModule,
    ServiceConfigModule,
    ServiceDataModule,
    UserServiceModule,
    CandidateProfileModule,
    JobApplyModule,
    FinCompanyModule,
    StoreTypeModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    OtpModule,
    JwtModule.register({
      secret: "samarth1234",
      signOptions: { expiresIn: '60s' },
    }),
    StoreProductCatalogModule,
    CartModule,
    OrderGroupModule,
    AddressModule,
    HttpModule,
    SupportModule,
    RequestCatalogModule,
    ExcelUploadModule,
    NotificationTokenModule,
    MapModule,
    CalculatorModule,
    CouponsModule,
    CouponListModule,
  ],
  controllers: [AppController, HealthCheckController],
  providers: [AppService, UtilsService, JwtStrategy, FirbaseFcmService, SmsService, CalculatorService, MapService],
  exports: [SmsService, MapService]
})
export class AppModule {}
