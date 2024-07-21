import { Injectable, HttpException, HttpStatus, NotFoundException, MethodNotAllowedException, NotAcceptableException, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IDataModuleRes, IModuleRes } from '../../common.service';
import *  as mongoose from 'mongoose';
import { Order, OrderStatus } from './order.interface';
import { Model } from 'mongoose';
import { CreateOrder, IOrderfindManyRes, IOrderMessage, OrderfindOneByIdRes } from './order.dto';
import { CartService } from '../cart/cart.service';
import { Cart, CartStatus } from '../cart/cart.interface';
import { AddressService } from '../address/address.service';
import { Address } from '../address/address.interface';
import { customerListProjection, storeListProjection } from './order.projection';
import { SmsService } from '../../service/notification/sms/sms.service';
import { UserService } from '../users/user.service';
import { SMS_TEMPLATE_CUSTOMER, SMS_TEMPLATE_STORE } from './order.sms-template';
import { StoreService } from '../store/store.service';
import { FirbaseFcmService } from '../../service/notification/firbase-fcm/firbase-fcm.service';
import { NoticaitonFCM, NotificationReq } from '../../service/notification/firbase-fcm/firebase-fcm.dto';
import { UtilsService } from '../../service/utils/utils.service';
import { CalculatorService } from '../../service/calculator/calculator.service';
import { CouponsService } from '../coupons/coupons.service';
import { ProvidedLevel } from '../coupons/coupons.interface';
const orderid = require('order-id')('key');

@Injectable()
export class OrderService {
  constructor(private cartService: CartService,
    private addressService: AddressService,
    @InjectModel('Orders') private Module: Model<Order>,
    private smsService: SmsService,
    private userService: UserService,
    private storeService: StoreService,
    private firbaseFcmService: FirbaseFcmService,
    private utilsService: UtilsService,
    private calculator: CalculatorService,
    private couponsService: CouponsService
  ) { }

  async createModule(customerId: string, customerName: string, storeCustomId: string, addressId: string, note?: string, code?: string): Promise<IModuleRes> {
    try {
      let customerSelectedAddress = await this.addressService.findOneModule(addressId, customerId);
      let [getCartDetails, storeService] = await Promise.all([
        this.cartService.findManyByCustomerId(customerId, storeCustomId, addressId, true, CartStatus.IN_CART, true, code || null),
        this.storeService.findOneModuleStoreCustomId(storeCustomId)
      ]);
      if (!getCartDetails?.data?.length) {
        throw new HttpException("You dont have anything to order", HttpStatus.NOT_FOUND);
      }
      const storeAvailable = storeService.data.openTimings.find(data => data.day == new Date().getDay() + 1);
      const currentMin = this.utilsService.getInMin(new Date().toLocaleTimeString('en-IN', {hour12: false, timeZone: "Asia/Kolkata"}));
      console.log(currentMin);
      const timingAvail = storeAvailable.timings.find(data => data.startTimeMin <= currentMin && data.endTimeMin >= currentMin);
      if (!storeService?.data?.status || !storeService?.data?.storeOnline || !timingAvail || storeAvailable.isHoliday) {
        throw new HttpException(IOrderMessage.STORE_IS_OFFLINE, HttpStatus.CONFLICT);
      }
      const storeCommisionRate = storeService.data.commissionRate || 0;
      const storeCommission = this.calculator.totalStoreCommision(getCartDetails.totalCartCost, storeCommisionRate, getCartDetails.couponDetails.providerLevel == ProvidedLevel.COMPANY ? 0  : 0); // Need to Add coupon on each level
      let orderDetails: CreateOrder = {
        orderGroupId: orderid.generate(),
        customerId: customerId,
        customerName: customerName,
        storeId: getCartDetails.data[0].storeId,
        storeName: getCartDetails.data[0].storeName,
        storeCustomId: storeCustomId,
        orderList: getCartDetails.data as Cart[],
        totalCartCost: getCartDetails.totalCartCost,
        totalCartQuantity: getCartDetails.totalCartQuantity || 0,
        totalCartDiscount: getCartDetails.totalCartDiscount || 0,
        totalCartOriginalPrice: getCartDetails.totalCartOriginalPrice || 0,
        totalDeliveryCost: getCartDetails.totalDeliveryCost || 0,
        totalCustomerOrderCost: getCartDetails.totalCustomerOrderCost,
        totalStoreCommisionCost: storeCommission.totalStoreCommisionCost || 0,
        totalStoreOrderCost: storeCommission.totalStoreOrderCost || 0,
        storeCommisionRate: storeCommisionRate,
        deliveryDistanceMatrix: getCartDetails.distaceMatrix || null,
        address: customerSelectedAddress.data as Address,
        note: note || null,
        couponDetails: getCartDetails.couponDetails || undefined,
        isthresholdDeliveryKm: getCartDetails.isthresholdDeliveryKm || null,
        deliveryConfig: getCartDetails.deliveryConfig || null,
      };
      if (getCartDetails.data && getCartDetails.data.length) {
        const createOrder = new this.Module(orderDetails);
        const saveOrder = await createOrder.save();
        await this.cartService.updateStatusToConverted(customerId, storeCustomId);
        // Send SMS for Member
        this.notify(OrderStatus.PENDING, orderDetails.orderGroupId, orderDetails.totalCustomerOrderCost, orderDetails.totalStoreOrderCost, orderDetails.customerId, orderDetails.storeId, createOrder.id, true);
        return { status: true, message: IOrderMessage.createdSuccess };

      } else {
        throw new NotFoundException(IOrderMessage.notFound);
      }
    } catch (error) {
      console.log(error);
      if (error.code && error.code == 11000) {
        let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
        let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
        throw new HttpException(DuplicateArrayToString + ' Aleary Exist', HttpStatus.CONFLICT);
      } else {
        throw error;
      }
    }
  }


  async findManyCustomer(customerId: string, page: number, count: number, search: string, fromDate: Date, toDate: Date, orderStatus: string): Promise<IOrderfindManyRes> {
    try {
      let match: any = { customerId: mongoose.Types.ObjectId(customerId) };
      if (orderStatus) {
        match = { ...match, orderStatus: orderStatus }
      }
      if (search) {
        match = { ...match, $text: { $search: search } }
      }
      if (fromDate && toDate) {
        match = { createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) }, ...match }
      }
      return this.findManyAggreationModule(match, customerListProjection, page, count);
    } catch (error) {
      throw error;
    }
  }


  async findMany(storeId: string, page: number, count: number, search: string, fromDate: Date, toDate: Date, orderStatus: string): Promise<IOrderfindManyRes> {
    try {
      let match: any = {};
      if (storeId) {
        match = { ...match,  storeId: mongoose.Types.ObjectId(storeId) };
      }
      if (orderStatus) {
        match = { ...match, orderStatus: orderStatus }
      }
      if (search) {
        match = { $text: { $search: search }, ...match }
      }
      if (fromDate && toDate) {
        match = { createdAt: { $gte: new Date(fromDate), $lte: new Date(toDate) }, ...match }
      }
      return this.findManyAggreationModule(match, storeListProjection, page, count);
    } catch (error) {
      throw error;
    }
  }

  async findMyOrder(userId: string, documentId: string, userType?: string): Promise<OrderfindOneByIdRes> {
    try {
      const result = await this.findOrderDetails(
        {
          $or: [{ storeId: mongoose.Types.ObjectId(userId) }, { customerId: mongoose.Types.ObjectId(userId) }],
          _id: mongoose.Types.ObjectId(documentId)
        },
        userType
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findOrderDetailsStrict(documentId: string): Promise<OrderfindOneByIdRes> {
    try {
      const result = await this.findOrderDetails(
        {
          _id: mongoose.Types.ObjectId(documentId)
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  }


  private async findOrderDetails($match: any, userType?: string) {
    try {
      let aggregate = [{
        $match
      },
      {
        $addFields: {
          totalItem: { $size: "$orderList" }

        }
      },
      {
        $lookup: {
          from: 'stores',
          localField: "storeId",
          foreignField: "_id",
          as: "storeDetails"
        }
      },
      {
        $unwind: "$storeDetails"
      },
      {
        $lookup: {
          from: 'categorys',
          localField: "storeDetails.businessCategoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: "$category"
      },
      {
        $lookup: {
          from: 'users',
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetails"
        }
      },
      {
        $unwind: "$customerDetails"
      },
      {
        $lookup: {
          from: 'users',
          localField: "storeDetails.userId",
          foreignField: "_id",
          as: "storeOwnerDetails"
        }
      },
      {
        $unwind: "$storeOwnerDetails"
      }
      ];
      if (userType === "CUSTOMER") {
        aggregate.push({
          $addFields: {
            "storeOwnerDetails.phoneNo": "08069640061"
  
          }
        } as any);
      }
      let result = await this.Module.aggregate(aggregate);
      return {
        status: true,
        message: IOrderMessage.foundSuccess,
        data: result[0],
      };
    } catch (error) {
      throw error;
    }
  }

  private async findManyAggreationModule($match: any, project: any, page: number, count: number): Promise<IOrderfindManyRes> {
    try {
      count = Number(count || 0);
      page = Number(page || 0);
      let aggregateQuery: any[] = [
        { $match },
        { $sort: { _id: -1 } },
        { $skip: page * count },
        { $limit: count },
        {
          $addFields: {
            totalItem: { $size: "$orderList" }

          }
        },
        {
          $lookup: {
            from: 'stores',
            localField: "storeId",
            foreignField: "_id",
            as: "storeDetails"
          }
        },
        {
          $unwind: "$storeDetails"
        },
        {
          $lookup: {
            from: 'users',
            localField: "customerId",
            foreignField: "_id",
            as: "customerDetails"
          }
        },
        {
          $unwind: "$customerDetails"
        },
        { $project: project }
      ];
      let result = this.Module.aggregate(aggregateQuery);
      let resultCount = this.Module.count($match);
      let data = await Promise.all([result, resultCount]);
      if (data) {
        result = data[0];
        resultCount = data[1];
      }

      if (result.length) {
        return {
          status: true,
          message: IOrderMessage.foundSuccess,
          data: result,
          totalCount: resultCount,
        };
      } else {
        throw new NotFoundException(IOrderMessage.notFound);
      }
    } catch (error) {
      throw error;
    }

  }

  async updateStatus(storeId: string, documentId: string, preOrderStatus: OrderStatus, changeStatus: OrderStatus) {
    try {
      let statusUpdate = await this.Module.update({ storeId: mongoose.Types.ObjectId(storeId), _id: mongoose.Types.ObjectId(documentId), orderStatus: preOrderStatus }, { $set: { orderStatus: changeStatus } });
      if (statusUpdate?.nModified == 0) {
        throw new NotAcceptableException(IOrderMessage.unableToUpdateTheStatus);
      }
      let orderDetail = await this.Module.findOne({ _id: mongoose.Types.ObjectId(documentId) });
      this.notify(changeStatus, orderDetail.orderGroupId, orderDetail.totalCustomerOrderCost, orderDetail.totalStoreOrderCost, orderDetail.customerId, orderDetail.storeId, documentId);
    } catch (error) {
      throw error;
    }
  }


  async updateStatusStrict(documentId: string, changeStatus: OrderStatus) {
    try {
      let statusUpdate = await this.Module.update({ _id: mongoose.Types.ObjectId(documentId)}, { $set: { orderStatus: changeStatus } });
      if (statusUpdate?.nModified == 0) {
        throw new NotAcceptableException(IOrderMessage.unableToUpdateTheStatus);
      }
      let orderDetail = await this.Module.findOne({ _id: mongoose.Types.ObjectId(documentId) });
      this.notify(changeStatus, orderDetail.orderGroupId, orderDetail.totalCustomerOrderCost, orderDetail.totalStoreOrderCost, orderDetail.customerId, orderDetail.storeId, documentId);
    } catch (error) {
      throw error;
    }
  }

  async updateReturn(userId: string, documentId: string, preOrderStatus: OrderStatus, changeStatus: OrderStatus) {
    try {
      const statusUpdate = await this.Module.update({ userId: mongoose.Types.ObjectId(userId), _id: mongoose.Types.ObjectId(documentId), orderStatus: preOrderStatus }, { $set: { orderStatus: changeStatus } });
      if (statusUpdate?.nModified == 0) {
        throw new NotAcceptableException(IOrderMessage.unableToUpdateTheStatus);
      }
      let orderDetail = await this.Module.findOne({ _id: mongoose.Types.ObjectId(documentId) });
      console.log(orderDetail);

      this.notify(changeStatus, orderDetail.orderGroupId, orderDetail.totalCustomerOrderCost, orderDetail.totalStoreOrderCost, orderDetail.customerId, orderDetail.storeId, documentId);
    } catch (error) {
      throw error;
    }
  }



  private async notify(status: OrderStatus, orderNumber: string, totalSellingPrice: number, totalStoreOrderCost: number, customerId: string, storeId: string, orderId: string, sendHardCodeNumber?: boolean) {
    try {
      let customerTemplate;
      let storeTemplate;
      let getStoreDetail = await this.storeService.findOneModule(storeId);
      let messageDetails = {
        orderNumber: orderNumber,
        totalSellingPrice: totalSellingPrice,
        storeName: getStoreDetail.data?.businessName
      }
      customerTemplate = SMS_TEMPLATE_CUSTOMER[status] || null;
      if (customerTemplate) {
        let getCustomerDetail = await this.userService.findUserById(customerId);
        let customerNumber = `91${getCustomerDetail.data.phoneNo}`;

        // Send SMS
        this.smsService.sendSmSByOrderStatus(customerNumber, customerTemplate, messageDetails);

        // Send Notification
        const fcmToken: string[] = getCustomerDetail.data?.fcmToken?.map(data => data.token);
        if (fcmToken?.length) {
          const notify: NotificationReq = {
            registration_ids: fcmToken,
            bodyTemplate: customerTemplate,
            tempateData: messageDetails,
            data: {
              isOrder: status == OrderStatus.PENDING,
              router: `/order-detail/${orderId}`
            }
          }
          this.firbaseFcmService.fcmNotification(notify);
        }
      }

      storeTemplate = SMS_TEMPLATE_STORE[status] || null;
      if (storeTemplate) {
        let storeuser = await this.userService.findUserById(getStoreDetail.data.userId);
        let storeNumber = `91${storeuser.data.phoneNo}`;
        if (sendHardCodeNumber)
          storeNumber = `${storeNumber}, 919035891372, 918073185551, 918971698263`
          messageDetails.totalSellingPrice = totalStoreOrderCost;
        //Send SMS
        this.smsService.sendSmSByOrderStatus(storeNumber, storeTemplate, messageDetails);

        // Send Notification 

        const fcmToken: string[] = storeuser.data?.fcmToken?.map(data => data.token);
        if (fcmToken?.length) {
          const notify: NotificationReq = {
            registration_ids: fcmToken,
            bodyTemplate: storeTemplate,
            tempateData: messageDetails,
            data: {
              isOrder: true,
              router: `/order-info/${orderId}`,
              orderNumber: orderNumber
            }
          }
          this.firbaseFcmService.fcmNotification(notify, status == OrderStatus.PENDING);
        }
      }
    } catch (error) {
      console.log("INSIDE=========", error);
    }
  }





}
