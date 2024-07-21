import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDataModuleRes, IModuleRes } from '../../common.service';
import { AddressCreateDto, AddressUpdateDto, IAddressfindOneByIdRes, IAddressMessage } from './address.dto';
import { Address } from './address.interface';
import * as mongoose from 'mongoose';

@Injectable()
export class AddressService {

    constructor(
        @InjectModel('Address') private readonly Module: Model<Address>,
    ) { }

    async createModule(addressReq: AddressCreateDto, customerId: string): Promise<IDataModuleRes<Address>> {
        try {
            let address: Address = { customerId: customerId, ...addressReq } as Address;
            const createAddress = new this.Module(address);
            const savedaddress = await createAddress.save();
            return { status: true, message: IAddressMessage.createdSuccess, data: savedaddress };
        } catch (error) {
            throw error;
        }
    }

    async updateModule(documentId: string, customerId: string, AddressDto: AddressUpdateDto): Promise<IDataModuleRes<Address>> {
        let update = await this.Module.findOneAndUpdate({ _id: documentId, customerId: customerId }, { $set: AddressDto });
        return { status: true, message: IAddressMessage.updateSuccess, data: update };
    }

    async deleteModule(documentId: string, customerId: string): Promise<IModuleRes> {
        await this.Module.update({ _id: documentId, customerId: customerId }, {$set: {status: false}});
        return { status: true, message: IAddressMessage.deleteSuccess };
    }

    async findOneModule(documentId: string, customerId: string): Promise<IAddressfindOneByIdRes> {
        let result = await this.Module.findOne({ _id:  mongoose.Types.ObjectId(documentId), customerId: mongoose.Types.ObjectId(customerId) });
        console.log(result);
        if (!result) {
            throw new HttpException(
                IAddressMessage.notFound,
                HttpStatus.NOT_FOUND,
            );
        }
        return { message: IAddressMessage.foundSuccess, data: result };
    }

    async findManyModule(customerId: string): Promise<IAddressfindOneByIdRes> {
        let result = await this.Module.find({ customerId:  mongoose.Types.ObjectId(customerId), status: true });
        console.log(result);
        if (!result) {
            throw new HttpException(
                IAddressMessage.notFound,
                HttpStatus.NOT_FOUND,
            );
        }
        return { message: IAddressMessage.foundSuccess, data: result };
    }


}
