import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IDataModuleRes, IModuleRes } from '../../common.service';
import { StoreProductCatalog } from './store-product-catalog.interface';
import { CreateReqDto, CreateStoreProductCatalogDto, IStoreActiveSubCategroy, IStoreProductCatalogfindManyRes, IStoreProductCatalogMessage, StatusUpdateStoreProductCatalogDto, StoreProductCatalogfindOneByIdRes, UpdateProcuctPrice, UpdateStoreProductCatalogDto } from './store-product-catalog.dto';
import { CatalogService } from '../catalog/catalog.service';
import * as mongoose from 'mongoose';
import { CartStatus } from '../cart/cart.interface';
import { CalculatorService } from 'src/service/calculator/calculator.service';
@Injectable()
export class StoreProductCatalogService { 

  constructor(private catalogService: CatalogService, @InjectModel('StoreProductCatalog') private Module: Model<StoreProductCatalog>, private calcuation: CalculatorService) { }

  async createModule(catalogId: any, StoreProductCatalogDto: CreateReqDto): Promise<IDataModuleRes<any>> {
    try {
      let catalogDetails = await this.catalogService.findOneModule(catalogId);
      const sellingPrice = this.calcuation.sellingPrice(StoreProductCatalogDto.originalPrice, StoreProductCatalogDto.discount || null);
      let StoreProductCatalog: StoreProductCatalog = {
        storeId: StoreProductCatalogDto.storeId,
        storeCustomId: StoreProductCatalogDto.storeCustomId,
        storeName: StoreProductCatalogDto.storeName,
        categoryId: catalogDetails.data.categoryId,
        categoryName: catalogDetails.data.categoryName,
        subCategoryId: catalogDetails.data.subCategoryId,
        subCategoryName: catalogDetails.data.subCategoryName,
        productId: catalogDetails.data._id,
        productName: catalogDetails.data.name,
        brandName: catalogDetails.data.brandName,
        sku: catalogDetails.data.sku,
        barcode: catalogDetails.data.barcode || null,
        description: catalogDetails.data.description || null,
        status: StoreProductCatalogDto.status,
        spec: catalogDetails.data.spec || null,
        image: catalogDetails.data.image || null,
        unitValue: catalogDetails.data.unitValue,
        unit: catalogDetails.data.unit,
        media: catalogDetails.data.media,
        keyWord: catalogDetails.data.keyWord,
        restaurantMenuDishType: catalogDetails.data?.restaurantMenuDishType,
        offerUnit: catalogDetails.data.offerUnit,
        originalPrice:  StoreProductCatalogDto.originalPrice,
        sellingPrice: sellingPrice,
        discount: StoreProductCatalogDto.discount,
        referenceName: StoreProductCatalogDto.referenceName || null,
        actualStoreMrp: StoreProductCatalogDto.actualStoreMrp || sellingPrice
      };
      const createStoreProductCatalog = new this.Module(StoreProductCatalog);
      let resData: any = {
        referenceName: StoreProductCatalog.referenceName || null,
        discount: StoreProductCatalog.discount,
        originalPrice: StoreProductCatalog.originalPrice,
        status: StoreProductCatalog.status,
        sellingPrice: StoreProductCatalog.sellingPrice
    }
      await createStoreProductCatalog.save();
      return { status: true, message: IStoreProductCatalogMessage.createdSuccess, data: resData }
    } catch (error) {
      console.log("=============== Store Catalog errror =============", error);
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

  async updateModule(_id: string, StoreProductCatalogDto: UpdateStoreProductCatalogDto): Promise<IDataModuleRes<any>> {
    try {
      const sellingPrice = this.calcuation.sellingPrice(StoreProductCatalogDto.originalPrice, StoreProductCatalogDto.discount || null)
      let updateData: any = {
        referenceName: StoreProductCatalogDto.referenceName || null,
        discount: StoreProductCatalogDto.discount,
        originalPrice: Number(StoreProductCatalogDto.originalPrice?.toFixed(2)),
        status: StoreProductCatalogDto.status,
        sellingPrice: sellingPrice,
        actualStoreMrp: Number(StoreProductCatalogDto.actualStoreMrp?.toFixed(2) || sellingPrice),
    };
      let result = await this.Module.updateOne({ _id: _id }, { $set: updateData });
      if (result.n && result.ok){
      return { status: true, message: IStoreProductCatalogMessage.updateSuccess, data: updateData }
      } else {
        throw new HttpException(
          "Product Not Found",
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

  async updateManyStatus(queary: any, status: boolean): Promise<IDataModuleRes<any>> {
    try {
      let result = await this.Module.updateMany(queary, { $set: { status } });
      if (result.n && result.ok){
      return { status: true, message: IStoreProductCatalogMessage.updateSuccess }
      } else {
        throw new HttpException(
          "Product Not Found",
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

  async statusUpdate(_id: string, statusUpdateStoreProductCatalogDto: StatusUpdateStoreProductCatalogDto): Promise<IModuleRes> {
    try {
      let result = await this.Module.update({ _id: _id }, { $set: statusUpdateStoreProductCatalogDto });
      if (result.n) {
        return { status: true, message: IStoreProductCatalogMessage.updateSuccess };
      } else {
        throw new HttpException(
          IStoreProductCatalogMessage.notFound,
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
      await this.Module.deleteOne({ _id: _id });
      return { status: true, message: IStoreProductCatalogMessage.deleteSuccess }
    } catch (error) {
      throw error;
    }
  }

  async findOneModule(_id: string): Promise<StoreProductCatalogfindOneByIdRes> {
    try {
      let result = await this.Module.findOne({ _id: _id });
      if (result) {
        return { status: true, message: IStoreProductCatalogMessage.foundSuccess, data: result }
      } else {
        return { status: false, message: IStoreProductCatalogMessage.notFound, data: null }
      }
    } catch (error) {
      throw error;
    }
  }

  async findOneByStoreAndProdIdModule(storeCustomId: string, productId: string): Promise<StoreProductCatalogfindOneByIdRes> {
    try {
      let result = await this.Module.findOne({ storeCustomId: storeCustomId, _id: mongoose.Types.ObjectId(productId) });
      if (result) {
        return { status: true, message: IStoreProductCatalogMessage.foundSuccess, data: result }
      } else {
        return { status: false, message: IStoreProductCatalogMessage.notFound, data: null }
      }
    } catch (error) {
      throw error;
    }
  }


  async findOneForCustomer(_id: string, customerId: string): Promise<StoreProductCatalogfindOneByIdRes> {
    try {
      let lookUp = {
        $lookup: {
          from: 'cart',
          // localField: '_id',
          // foreignField: 'productId',
          let: { prodId: '$prodectId' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$productId', '$$prodId'] }] }, customerId: mongoose.Types.ObjectId(customerId) } },
            { $project: { sellingPrice: 1, unit: 1, unitValue: 1, status: 1 } }
          ],
          as: 'myCart',
        }
      }
      let result = await this.Module.aggrgate([
        { $match: { _id: _id } },
        lookUp,
        { $unwind: "$myCart" }]);
      if (result && result.length) {
        return { status: true, message: IStoreProductCatalogMessage.foundSuccess, data: result[0] }
      } else {
        return { status: false, message: IStoreProductCatalogMessage.notFound, data: null }
      }
    } catch (error) {
      throw error;
    }
  }


  async findManyModule(
    storeId: string,
    page: number,
    count: number,
    categoryId?: string,
    subCategoryId?: string,
    filter?: string,
    status?: boolean
  ): Promise<IStoreProductCatalogfindManyRes> {
    try {
      let match = { storeId: mongoose.Types.ObjectId(storeId) };
      count = Number(count || 10);
      page = Number(page || 0);
      let item: any = [
        { $skip: page * count },
        { $limit: count },
      ];
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
      if (filter) {
      item.unshift(
        {
          $search: {
              index: 'item_indexing',
              text: {
                  query: filter,
                  path: {
                      wildcard: '*'
                  },
                  fuzzy: {}
              }
          }
      }
      );
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
          message: IStoreProductCatalogMessage.foundSuccess,
          data: result,
          totalCount: resultCount,
        };
      } else {
        return {
          status: true,
          message: IStoreProductCatalogMessage.foundSuccess,
          data: [],
          totalCount: 0,
        };
      }
    } catch (error) {
      throw error;
    }
  }




  async findManyModuleByStoreCustomId(
    storeCustomId: string,
    page: number,
    count: number,
    categoryId?: string,
    subCategoryId?: string,
    filter?: string,
    status?: boolean,
    customerId?: string,
    type?: string
  ): Promise<IStoreProductCatalogfindManyRes> {
    try {
      let match = { storeCustomId: storeCustomId };
      count = Number(count || 10);
      page = Number(page || 0);
      let item: any = [
        // { $sort: { sellingPrice: 1 } }, 
        { $skip: page * count },
        { $limit: count },
      ]
      if (status != undefined && status != null && typeof status === "boolean") {
        match = { ...match, ...{ status: status } };
      }
      if (categoryId) {
        match = { ...match, ...{ categoryId: mongoose.Types.ObjectId(categoryId) } };
      }
      if (subCategoryId) {
        match = { ...match, ...{ subCategoryId: mongoose.Types.ObjectId(subCategoryId) } };
      }
      if (type) {
        match = { ...match, ...{ restaurantMenuDishType: type } };
      }
      item.unshift({ $match: match });
      if (filter) {
      item.unshift({$addFields: {"score": { "$meta": "searchScore" }}});
      item.unshift(
        {
          $search: {
              index: 'item_indexing',
              text: {
                  query: filter,
                  path: {
                      wildcard: '*'
                  },
                  fuzzy: {}
              }
          }
      }
      );
    }
      if (customerId) {
        let lookUp = {
          $lookup: {
            from: 'carts',
            // localField: '_id',
            // foreignField: 'productId',
            let: { prodId: '$productId', customStoreId: "$storeCustomId" },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ['$productId', '$$prodId'] }, { $eq: ['$storeCustomId', '$$customStoreId'] }] }, customerId: mongoose.Types.ObjectId(customerId), cartStatus: CartStatus.IN_CART } },
              { $project: { sellingPrice: 1, unit: 1, unitValue: 1, status: 1, quantity: 1, originalPrice: 1, discount: 1, textScore: 1 } }
            ],
            as: 'myCart',
          }
        }
        item.push(lookUp);
        item.push({ $unwind: { path: '$myCart', preserveNullAndEmptyArrays: true }}, 
        {$project: { brandName: 1, categoryId: 1, categoryName: 1, image: 1, originalPrice: 1, productId: 1, productName: 1, sellingPrice: 1, sku: 1, status: 1, storeCustomId: 1, storeId: 1, storeName: 1, subCategoryId: 1, subCategoryName: 1, unit: 1, unitValue: 1, _id: 1, myCart: 1, discount: 1}}
        );
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
          message: IStoreProductCatalogMessage.foundSuccess,
          data: result,
          totalCount: resultCount
        };
      } else {
        return {
          status: true,
          message: IStoreProductCatalogMessage.foundSuccess,
          data: [],
          totalCount: 0,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllActiveSubCategory(storeCustomeId: string, isActiveonly?: boolean, categoryId?: string, type?: string): Promise<IStoreActiveSubCategroy> {
    try {
      let match = { storeCustomId: storeCustomeId };
      if (categoryId) {
        match['categoryId'] = mongoose.Types.ObjectId(categoryId);
      }
      if (isActiveonly) {
        match['status'] = true;
      }
      if (type) {
        match['restaurantMenuDishType'] = type;
      }
      console.log(match);
      
      let result = await this.Module.aggregate([
        { $match:  match },
        { $group: { _id: "$subCategoryId" } },
        {
          $lookup: {
            from: "sub-categories",
            localField: "_id",
            foreignField: "_id",
            as: "subCategory"
          }
        },
        { $unwind: "$subCategory" },
        { $sort: { "subCategory.manualRankingSubcat": 1, "subCategory._id": 1 } },
        { $project: { "name": "$subCategory.name", "image": "$subCategory.image", rank: "$subCategory.manualRankingSubcat" } },
      ]);
      return {
        status: true,
        message: IStoreProductCatalogMessage.foundSuccess,
        data: result
      };
    } catch (error) {
      throw error;
    }
  }


  async getAllActiveCategory(storeCustomeId): Promise<IStoreActiveSubCategroy> {
    try {
      let result = await this.Module.aggregate([
        { $match: { storeCustomId: storeCustomeId } },
        { $group: { _id: "$categoryId" } },
        {
          $lookup: {
            from: "categorys",
            localField: "_id",
            foreignField: "_id",
            as: "category"
          }
        },
        { $unwind: "$category" },
        { $project: { "name": "$category.name", "image": "$category.image" } }
      ]);
      return {
        status: true,
        message: IStoreProductCatalogMessage.foundSuccess,
        data: result
      };
    } catch (error) {
      throw error;
    }
  }

  async getStoreCustomIdByBarcode(storeCustomId: string, barcode: string) {
    let item = await this.Module.findOne({storeCustomId, barcode});
    return item;
  }



}


