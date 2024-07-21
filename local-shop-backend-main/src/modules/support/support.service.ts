import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Support } from './support.interface';
import { IModuleRes } from '../../common.service';
import * as mongoose from 'mongoose';
import { clientSubmitDto, ISupportMessage } from './support.dto';

@Injectable()
export class SupportService {
    constructor(@InjectModel('Support') private readonly Module: Model<Support>) {}

    async createModule(supportDto: clientSubmitDto, user: any):Promise<IModuleRes> {
        try {
            if (user && user.userId ) { 
                supportDto.userId = user.userId,
                supportDto.userType = user.userType
            }
            if (user && user.storeId) {
                supportDto.storeId = user.storeId
            }
          const createCatalog = new this.Module(supportDto);
          await createCatalog.save();
          return {status: true, message: ISupportMessage.createdSuccess}
        } catch (error) {
          if (error.code && error.code == 11000) {
            let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
            let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
            throw new HttpException(
              DuplicateArrayToString + ' Aleary Exist',
              HttpStatus.CONFLICT,
            );
          } else {
            throw error;
          }
        }
      }

}
