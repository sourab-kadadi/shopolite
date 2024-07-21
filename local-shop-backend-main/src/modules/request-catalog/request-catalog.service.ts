import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RequestCatalog } from './request-catalog.interface';
import { IModuleRes } from 'src/common.service';
import { CreateRequestCatalogDto, IRequestCatalogMessage, UpdateRequestCatalogDto, RequestCatalogfindOneByIdRes, IRequestCatalogfindManyRes } from './request-catalog.dto';
import { CalculatorService } from '../../service/calculator/calculator.service';
import * as mongoose from 'mongoose';

@Injectable()
export class RequestCatalogService {
    
    constructor(@InjectModel('RequestCatalog') private readonly Module: Model<RequestCatalog>, private calcuation: CalculatorService) {}

    async createModule(RequestCatalogDto: CreateRequestCatalogDto):Promise<IModuleRes> {
        try {
          RequestCatalogDto['sellingPrice'] = this.calcuation.sellingPrice(RequestCatalogDto.originalPrice, RequestCatalogDto.discount)
          const createRequestCatalog = new this.Module(RequestCatalogDto);
          await createRequestCatalog.save();
          return {status: true, message: IRequestCatalogMessage.createdSuccess}
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

      async updateModule(_id: string, catalogDto: UpdateRequestCatalogDto): Promise<IModuleRes> {
        try {
          let result = await this.Module.update({_id: _id}, {$set : catalogDto });
          if (result.n) {
            return {status: true, message: IRequestCatalogMessage.updateSuccess}

          } else {
            throw new HttpException(
                IRequestCatalogMessage.notFound,
              HttpStatus.NOT_FOUND,
            );
          }
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

      async deleteModule(_id: string): Promise<IModuleRes> {
        try {
          await this.Module.deleteOne({_id: _id});
          return {status: true, message: IRequestCatalogMessage.deleteSuccess}
        } catch (error) {
             throw error;
        }
      }

      async findOneModule(_id: string): Promise<RequestCatalogfindOneByIdRes> {
        try {
          let result = await this.Module.findOne({_id: _id});
          if (result) {
            return {status: true, message: IRequestCatalogMessage.foundSuccess, data: result}
          } else {
            throw new HttpException(IRequestCatalogMessage.notFound, HttpStatus.NOT_FOUND);
          }
        } catch (error) {
             throw error;
        }
      }


      async findManyModuleByStoreCustomId(
        storeId: string,
        page: number,
        count: number,
        categoryId?: string,
        subCategoryId?: string,
        filter?: string,
        status?: boolean
      ): Promise<IRequestCatalogfindManyRes> {
        try {
          let match = { storeId: mongoose.Types.ObjectId(storeId) };
          count = Number(count || 10);
          page = Number(page || 0);
          let item: any = [
            { $sort: { _id: 1 } },
            { $skip: page * count },
            { $limit: count },
          ]
          if (filter && filter != '') {
            let search = {
              $or: [
                {
                  name: { $regex: new RegExp(filter, "i") }
                },
                { CatalogName: { $regex: new RegExp(filter, "i") } },
                { subCatalogName: { $regex: new RegExp(filter, "i") } }
              ]
            };
            match = { ...match, ...search };
          }
          if (status != undefined && status != null && typeof status === "boolean") {
            match = { ...match, ...{ status: status } };
          }
          if (categoryId) {
            match = { ...match, ...{ categoryId: mongoose.Types.ObjectId(categoryId) } };
          }
          if (subCategoryId) {
            match = { ...match, ...{ subCategoryId: mongoose.Types.ObjectId(subCategoryId) } };
          }
          item.unshift({ $match: match });
          let result = this.Module.aggregate(item);
          let resultCount = this.Module.count(match);
          let data = await Promise.all([result, resultCount]);
          if (data) {
            result = data[0];
            resultCount = data[1];
          }
    
          if (result.length) {
            return {
              status: true,
              message: IRequestCatalogMessage.foundSuccess,
              data: result,
              totalCount: resultCount
            };
          } else {
            return {
              status: true,
              message: IRequestCatalogMessage.foundSuccess,
              data: [],
              totalCount: 0,
            };
          }
        } catch (error) {
          throw error;
        }
      }
}
