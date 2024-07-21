import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDataModuleRes, IModuleRes } from '../../common.service';
import {
  CouponListCreateDto,
  CouponListUpdateDto,
  ICouponListfindManyRes,
  ICouponListfindOneByIdRes,
  ICouponListMessage,
} from './coupon-list.dto';
import { CouponList } from './coupon-list.interface';
import * as mongoose from 'mongoose';

@Injectable()
export class CouponListService {
  constructor(
    @InjectModel('CouponList') private readonly Module: Model<CouponList>,
  ) {}

  async createModule(
    couponListReq: CouponListCreateDto,
  ): Promise<IDataModuleRes<CouponList>> {
    try {
      let couponList: CouponList = couponListReq as CouponList;
      const createCouponList = new this.Module(couponList);
      const savedcouponList = await createCouponList.save();
      return {
        status: true,
        message: ICouponListMessage.createdSuccess,
        data: savedcouponList,
      };
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
    documentId: string,
    CouponListDto: CouponListUpdateDto,
  ): Promise<IDataModuleRes<CouponList>> {
    let update = await this.Module.findOneAndUpdate(
      { _id: documentId },
      { $set: CouponListDto },
    );
    return {
      status: true,
      message: ICouponListMessage.updateSuccess,
      data: update,
    };
  }

  async deleteModule(documentId: string): Promise<IModuleRes> {
    await this.Module.update({ _id: documentId }, { $set: { status: false } });
    return { status: true, message: ICouponListMessage.deleteSuccess };
  }

  async findOneModule(documentId: string): Promise<ICouponListfindOneByIdRes> {
    console.log(documentId);
    let result = await this.Module.findOne({
      _id: mongoose.Types.ObjectId(documentId),
    });
    console.log("Result",result);
    if (!result) {
      throw new HttpException(
        ICouponListMessage.notFound,
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: ICouponListMessage.foundSuccess, data: result };
  }

  async findManyModule(
    page: number,
    count: number,
    filter?: string,
    status?: boolean,
    storeCustomId?: string
  ): Promise<ICouponListfindManyRes> {
    try {
      let match = {};
      count = Number(count || 10);
      page = Number(page || 0);
      let totalCount: any = [{ $count: 'count' }];
      let item: any = [
        
      ]
      if (filter && filter != '') {
        let search = {
          $or: [{
            code: { $regex: new RegExp(filter, "i") }
          },
          { title: { $regex: new RegExp(filter, "i") } },
          { description: { $regex: new RegExp(filter, "i") } },
        ]
        };
        match = { ...match, ...search};
      }
      if (status != undefined && status != null && typeof status === "boolean") {
        match = { ...match, ...{status: status}};
      }
      if(match && Object.keys(match).length > 0) {
        item.unshift({$match: match});
        totalCount.unshift({$match: match});
        }
        let lookUp = {
            $lookup: {
              from: 'coupons',
              let: { couponCode: '$code' },
              pipeline: [
                { $match: { $expr: { $eq: ['$coupon.code', '$$couponCode'] }, providerId: storeCustomId } }
              ],
              as: 'myCoupon',
            }
          };
        item.push(lookUp);
        item.push({ $unwind: { path: '$myCoupon', preserveNullAndEmptyArrays: true }})
        item.push({$match:{myCoupon: {$exists: false}}});
        item.push({ $sort: { _id: 1 } },
            { $skip: page * count },
            { $limit: count });
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
            message: ICouponListMessage.foundSuccess,
            data: result,
            totalCount: resultCount
          };
        } else {
          return {
            status: true,
            message: ICouponListMessage.foundSuccess,
            data: [],
            totalCount: 0,
          };
        }
    } catch (error) {
        console.log(error);   
       throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
