import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IDataModuleRes, IModuleRes } from '../../common.service';
import { Cart, CartStatus } from './cart.interface';
import { StoreProductCatalogService } from '../store-product-catalog/store-product-catalog.service';
import { CartfindManyByIdRes, CartfindOneByIdRes, CartTotalAmount, CreateReqDto, ICartMessage, MyCartReq, TotalCartCost, UpdateCartDto } from './cart.dto';
import *  as mongoose from 'mongoose';
import { CalculatorService } from '../../service/calculator/calculator.service';
import { AddressService } from '../address/address.service';
import { StoreService } from '../store/store.service';
import { IDurationCalculation } from '../../service/calculator/calculator.dto';
import { CouponsService } from '../coupons/coupons.service';
import { ValidateCouponRequest } from '../coupons/coupons.interface';
import { ValidateCouponsRes } from '../coupons/coupons.dto';
@Injectable()
export class CartService {
  constructor(
    private productCatalogService: StoreProductCatalogService,
    private calculator: CalculatorService,
    private addressService: AddressService,
    private storeService: StoreService,
    private couponsService: CouponsService,
    @InjectModel('Cart') private Module: Model<Cart>,
  ) {}

  async createModule(
    customerId: string,
    customerName: string,
    cartReq: CreateReqDto,
  ): Promise<IDataModuleRes<MyCartReq>> {
    try {
      let productCatalogDetails = await this.productCatalogService.findOneByStoreAndProdIdModule(
        cartReq.storeCustomId,
        cartReq.productId,
      );
      console.log(productCatalogDetails.data);
      const qty = Number(cartReq.quantity) || 1;
      const totalSellingPrice = productCatalogDetails.data.sellingPrice * qty;
      const totalOriginalPrice = productCatalogDetails.data.originalPrice * qty;
      const totalDiscount = totalOriginalPrice - totalSellingPrice;
      let Cart: Cart = {
        customerId: customerId,
        cartStatus: CartStatus.IN_CART,
        //  customerName: customerName,
        quantity: qty,
        storeId: productCatalogDetails.data.storeId,
        storeName: productCatalogDetails.data.storeName,
        categoryId: productCatalogDetails.data.categoryId,
        categoryName: productCatalogDetails.data.categoryName,
        subCategoryId: productCatalogDetails.data.subCategoryId,
        subCategoryName: productCatalogDetails.data.subCategoryName,
        productId: productCatalogDetails.data.productId,
        productName: productCatalogDetails.data.productName,
        storeProductId: productCatalogDetails.data._id,
        brandName: productCatalogDetails.data.brandName,
        sku: productCatalogDetails.data.sku,
        description: productCatalogDetails.data.description || null,
        status: productCatalogDetails.status,
        spec: productCatalogDetails.data.spec || null,
        image: productCatalogDetails.data.image || null,
        unitValue: productCatalogDetails.data.unitValue,
        unit: productCatalogDetails.data.unit,
        offerUnit: productCatalogDetails.data.offerUnit || null,
        originalPrice: productCatalogDetails.data.originalPrice,
        discount: productCatalogDetails.data.discount,
        sellingPrice: productCatalogDetails.data.sellingPrice,
        barcode: productCatalogDetails.data.barcode,
        keyWord: productCatalogDetails.data.keyWord,
        totalOriginalPrice: totalOriginalPrice,
        totalDiscount: totalDiscount,
        totalSellingPrice: totalSellingPrice,
        storeCustomId: cartReq.storeCustomId,
      };
      const createCart = new this.Module(Cart);
      let saveData = await createCart.save();
      const originalPrice = await this.getCartCalculations(
        customerId,
        cartReq.storeCustomId,
        null,
        false,
        null
      );
      let data: MyCartReq = {
        myCart: {
          totalOriginalPrice: totalOriginalPrice,
          totalDiscount: totalDiscount,
          totalSellingPrice: totalSellingPrice,
          quantity: Cart.quantity,
          sellingPrice: Cart.sellingPrice,
          unit: Cart.unit,
          unitValue: Cart.unitValue,
          _id: saveData._id,
        },
        totalCartCost: originalPrice.totalCartCost,
        totalCartOriginalPrice: originalPrice.totalCartOriginalPrice,
        totalCartDiscount: originalPrice.totalCartDiscount,
        totalCartQuantity: originalPrice.totalCartQuantity,
        totalCustomerOrderCost: originalPrice.totalCustomerOrderCost,
        totalDeliveryCost: originalPrice.totalDeliveryCost,
        couponDetails: originalPrice.couponDetails,
        isthresholdDeliveryKm: originalPrice?.isthresholdDeliveryKm,
        thresholdDeliveryKm:  originalPrice?.deliveryConfig?.thresholdDeliveryKm,
        deliveryConfig: null
      };
      return { status: true, message: ICartMessage.createdSuccess, data: data };
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

  async updateQuantityModule(
    customerId: string,
    addressId: string,
    CartDto: UpdateCartDto,
    couponCode: string
  ): Promise<IDataModuleRes<MyCartReq>> {
    try {
      let search: any = {
        customerId: mongoose.Types.ObjectId(customerId),
        storeProductId: mongoose.Types.ObjectId(CartDto.productId),
        storeCustomId: CartDto.storeCustomId,
        cartStatus: CartStatus.IN_CART,
      };
      if (CartDto.quantity && CartDto.quantity > 0) {
        let productCatalogDetails = await this.productCatalogService.findOneByStoreAndProdIdModule(
          CartDto.storeCustomId,
          CartDto.productId,
        );
        const qty = Number(CartDto.quantity) || 1;
        const totalSellingPrice = productCatalogDetails.data.sellingPrice * qty;
        const totalOriginalPrice =
          productCatalogDetails.data.originalPrice * qty;
        const totalDiscount = totalOriginalPrice - totalSellingPrice;
        const updateObj = {
          quantity: qty,
          sellingPrice: productCatalogDetails.data.sellingPrice,
          unit: productCatalogDetails.data.unit,
          totalSellingPrice: totalSellingPrice,
          totalDiscount: totalDiscount,
          totalOriginalPrice: totalOriginalPrice,
        };
        console.log(customerId, CartDto.productId, CartDto.storeCustomId);
        let result = await this.Module.findOneAndUpdate(
          search,
          { $set: updateObj },
          { returnOriginal: false },
        );
        const originalPrice = await this.getCartCalculations(
          customerId,
          CartDto.storeCustomId,
          addressId,
          false,
          couponCode
        );
        let data: MyCartReq = {
          myCart: {
            totalSellingPrice: updateObj.totalSellingPrice,
            totalDiscount: updateObj.totalDiscount,
            totalOriginalPrice: updateObj.totalOriginalPrice,
            quantity: updateObj.quantity,
            sellingPrice: updateObj.sellingPrice,
            unit: updateObj.unit,
            unitValue: result.unitValue,
            _id: result._id,
          },
          totalCartCost: originalPrice.totalCartCost,
          totalCartOriginalPrice: originalPrice.totalCartOriginalPrice,
          totalCartDiscount: originalPrice.totalCartDiscount,
          totalCartQuantity: originalPrice.totalCartQuantity,
          totalCustomerOrderCost: originalPrice.totalCustomerOrderCost,
          totalDeliveryCost: originalPrice.totalDeliveryCost,
          couponDetails: originalPrice.couponDetails,
          isthresholdDeliveryKm: originalPrice?.isthresholdDeliveryKm,
          thresholdDeliveryKm:  originalPrice?.deliveryConfig?.thresholdDeliveryKm,
          deliveryConfig: null
        };
        return {
          status: true,
          message: ICartMessage.updateSuccess,
          data: data,
        };
      } else {
        let onceDeleted = await this.Module.deleteOne(search);
        console.log(onceDeleted);
        const costAfterDelete = await this.getCartCalculations(
          customerId,
          CartDto.storeCustomId,
          addressId,
          false,
          couponCode
        );
        return {
          status: true,
          message: ICartMessage.updateSuccess,
          data: {
            myCart: null,
            totalCartCost: costAfterDelete.totalCartCost,
            totalCartQuantity: costAfterDelete.totalCartQuantity,
            totalCartDiscount: costAfterDelete.totalCartDiscount,
            totalCartOriginalPrice: costAfterDelete.totalCartOriginalPrice,
            totalDeliveryCost: costAfterDelete.totalDeliveryCost,
            totalCustomerOrderCost: costAfterDelete.totalCustomerOrderCost,
            couponDetails: costAfterDelete.couponDetails,
            isthresholdDeliveryKm: costAfterDelete?.isthresholdDeliveryKm,
            thresholdDeliveryKm:  costAfterDelete?.deliveryConfig?.thresholdDeliveryKm,
            deliveryConfig: null  
          },
        };
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

  async getTotalAmount(
    customerId: string,
    storeCustomId: string,
  ): Promise<IDataModuleRes<TotalCartCost>> {
    try {
      let result = await this.Module.aggregate([
        {
          $match: {
            customerId: mongoose.Types.ObjectId(customerId),
            storeCustomId: storeCustomId,
            cartStatus: CartStatus.IN_CART,
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$totalSellingPrice' },
            totalCartQuantity: { $sum: '$quantity' },
            totalCartOriginalPrice: { $sum: '$totalOriginalPrice' },
            totalCartDiscount: { $sum: '$totalDiscount' },
          },
        },
      ]);
      if (result. length) {
        return {
          status: true,
          message: ICartMessage.updateSuccess,
          data: {
            totalCartCost: result[0].totalAmount || 0,
            totalCartQuantity: result[0].totalCartQuantity || 0,
            totalCartOriginalPrice: result[0].totalCartOriginalPrice,
            totalCartDiscount: result[0].totalCartDiscount,
          },
        };
      } else {
        return {
          status: false,
          message: ICartMessage.updateSuccess,
          data: {
            totalCartCost: 0,
            totalCartQuantity: 0,
            totalCartOriginalPrice: 0,
            totalCartDiscount: 0,
          },
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteModule(_id: string): Promise<IModuleRes> {
    try {
      await this.Module.deleteOne({ _id: _id });
      return { status: true, message: ICartMessage.deleteSuccess };
    } catch (error) {
      throw error;
    }
  }

  async updateStatusToConverted(
    customerId: string,
    storeCustomId: string,
  ): Promise<IModuleRes> {
    try {
      await this.Module.deleteMany(
        {
          customerId: mongoose.Types.ObjectId(customerId),
          storeCustomId: storeCustomId,
        },
        { $set: { cartStatus: CartStatus.CONVERTED } },
      );
      return { status: true, message: ICartMessage.updateSuccess };
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(_id: string): Promise<IModuleRes> {
    try {
      await this.Module.deleteOne({ _id: _id });
      return { status: true, message: ICartMessage.deleteSuccess };
    } catch (error) {
      throw error;
    }
  }

  async findOneModule(_id: string): Promise<CartfindOneByIdRes> {
    try {
      let result = await this.Module.findOne({ _id: _id });
      if (result) {
        return {
          status: true,
          message: ICartMessage.foundSuccess,
          data: result,
        };
      } else {
      }
    } catch (error) {
      throw error;
    }
  }

  async findManyByCustomerId(
    customerId: string,
    storeCustomId: string,
    addressId: string,
    isInternal: boolean,
    cartStatus: CartStatus,
    projectAllDeliveyFields?: boolean,
    couponCode?: string,
  ): Promise<CartfindManyByIdRes> {
    try {
      const match = {
        customerId: mongoose.Types.ObjectId(customerId),
        storeCustomId: storeCustomId,
        cartStatus: CartStatus.IN_CART,
      };
      let result = this.Module.aggregate([{ $match: match }]);
      let resultCount: any = this.getCartCalculations(
        customerId,
        storeCustomId,
        addressId,
        projectAllDeliveyFields,
        couponCode,
      );
      let data = await Promise.all([result, resultCount]);
      if (data) {
        result = data[0];
        resultCount = data[1];
      }
      if (result.length) {
        
        return {
          status: true,
          message: ICartMessage.foundSuccess,
          data: result,
          totalCartCost: resultCount.totalCartCost,
          totalCustomerOrderCost: resultCount.totalCustomerOrderCost,
          totalCartQuantity: resultCount.totalCartQuantity || 0,
          totalCartDiscount: resultCount.totalCartDiscount || 0,
          totalCartOriginalPrice: resultCount.totalCartOriginalPrice || 0,
          totalDeliveryCost: resultCount.totalDeliveryCost || 0,
          distaceMatrix: resultCount.distaceMatrix,
          couponDetails: resultCount.couponDetails || 0,
          deliveryConfig: isInternal ? resultCount.deliveryConfig || null : null,
          isthresholdDeliveryKm: resultCount?.isthresholdDeliveryKm,
          thresholdDeliveryKm:  resultCount?.deliveryConfig?.thresholdDeliveryKm,
        };
      } else {
        return {
          status: true,
          message: ICartMessage.foundSuccess,
          data: [],
          totalCartCost: 0,
          totalCartQuantity: 0,
          totalCartDiscount: 0,
          totalCartOriginalPrice: 0,
          totalDeliveryCost: 0,
          totalCustomerOrderCost: 0,
          couponDetails: null,
          deliveryConfig: null,
          isthresholdDeliveryKm: false,
          thresholdDeliveryKm:  0,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  private async getCartCalculations(
    customerId: string,
    storeCustomId: string,
    addressId: string,
    projectAllDeliveyFields: boolean,
    couponCode: string,
  ): Promise<CartTotalAmount> {
    try {
      let resultCount: any = await this.getTotalAmount(
        customerId,
        storeCustomId,
      );
      let totalDeliveryCost: number = 0;
      let deliveryCharge: IDurationCalculation;
      if (addressId) {
        deliveryCharge = await this.getdeliveryOfCustomer(
          customerId,
          storeCustomId,
          addressId,
        );
        totalDeliveryCost = deliveryCharge.deliveryCharge;
      }
      if (resultCount) {
        // Lets work Total Number of Coupon by customer Should Need to work on with
        let couponDetails: ValidateCouponsRes;
        if (couponCode) {
          const validateCouponRequest: ValidateCouponRequest = {
            providerId: storeCustomId,
            applicableId: customerId,
            totalNumberCouponAppliedByUser: 0
          };
          couponDetails = await this.couponsService.validateCoupon(couponCode, resultCount.data.totalCartCost, validateCouponRequest);
        }
        return {
          totalCartCost: resultCount.data.totalCartCost,
          totalCustomerOrderCost: this.calculator.totalCustomerCartCost(
            resultCount.data.totalCartCost,
            totalDeliveryCost || 0,
            couponDetails?.validate ? couponDetails.discountAmount : 0,
          ),
          totalCartQuantity: resultCount.data.totalCartQuantity || 0,
          totalCartDiscount: resultCount.data.totalCartDiscount || 0,
          totalCartOriginalPrice: resultCount.data.totalCartOriginalPrice || 0,
          totalDeliveryCost: totalDeliveryCost || 0,
          distaceMatrix: projectAllDeliveyFields ? deliveryCharge : null,
          couponDetails,
          isthresholdDeliveryKm : deliveryCharge?.isthresholdDeliveryKm,
          deliveryConfig: deliveryCharge?.deliveryConfig,
        };
      } else {
        return {
          totalCartCost: 0,
          totalCartQuantity: 0,
          totalCartDiscount: 0,
          totalCartOriginalPrice: 0,
          totalDeliveryCost: 0,
          totalCustomerOrderCost: 0,
          isthresholdDeliveryKm: false,
          deliveryConfig: null
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async getdeliveryOfCustomer(
    customerId: string,
    storeCustomId: string,
    addressId: string,
  ) {
    try {
      const [customerSelectedAddress, storeDetails] = await Promise.all([
        this.addressService.findOneModule(addressId, customerId),
        this.storeService.findOneModuleStoreCustomId(storeCustomId),
      ]);
      const deliveryCost = await this.calculator.deliveryCharge(
        storeDetails.data?.deliveryConfig?.deliveryChargePerKm || 0,
        storeDetails.data?.deliveryConfig,
        customerSelectedAddress?.data?.location?.coordinates,
        storeDetails?.data?.location?.coordinates,
      );
      return deliveryCost;
    } catch (error) {
      throw error;
    }
  }

  async insertOrderIdIsCartAndDelete(
    orderId: string,
    customerId: string,
    storeCustomId: string,
    session: any,
  ): Promise<IDataModuleRes<MyCartReq[]>> {
    try {
      const match = {
        customerId: mongoose.Types.ObjectId(customerId),
        storeCustomId: storeCustomId,
      };
      let result = this.Module.aggregate([
        { $match: match },
        { $addFields: { orderGroupId: orderId } },
      ]);
      if (result.length) {
        return {
          status: true,
          message: ICartMessage.foundSuccess,
          data: result,
        };
      } else {
        return {
          status: true,
          message: ICartMessage.foundSuccess,
          data: null,
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
