import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressController } from './address.controller';
import { address } from './address.schema';
import { AddressService } from './address.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Address', schema: address }])],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService]
})
export class AddressModule {}
