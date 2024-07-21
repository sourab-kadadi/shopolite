import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Catalog } from './catalog.interface';
import { CreateCatalogDto, UpdateCatalogDto, CatalogfindOneByIdRes, ICatalogMessage, ICatalogfindManyRes } from './catalog.dto';
import { IModuleRes } from '../../common.service';
import * as mongoose from 'mongoose';
@Injectable()
export class CatalogService {
  constructor(@InjectModel('Catalog') private readonly Module: Model<Catalog>) { }

  async createModule(CatalogDto: CreateCatalogDto): Promise<IModuleRes> {
    try {
      const createCatalog = new this.Module(CatalogDto);
      await createCatalog.save();
      return { status: true, message: ICatalogMessage.createdSuccess }
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

  async updateModule(_id: string, catalogDto: UpdateCatalogDto): Promise<IModuleRes> {
    try {
      let result = await this.Module.update({ _id: _id }, { $set: catalogDto });
      return { status: true, message: ICatalogMessage.updateSuccess }
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
      return { status: true, message: ICatalogMessage.deleteSuccess }
    } catch (error) {
      throw error;
    }
  }

  async findOneModule(_id: string): Promise<CatalogfindOneByIdRes> {
    try {
      let result = await this.Module.findOne({ _id: _id });
      if (result) {
        return { status: true, message: ICatalogMessage.foundSuccess, data: result }
      } else {
        throw new HttpException(ICatalogMessage.notFound, HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
  }


  async findOneModuleForStore(_id: string, storeId: string): Promise<CatalogfindOneByIdRes> {
    try {
      let result = await this.Module.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(_id) } },
        {
          $lookup: {
            from: 'storeproductcatalogs',
            let: { catalogId: '$_id' },
            pipeline: [
              { $match: { $expr: { $and: [{ $eq: ['$productId', '$$catalogId'] }] }, storeId: mongoose.Types.ObjectId(storeId) } },
              { $project: { originalPrice: 1, unit: 1, unitValue: 1, status: 1, sellingPrice: 1, discount: 1 } }
            ],
            as: 'myProduct'
          }
        },
        { $unwind: { path: "$myProduct", preserveNullAndEmptyArrays: true } }
      ]);
      if (result) {
        return { status: true, message: ICatalogMessage.foundSuccess, data: result[0] || [] }
      } else {
        return { status: false, message: ICatalogMessage.notFound, data: null }
      }
    } catch (error) {
      throw error;
    }
  }

  async findOneModuleProject(_id: string, project: any): Promise<CatalogfindOneByIdRes> {
    try {
      let result = await this.Module.findOne({ _id: _id }, { $project: project });
      if (result) {
        return { status: true, message: ICatalogMessage.foundSuccess, data: result }
      } else {
        throw new HttpException(ICatalogMessage.notFound, HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
  }


  async findIdByBarcode(barcode: string, project: any): Promise<CatalogfindOneByIdRes> {
    try {
      let result = await this.Module.findOne({ barcode: barcode });
      if (result) {
        return { status: true, message: ICatalogMessage.foundSuccess, data: result };
      } else {
        throw new HttpException(ICatalogMessage.notFound, HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
  }


  async findManyModule(
    page: number,
    count: number,
    categoryId: string,
    subCategoryId: string,
    filter?: string,
    status?: boolean,
    verified?: boolean
  ): Promise<ICatalogfindManyRes> {
    try {
      let match = {};
      count = Number(10);
      page = Number(page || 0);
      let item: any = [
        { $sort: { _id: 1 } },
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
      if (verified) {
        match['verified'] = Boolean(verified);
      }

      if (match) {
        item.unshift({ $match: match });
      }
      if (filter) {
        item.unshift(
          {
            $search: {
              index: 'Catalog_Standerd',
              text: {
                query: filter,
                path: {
                  wildcard: '*'
                },
                fuzzy: {}
              },
            },
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
          message: ICatalogMessage.foundSuccess,
          data: result,
          totalCount: resultCount,
        };
      } else {
        return {
          status: true,
          message: ICatalogMessage.foundSuccess,
          data: [],
          totalCount: 0,
        };
      }
    } catch (error) {
      throw error;
    }
  }



  async findStoreCatalog(
    page: number,
    count: number,
    categoryId: string,
    subCategoryId: string,
    storeId: string,
    myProducts: string, // boolean value
    filter?: string,
    status?: string, // boolean Value
  ): Promise<ICatalogfindManyRes> {
    try {
      let match = {};
      count = Number(10);
      page = Number(page || 0);
      let item: any = [
        { $sort: { _id: 1 } },
        { $skip: page * count },
        { $limit: count },
      ];
      let itemCount: any = [];
      if (status != undefined && status != null) {
        match = { ...match, ...{ status: status == 'true' ? true : false } };
      }
      if (categoryId) {
        match = { ...match, ...{ categoryId: mongoose.Types.ObjectId(categoryId) } };
      }
      if (subCategoryId) {
        match = { ...match, ...{ subCategoryId: mongoose.Types.ObjectId(subCategoryId) } };
      }
      let lookUp = {
        $lookup: {
          from: 'storeproductcatalogs',
          // localField: '_id',
          // foreignField: 'productId',
          let: { catalogId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$productId', '$$catalogId'] }] }, storeId: mongoose.Types.ObjectId(storeId) } },
            { $project: { originalPrice: 1, unit: 1, unitValue: 1, offerUnit: 1, status: 1, sellingPrice: 1, discount: 1 } }
          ],
          as: 'myProduct',
        }
      };
      let unwind = { $unwind: { path: '$myProduct', preserveNullAndEmptyArrays: !(myProducts.toLowerCase() == 'true' ? true : false) } }
      if (match) {
        item.unshift({ $match: match });
        itemCount.unshift({ $match: match });
      }
      if (!(myProducts.toLowerCase() == 'true')) {
        item.push(lookUp);
        item.push(unwind);

        itemCount.push(lookUp);
        itemCount.push(unwind);
      } else {
        item.unshift(unwind);
        item.unshift(lookUp);
        itemCount.unshift(unwind);
        itemCount.unshift(lookUp);
      }
      if (filter) {
        item.unshift(
          {
            $search: {
              index: 'Catalog_Standerd',
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
      item.push({$project: {barcode: 0}})
      let result = this.Module.aggregate(item);
      itemCount.push({ $count: 'count' })
      let resultCount = this.Module.aggregate([itemCount]);
      let data = await Promise.all([result, resultCount]);
      if (data) {
        result = data[0];
        resultCount = data[1];
      }
      if (result.length) {
        return {
          status: true,
          message: ICatalogMessage.foundSuccess,
          data: result,
          totalCount: resultCount?.[0]?.count,
        };
      } else {
        return {
          status: true,
          message: ICatalogMessage.foundSuccess,
          data: [],
          totalCount: 0,
        };
      }
    } catch (error) {
      throw error;
    }
  }


}
