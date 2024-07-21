import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDataModuleRes, IModuleRes } from '../../common.service';
import {
  CouponsCreateDto,
  CouponsUpdateDto,
  CouponType,
  CouponUsage,
  ICouponsDropDownRes,
  ICouponsfindManyRes,
  ICouponsfindOneByIdRes,
  ICouponsMessage,
  ProviderCouponsCreateDto,
  ValidateCouponsRes,
} from './coupons.dto';
import { Coupons, ProvidedLevel, ValidateCouponRequest } from './coupons.interface';
import * as mongoose from 'mongoose';
import { CouponListService } from '../coupon-list/coupon-list.service';

@Injectable()
export class CouponsService {
  constructor(
    @InjectModel('Coupons') private readonly Module: Model<Coupons>,
    private couponListService: CouponListService
  ) {}

  async createModule(couponsReq: CouponsCreateDto,
  ): Promise<IDataModuleRes<Coupons>> {
    try {
      let coupons: Coupons = couponsReq as Coupons;
      const createCoupons = new this.Module(coupons);
      const savedcoupons = await createCoupons.save();
      return {
        status: true,
        message: ICouponsMessage.createdSuccess,
        data: savedcoupons,
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

  async createProviderCouponModule(couponListId: string, providerId: string, couponsReq: ProviderCouponsCreateDto,
): Promise<IDataModuleRes<Coupons>> {
      try {
        const getCouponList = await this.couponListService.findOneModule(couponListId);
        let coupons: Coupons = {
            providerLevel: ProvidedLevel.STORE,
            providerId: providerId,
            // applicableId: couponsReq?.applicableId,
            city: getCouponList.data.city,
            coupon: {
                code: getCouponList.data.code,
                type: getCouponList.data.type,
                title: getCouponList.data.title,
                description: getCouponList.data.description,
                couponConfig: getCouponList.data.couponConfig,
                couponUsage: getCouponList.data.couponUsage,
                totalNoOfCoupons: getCouponList.data?.totalNoOfCoupons,
                totolNoOfCouponsPerPerson: getCouponList.data?.totolNoOfCouponsPerPerson,
                startDate: couponsReq?.startDate,
                expiryDate: couponsReq?.expiryDate
            }
        } as Coupons;
        const createCoupons = new this.Module(coupons);
        const savedcoupons = await createCoupons.save();
        return {
          status: true,
          message: ICouponsMessage.createdSuccess,
          data: savedcoupons,
        };
      } catch (error) {
        console.log(error);
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
    CouponsDto: CouponsUpdateDto,
  ): Promise<IDataModuleRes<Coupons>> {
    let update = await this.Module.findOneAndUpdate(
      { _id: documentId },
      { $set: CouponsDto },
    );
    return {
      status: true,
      message: ICouponsMessage.updateSuccess,
      data: update,
    };
  }

  async deleteModule(documentId: string): Promise<IModuleRes> {
    await this.Module.update({ _id: documentId }, { $set: { status: false } });
    return { status: true, message: ICouponsMessage.deleteSuccess };
  }

  async findOneModule(documentId: string): Promise<ICouponsfindOneByIdRes> {
    let result = await this.Module.findOne({
      _id: mongoose.Types.ObjectId(documentId),
    });
    console.log(result);
    if (!result) {
      throw new HttpException(ICouponsMessage.notFound, HttpStatus.NOT_FOUND);
    }
    return { message: ICouponsMessage.foundSuccess, data: result };
  }

  async findManyModule(
    page: number,
    count: number,
    storeCustomId: string,
    filter?: string,
    status?: boolean,
  ): Promise<ICouponsfindManyRes> {
    try {
      let match = {providerId: storeCustomId};
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
            message: ICouponsMessage.foundSuccess,
            data: result,
            totalCount: resultCount
          };
        } else {
          return {
            status: true,
            message: ICouponsMessage.foundSuccess,
            data: [],
            totalCount: 0,
          };
        }
    } catch (error) {
        console.log(error);   
       throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneByCouponCode(code: string, providerId: string): Promise<ICouponsfindOneByIdRes> {
    let result = await this.Module.findOne({"coupon.code": code, providerId});
    if (!result) {
      throw new HttpException(ICouponsMessage.notFound, HttpStatus.NOT_FOUND);
    }
    return { message: ICouponsMessage.foundSuccess, data: result };
  }

public async validateCoupon(couponCode: string, totalOrderAmount: number, validateCouponRequest: ValidateCouponRequest): Promise<ValidateCouponsRes> {
    try {
     const getCoupon  = await this.findOneByCouponCode(couponCode, validateCouponRequest?.providerId);
     if (!getCoupon) {
      return { validate: false, error: "Coupon code not found"}
     }
     switch (getCoupon.data?.providerLevel) {
       case ProvidedLevel.STORE:
       case ProvidedLevel.COMPANY_STORE:
        if (getCoupon.data?.providerId != validateCouponRequest?.providerId) {
          return { validate: false, error: "Coupon code is not valid for this store"};
        }
         break;
       case ProvidedLevel.COMPANY:
         break;
       case ProvidedLevel.COMPANY_CUSTOMER:
        if (getCoupon.data?.applicableId != validateCouponRequest?.applicableId) {
          return { validate: false, error: "Your not authorized to use this coupon code"};
        }
         break;
       case ProvidedLevel.STORE_CUSTOMER:
        if (getCoupon.data?.providerId!= validateCouponRequest?.providerId) {
          return { validate: false, error: "Coupon code is not valid for this store"};
        }
        if (getCoupon.data?.applicableId!= validateCouponRequest?.applicableId) {
          return { validate: false, error: "Your not authorized to use this coupon code"};
        }
         break;
       default:
         break;
     }
     if (getCoupon.data.coupon.expiryDate < new Date()) {  
      return { validate: false, error: "Coupon code is expired"};
     }
     if (totalOrderAmount < getCoupon. data.coupon?.couponConfig?.minOrderAmount) {
        return { validate: false, error: `To Apply coupon you minimum order amount should be Rs. ${getCoupon.data.coupon?.couponConfig?.minOrderAmount}`};
     }
     if (getCoupon.data?.coupon?.couponUsage === CouponUsage.RESTRICTED) {
        if (getCoupon.data?.coupon?.totalNoOfCoupons >= getCoupon.data?.coupon?.totalNumberOfCouponUsed) {
            return { validate: false, error: `Discount Campain Completed, Thank you for using Shopolite`};
        }
        // if (getCoupon.data?.coupon?.totolNoOfCouponsPerPerson >= validateCouponRequest?.totalNumberCouponAppliedByUser) {
        //     return { validate: false, error: `Maximum number of coupon applied`};
        // }
     }
     // Calculation
     let totalDiscountAmount = 0;
     switch (getCoupon.data.coupon.type) {
        case CouponType.PERCENTAGE:
            const discount = totalOrderAmount - (totalOrderAmount - (totalOrderAmount * getCoupon.  data.coupon.couponConfig.discountValue / 100));
            totalDiscountAmount = discount > getCoupon.data.coupon?.couponConfig?.maxDiscountAmount ? getCoupon.data.coupon?.couponConfig?.maxDiscountAmount : discount;
            break;
        case CouponType.FLAT:
            totalDiscountAmount = getCoupon.data.coupon.couponConfig.discountValue;
            break;
        default:
            throw new Error("Something went wrong");
     }
     return { 
        validate: true, 
        couponId: getCoupon.data._id,
        couponConfig: getCoupon.data.coupon.couponConfig, 
        discountAmount: totalDiscountAmount, 
        totalOrderAmount: totalOrderAmount,
        title: getCoupon.data.coupon.title,
        description: getCoupon.data.coupon.description,
        startDate: getCoupon.data.coupon.startDate,
        exiptyDate: getCoupon.data.coupon.expiryDate,
        type: getCoupon.data.coupon.type,
        couponUsage: getCoupon.data.coupon.couponUsage,
        providerLevel: getCoupon.data.providerLevel,
        code:  getCoupon.data.coupon.code
    };
    } catch (error) {
       return { validate: false, error: "Coupon Not Found" }
    }
  }



  async activeCouponListCustomer(
    storeCustomId: string,
  ): Promise<ICouponsDropDownRes> {
    try {
      let match = {providerId: storeCustomId, status: true};
      let project = {
        code: '$coupon.code',
        type: '$coupon.type',
        title: '$coupon.title',
        description: '$coupon.description',
        sortTitle: {
          $cond: [
            { $eq: ['$coupon.type', 'PERCENTAGE'] },
            { $concat: [ {$toString :'$coupon.couponConfig.discountValue'}, " % Off"] },
            { $concat: ["Flat ₹ ", {$toString : '$coupon.couponConfig.discountValue'}, "Off"] },
          ],
        },
        sortDesc: {
            $cond: [
              { $eq: ['$coupon.type', 'PERCENTAGE'] },
              { $concat: [ "UpTo ₹ ", {$toString : '$coupon.couponConfig.maxDiscountAmount'}] },
              { $concat: ["Min Order ₹ ", {$toString : '$coupon.couponConfig.minOrderAmount'}] },
            ],
          },
      };
        let result = await this.Module.aggregate([{$match: match}, {$project: project}]);
        if (result?.length) {
          return {
            status: true,
            message: ICouponsMessage.foundSuccess,
            data: result,
          };
        } else {
          return {
            status: true,
            message: ICouponsMessage.foundSuccess,
            data: [],
          };
        }
    } catch (error) {
        console.log(error);   
       throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
