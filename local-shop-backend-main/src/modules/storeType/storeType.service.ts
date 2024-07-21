import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoreType } from './storeType.interface';
import { IModuleRes } from '../../common.service';
import {
  IStoreTypeMessage,
  StoreTypeCreateDto,
  StoreTypeUpdateDto,
  IStoreTypefindOneByIdRes,
  IStoreTypefindManyRes,
  IStoreTypeDropDownRes,
} from './storeType.dto';
import { IsBoolean } from 'class-validator';
@Injectable()
export class StoreTypeService {
  constructor(
    @InjectModel('storeTypes') private readonly Module: Model<StoreType>,
  ) {}

  async createModule(StoreTypeDto: StoreTypeCreateDto): Promise<IModuleRes> {
    try {
      const createUser = new this.Module(StoreTypeDto);
      await createUser.save();
      return { message: IStoreTypeMessage.createdSuccess };
    } catch (error) {
      if (error.code && error.code == 11000) {
        let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
        let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
        throw new HttpException(
          DuplicateArrayToString.toUpperCase() + ' Aleary Exist',
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateModule(
    StoreTypeId: string,
    StoreTypeDto: StoreTypeUpdateDto,
  ): Promise<IModuleRes> {
    try {
      let result = await this.Module.update(
        { _id: StoreTypeId },
        { $set: StoreTypeDto },
      );
      return { status: true, message: IStoreTypeMessage.updateSuccess };
    } catch (error) {
      if (error.code && error.code == 11000) {
        let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
        let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
        throw new HttpException(
          DuplicateArrayToString + ' Aleary Exist',
          HttpStatus.CONFLICT,
        );
      } else {
         throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async deleteModule(StoreTypeId: string): Promise<IModuleRes> {
    try {
      await this.Module.deleteOne({ _id: StoreTypeId });
      return { status: true, message: IStoreTypeMessage.deleteSuccess };
    } catch (error) {
       throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneModule(StoreTypeId: string): Promise<IStoreTypefindOneByIdRes> {
    try {
      let result = await this.Module.findOne({ _id: StoreTypeId }, { __v: 0 });
      if (result) {
        return {
          status: true,
          message: IStoreTypeMessage.foundSuccess,
          data: result,
        };
      } else {
        return {
          status: false,
          message: IStoreTypeMessage.notFound,
          data: null,
        };
      }
    } catch (error) {
       throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findManyModule(
    page: number,
    count: number,
    filter?: string,
    status?: boolean
  ): Promise<IStoreTypefindManyRes> {
    try {
      let match = {};
      count = Number(count || 10);
      page = Number(page || 0);
      let totalCount: any = [{ $count: 'count' }];
      let item: any = [
        { $sort: { _id: 1 } },
        { $skip: page * count },
        { $limit: count },
      ]
      if (filter && filter != '') {
        let search = {
          $or: [{
            name: { $regex: new RegExp(filter, "i") }
          },
          { type: { $regex: new RegExp(filter, "i") } }]
        };
        match = { ...match, ...search};
      }
      if (status != undefined && status != null && typeof status === "boolean") {
        match = { ...match, ...{status: status}};
      }
      if(match && match != {}) {
        item.unshift({$match: match});
        totalCount.unshift({$match: match});
        }
      let result = await this.Module.aggregate([
        {
          $facet: {
            item: item,
            totalCount: totalCount,
          },
        },
      ]);
      if (result && result[0].item.length > 0) {
        return {
          status: true,
          message: IStoreTypeMessage.foundSuccess,
          data: result[0].item,
          totalCount: result[0].totalCount[0].count,
        };
      } else {
        return {
          status: false,
          message: IStoreTypeMessage.notFound,
          data: null,
          totalCount: 0,
        };
      }
    } catch (error) {
       throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findManyTextModule(search: string, page: number, count: number,): Promise<IStoreTypefindManyRes> {
    try {
      let result = await this.Module.aggregate(
        [
          {
            $facet: {
              item: [
                {$match: { $text: { $search: search } }},
                { $sort: { _id: -1 } },
                { $skip: page * count },
                { $limit: count },
              ],
              totalCount: [{ $count: 'count' }],
            },
          }
        ]
    );
      if (result) {
        return {
          status: true,
          message: IStoreTypeMessage.foundSuccess,
          data: result[0].item,
          totalCount: result[0].totalCount[0].count,
        };
      } else {
        return {
          status: false,
          message: IStoreTypeMessage.notFound,
          data: null,
          totalCount: null,
        };
      }
    } catch (error) {
       throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async findAllDropDownModule(): Promise<IStoreTypeDropDownRes> {
    try {
      let result = await this.Module.aggregate([{$project: {name: 1} }]);
      if (result) {
        return {
          status: true,
          message: IStoreTypeMessage.foundSuccess,
          data: result,
        };
      } else {
        return {
          status: false,
          message: IStoreTypeMessage.notFound,
          data: null,
        };
      }
    } catch (error) {
       throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async lookUpSubStoreTypeDBFind(): Promise<IStoreTypeDropDownRes> {
    try {
      let result = await this.Module.aggregate([
        {
          $lookup: {
            from: "sub-categories",
            localField: "_id",
            foreignField: "storeTypeId",
            as: "subStoreType"
          },
      },
      {$project: {"name": 1, "image.filePath": 1, "subStoreType._id": 1, "subStoreType.name": 1, "subStoreType.image.filePath": 1}}
    ]);
      if (result) {
        return {
          status: true,
          message: IStoreTypeMessage.foundSuccess,
          data: result,
        };
      } else {
        return {
          status: false,
          message: IStoreTypeMessage.notFound,
          data: null,
        };
      }
    } catch (error) {
       throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
