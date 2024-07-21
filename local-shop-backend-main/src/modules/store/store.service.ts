import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Store } from './store.interface';
import {
  StoreDto,
  IStoreMessage,
  StoreUpdateDto,
  StorefindOneByIdRes,
  StorefindManyByIdRes,
  storeOnlineStatusDto,
  StorefindManyRes,
} from './store.dto';
import { IModuleRes } from '../../common.service';
import { CategoryService } from '../category/category.service';
import { ICategoryDropDownRes } from '../category/category.dto';
import * as mongoose from 'mongoose';
import { UtilsService } from '../../service/utils/utils.service';

@Injectable()
export class StoreService {
  constructor(@InjectModel('Stores') private readonly Module: Model<Store>, private categoryService: CategoryService, private utilsService: UtilsService) { }

  async createModule(StoreDto: StoreDto): Promise<IModuleRes> {
    try {
      const createUser = new this.Module(StoreDto);
      await createUser.save();
      return { status: true, message: IStoreMessage.createdSuccess };
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

  async updateModule(
    storeId: string,
    StoreDto: StoreUpdateDto,
  ): Promise<IModuleRes> {
    try {
      let result = await this.Module.update(
        { _id: storeId },
        { $set: StoreDto },
      );
      return { status: true, message: IStoreMessage.updateSuccess };
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

  async deleteModule(storeId: string): Promise<IModuleRes> {
    try {
      await this.Module.deleteOne({ _id: storeId });
      return { status: true, message: IStoreMessage.deleteSuccess };
    } catch (error) {
      throw error;
    }
  }

  async findOneModule(storeId: string): Promise<StorefindOneByIdRes> {
    try {
      let result = await this.Module.findOne({ _id: storeId });
      if (result) {
        return {
          status: true,
          message: IStoreMessage.foundSuccess,
          data: result,
        };
      } else {
        return { status: false, message: IStoreMessage.notFound, data: null };
      }
    } catch (error) {
      throw error;
    }
  }

  async findOneModuleStoreCustomId(storeCustomId: string): Promise<StorefindOneByIdRes> {
    try {
      let result = await this.Module.findOne({ storeCustomId: storeCustomId });
      if (result) {
        return {
          status: true,
          message: IStoreMessage.foundSuccess,
          data: result,
        };
      } else {
        throw new HttpException(IStoreMessage.notFound, HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
  }

  async findAllStore(page: number, count: number, businessCategoryId?: string, place?: string,
    search?: string, storeOnline?: boolean, status?: boolean): Promise<StorefindManyRes> {
    try {
      let match = {};
      count = Number(count || 10);
      page = Number(page || 0);
      let item: any = [
        { $sort: { _id: 1 } },
        { $skip: page * count },
        { $limit: count },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        { $unwind: '$userDetails' },
        {
          $project: {
            businessName: 1,
            status: 1,
            storeOnline: 1,
            phoneNumber: '$userDetails.phoneNo'
          },
        }];
      if (businessCategoryId) {
        match['businessCategoryId'] = mongoose.Types.ObjectId(businessCategoryId);
      }
      if (storeOnline) {
        match['storeOnline'] = Boolean(storeOnline);
      }
      if (status) {
        match['status'] = Boolean(status);
      }

      if (match) {
        item.unshift({ $match: match });
      }
      if (search && search != '') {
        match['businessName'] = { $regex: new RegExp(search, 'i') };
      }
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
          message: IStoreMessage.foundSuccess,
          data: result,
          totalCount: resultCount,
        };
      }
      else {
        return {
          status: true,
          message: IStoreMessage.notFound,
          data: [],
          totalCount: 0,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async findAllStoreByLocation(
    page: number,
    count: number,
    businessCategoryId: string,
    place?: string,
    state?: string,
    lat?: number,
    long?: number,
    filter?: string,
    status?: boolean,
  ): Promise<StorefindManyByIdRes> {
    try {
      count = Number(count || 10);
      page = Number(page || 0);
      let aggregate: any[] = [];
      let match: any = {};
      let geoLocation: any;
      if (lat && long) {
        geoLocation = {
          near: { type: 'Point', coordinates: [Number(lat), Number(long)] },
          spherical: true,
          distanceField: 'calcDistance',
        };
      }

      if (place) {
        match['place'] = place;
      }
      if (state) {
        match['state'] = state;
      }
      if (status) {
        match['status'] = status;
      }
      if (businessCategoryId) {
        match['businessCategoryId'] = mongoose.Types.ObjectId(
          businessCategoryId,
        );
      }
      if (filter && filter != '') {
        match['businessName'] = { $regex: new RegExp(filter, 'i') };
      }

      if (match) aggregate.push({ $match: match });
      /// Filter Avilable or Not

      const currentMin = this.utilsService.getInMin(new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: "Asia/Kolkata" }));
      console.log(currentMin, new Date().getDay() + 1);

      // Add 1
      aggregate.push({
        $addFields: {
          getDay: {
            $filter: {
              input: '$openTimings',
              as: 'today',
              cond: {
                $and: [{ $eq: ['$$today.day', new Date().getDay() + 1] }, { $ne: ['$$today.isHoliday', true] }],
              },
            },
          },
        },
      });

      aggregate.push({
        $addFields: {
          timingsFilter: {
            $filter: {
              input: { $arrayElemAt: ['$getDay.timings', 0] },
              as: 'today',
              cond: {
                $and: [
                  { $lte: ['$$today.startTimeMin', currentMin] },
                  { $gte: ['$$today.endTimeMin', currentMin] },
                ],
              },
            },
          },
        },
      });

      aggregate.push({
        $addFields: {
          isAvailable: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $isArray: '$timingsFilter' }, true] },
                  { $gte: [{ $size: '$timingsFilter' }, 1] },
                  { $eq: ['$storeOnline', true] },
                ],
              },
              true,
              false,
            ],
          },
        },
      });

      if (geoLocation) {
        aggregate.unshift({ $geoNear: geoLocation });
        aggregate.push({ $sort: {  isAvailable: -1, calcDistance: 1, _id: 1 } });
      } else {
        aggregate.push({ $sort: { isAvailable: -1, _id: 1 } });
      }

      aggregate.push({ $skip: page * count });
      aggregate.push({ $limit: count });
      aggregate.push({
        $project: {
          businessName: 1,
          storeImage: 1,
          storeCustomId: 1,
          location: 1,
          calcDistance: 1,
          storeType: 1,
          isAvailable: 1
        },
      });
      console.log(aggregate);

      if (aggregate.length) {
        let result = this.Module.aggregate(aggregate);
        let resultCount = this.Module.count(match);
        let data = await Promise.all([result, resultCount]);
        if (data) {
          result = data[0];
          resultCount = data[1];
        }
        if (result) {
          return {
            status: true,
            message: IStoreMessage.foundSuccess,
            data: result,
            totalCount: resultCount,
          };
        }
      }
      throw new HttpException('Coming Soon !!!!!!!!', HttpStatus.NOT_FOUND);
    } catch (error) {
      throw error;
    }
  }

  async getStoreInformation(
    storeCustomId: string,
    lat?: number,
    long?: number,
  ): Promise<StorefindOneByIdRes> {
    try {
      console.log(lat, long)
      const currentMin = this.utilsService.getInMin(new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: "Asia/Kolkata" }));
      console.log(currentMin);
      let aggregate: any[] = [
        {
          $match: {
            storeCustomId: storeCustomId,
          },
        },
        {
          $addFields: {
            getDay: {
              $filter: {
                input: '$openTimings',
                as: 'today',
                cond: {
                  $and: [{ $eq: ['$$today.day', new Date().getDay() + 1] }, { $ne: ['$$today.isHoliday', true] }],
                },
              },
            },
          },
        },
        {
          $addFields: {
            timingsFilter: {
              $filter: {
                input: { $arrayElemAt: ['$getDay.timings', 0] },
                as: 'today',
                cond: {
                  $and: [
                    { $lte: ['$$today.startTimeMin', currentMin] },
                    { $gte: ['$$today.endTimeMin', currentMin] },
                  ],
                },
              },
            },
          },
        },
        {
          $addFields: {
            isAvailable: {
              $cond: [
                {
                  $and: [
                    { $eq: [{ $isArray: '$timingsFilter' }, true] },
                    { $gte: [{ $size: '$timingsFilter' }, 1] },
                    { $eq: ['$storeOnline', true] },
                  ],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $project: {
            businessName: 1,
            image: 1,
            location: 1,
            status: 1,
            storeOnline: 1,
            storeImage: 1,
            logo: 1,
            acceptDelivery: 1,
            calcDistance: 1,
            storeType: 1,
            isAvailable: 1
          },
        },
      ];
      if (lat && long) {
        aggregate.unshift(
          {
            $geoNear: {
              near: { type: 'Point', coordinates: [Number(lat), Number(long)] },
              spherical: true,
              distanceField: 'calcDistance',
            }
          },
        )
      }
      let result = await this.Module.aggregate(aggregate);
      if (result && result.length) {
        return {
          status: true,
          message: IStoreMessage.foundSuccess,
          data: result[0],
        };
      } else {
        return { status: false, message: IStoreMessage.notFound, data: null };
      }
    } catch (error) {
      throw error;
    }
  }

  // need to complete
  //  async findByGeoModule(possition: Array<any>): Promise<any> {

  //  }
  async getStoreCategoryList(storeId): Promise<ICategoryDropDownRes> {
    try {
      let result = await this.Module.findOne({ _id: storeId });
      if (result) {
        let Categorys = await this.categoryService.findCategoryByIds(result.businessCategoryId);
        return Categorys;
      } else {
        throw new NotFoundException(IStoreMessage.notFound);
      }
    } catch (error) {
      throw error;

    }
  }

  //both this and the below function to be merged later
  async storeOnlineOfflineToggle(
    storeId: string,
    storeOnlineStatus: storeOnlineStatusDto,
  ): Promise<IModuleRes> {
    try {
      let result = await this.Module.updateOne(
        { _id: mongoose.Types.ObjectId(storeId) },
        { $set: { storeOnline: storeOnlineStatus.storeOnline } },
      );
      return { status: true, message: IStoreMessage.updateSuccess };
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

  // async storeOnlineOfflineToggleAdmin(
  //   storeId: string,
  //   storeOnlineStatus: storeOnlineStatusDto,
  // ): Promise<IModuleRes> {
  //   try {
  //     let result = await this.Module.updateOne(
  //       { _id: mongoose.Types.ObjectId(storeId)},
  //       { $set: {storeOnline: storeOnlineStatus.storeOnline} },
  //     );

  // console.log(result)


  //     return { status: true, message: IStoreMessage.updateSuccess };
  //   } catch (error) {
  //     throw error;
  //     }
  //   }


}
