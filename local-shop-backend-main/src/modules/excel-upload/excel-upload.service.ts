import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as XLSX from 'xlsx';
import { UtilsService } from '../../service/utils/utils.service';
import { AwsService } from '../aws/aws.service';
import { uuid } from 'uuidv4';
import {
  CatalogfindOneByIdRes,
  CreateCatalogDto,
  ICatalogMessage,
} from '../catalog/catalog.dto';
import { CatalogService } from '../catalog/catalog.service';
import { InjectModel } from '@nestjs/mongoose';
import { ExcelUpload } from './excel-upload.interface';
import { IModuleRes } from 'src/common.service';
import * as mongoose from 'mongoose';
import {
  IExcelDatafindManyRes,
  IExcelfindOneByIdRes,
} from './excel-upload.dto';
import { StoreService } from '../store/store.service';
import { StoreProductCatalogService } from '../store-product-catalog/store-product-catalog.service';
import { StorefindOneByIdRes } from '../store/store.dto';
import { CreateReqDto } from '../store-product-catalog/store-product-catalog.dto';

@Injectable()
export class ExcelUploadService {
  constructor(
    @InjectModel('ExcelUpload') private readonly Module: Model<ExcelUpload>,
    private utilsService: UtilsService,
    private awsService: AwsService,
    private catalogService: CatalogService,
    private storeService: StoreService,
    private storeProductCatalog: StoreProductCatalogService,
  ) {}

  async uploadCatalog(file: any, referenceName: string) {
    try {
      const FILE_TYPE = 'buffer';
      const SHEET_NAME = 'Catalog';
      let workbook = XLSX.read(file.buffer, {
        type: FILE_TYPE,
      });
      let catalogSheet = workbook.Sheets[SHEET_NAME];
      let catalogJson: any = XLSX.utils.sheet_to_json(catalogSheet, {
        raw: true,
      });
      let catalogError = [];
      console.log('Before Catalog');
      for (let catalog of catalogJson) {
        let awsUpload;
        try {
          let getBarcode;
          try {
            getBarcode = await this.catalogService.findIdByBarcode(
              catalog.BARCODE,
              { _id: 1, barcode: 1 },
            );
          } catch (error) {
            getBarcode = { status: false };
          }
          if (getBarcode && !getBarcode.status) {
            let fileUplaod = await (
              await this.utilsService.getDataFromUrl(
                catalog.PRODUCT_IMAGE_FRONT,
              )
            ).toPromise();
            let udid = uuid();
            let file: any = {
              content: fileUplaod.data,
              fileName: 'images/' + udid,
              contentType: fileUplaod.headers['content-type'],
              ACL: 'public-read',
            };
            awsUpload = await this.awsService.fileUploadS3(file);
            let media = await this.getAllMultiMedia(catalog);
            let catalogData: CreateCatalogDto = {
              categoryId: catalog.CATEGORY_ID,
              categoryName: catalog.CATEGORY_NAME,
              barcode: catalog.BARCODE,
              subCategoryId: catalog.SUB_CATEGORY_ID,
              subCategoryName: catalog.SUB_CATEGORY,
              name: catalog.FULL_PRODUCT_NAME,
              brandName: catalog.BRAND,
              description: '',
              status: true,
              image: {
                filePath: awsUpload.key,
                type: file.contentType,
              },
              media: media,
              unitValue: catalog.UNIT_VALUE,
              unit: catalog.UNIT,
              offerUnit: catalog.MULTIPACK,
              originalPrice: catalog.MRP,
              keyWord: [catalog.KEY_WORD],
              verified: false,
            };
            await this.catalogService.createModule(catalogData);
          } else {
            console.log(
              '================== BARCODE ALREADY EXIST =========================',
            );
            const createCatalog = new this.Module({
              data: catalog,
              error: 'BARCODE ALREADY EXIST',
              referenceName: referenceName,
              importType: SHEET_NAME,
              index: null,
            });
            await createCatalog.save();
          }
        } catch (error) {
          const createCatalog = new this.Module({
            data: catalog,
            error: JSON.stringify(error),
            referenceName: referenceName,
            importType: SHEET_NAME,
            index: 1,
          });
          await createCatalog.save();
        }
      }
    } catch (error) {
      console.log('======= FILE ==========', error);
      const createCatalog = new this.Module({
        data: null,
        error: JSON.stringify(error),
        referenceName: referenceName,
        importType: 'Catalog',
        index: null,
      });
      await createCatalog.save();
    }
  }

  async getAllMultiMedia(catalogObj: any) {
    try {
      const imgAttr = ['IMG_1', 'IMG_2', 'IMG_3', 'IMG_4', 'IMG_5', 'IMG_6'];
      let catalog: any = catalogObj;
      let media: any = [];
      for (let img of imgAttr) {
        try {
          if (catalog[img]) {
            let fileUplaod = await (
              await this.utilsService.getDataFromUrl(catalog[img])
            ).toPromise();
            let udid = uuid();
            let file: any = {
              content: fileUplaod.data,
              fileName: 'images/' + udid,
              contentType: fileUplaod.headers['content-type'],
              ACL: 'public-read',
            };
            let awsUpload = await this.awsService.fileUploadS3(file);
            media.push({
              filePath: awsUpload.key,
              type: file.contentType,
            });
          }
        } catch (error) {
          console.log('=============== MEDIA LOOP ====================', error);
        }
      }
      return media;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteModule(_id: string): Promise<IModuleRes> {
    try {
      await this.Module.deleteOne({ _id: _id });
      return { status: true, message: ICatalogMessage.deleteSuccess };
    } catch (error) {
      throw error;
    }
  }

  async findOneModule(_id: string): Promise<IExcelfindOneByIdRes> {
    try {
      let result = await this.Module.findOne({ _id: _id });
      if (result) {
        return {
          status: true,
          message: ICatalogMessage.foundSuccess,
          data: result,
        };
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
    filter?: string,
  ): Promise<IExcelDatafindManyRes> {
    try {
      let match = {};
      count = Number(count || 10);
      page = Number(page || 0);
      let item: any = [
        { $sort: { _id: 1 } },
        { $skip: page * count },
        { $limit: count },
      ];
      if (filter && filter != '') {
        let search = {
          $or: [
            { PRODUCT_NAME: { $regex: new RegExp(filter, 'i') } },
            { BARCODE: { $regex: new RegExp(filter, 'i') } },
            { FULL_PRODUCT_NAME: { $regex: new RegExp(filter, 'i') } },
          ],
        };
        match = { ...match, ...search };
      }
      if (match) {
        item.unshift({ $match: match });
      }
      console.log(item);
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

  async uploadStoreProductCatalog(
    file: any,
    referenceName: string,
    storeCustomId: string,
  ) {
    try {
      let storeInfo: StorefindOneByIdRes = await this.storeService.findOneModuleStoreCustomId(
        storeCustomId,
      );
      console.log(storeInfo);
      const FILE_TYPE = 'buffer';
      const SHEET_NAME = 'StoreCatalog';
      let workbook = XLSX.read(file.buffer, {
        type: FILE_TYPE,
      });
      let storeCatalogSheet = workbook.Sheets[SHEET_NAME];
      let storeCatalogJson: any = XLSX.utils.sheet_to_json(storeCatalogSheet, {
        raw: true,
      });
      let catalogError = [];
      await this.storeProductCatalog.updateManyStatus(
        {storeCustomId},
        false,
      );
      for (let storeCatalog of storeCatalogJson) {
        let getBarcode;
        try {
          getBarcode = await this.catalogService.findIdByBarcode(
            storeCatalog.BARCODE,
            { _id: 1, barcode: 1 },
          );
          let storeCatalogData: CreateReqDto = {
            referenceName: storeCatalog.PRODUCT_NAME,
            storeId: storeInfo.data._id,
            storeName: storeInfo.data.businessName,
            storeCustomId: storeInfo.data.storeCustomId,
            status: true,
            originalPrice: Number(storeCatalog.MRP?.toFixed(2)),
            discount: null,
            actualStoreMrp: Number(storeCatalog.ACTUAL_STORE_MRP?.toFixed(2))
          };
          if (storeCatalog?.DISCOUNT && storeCatalog?.DISCOUNT_TYPE) {
            storeCatalogData.discount = {
              type: storeCatalog.DISCOUNT_TYPE,
              value: Number(storeCatalog.DISCOUNT.toFixed(2)),
            };
          }
          let storeItemExist = await this.storeProductCatalog.getStoreCustomIdByBarcode(
            storeInfo.data.storeCustomId,
            storeCatalog.BARCODE,
          );
          console.log(storeItemExist);
          
          if (storeItemExist) {
            let updateCatalog = await this.storeProductCatalog.updateModule(
              storeItemExist._id,
              storeCatalogData,
            );
            console.log('================= Update =========================', updateCatalog);
            console.log('================= Update =========================');

          } else {
            try {
              let saveCatalog = await this.storeProductCatalog.createModule(
                getBarcode.data._id,
                storeCatalogData,
              );
              console.log(saveCatalog);
            } catch (error) {
              console.log('============= DUPLICATE===========', error);

              if (error.status == 409) {
                try {
                  let updateCatalog = await this.storeProductCatalog.updateModule(
                    storeItemExist._id,
                    storeCatalogData,
                  );
                  console.log('Update', updateCatalog);
                } catch (error) {
                  const createCatalog = new this.Module({
                    data: storeCatalog,
                    error: error,
                    referenceName: referenceName,
                    importType: SHEET_NAME,
                    index: null,
                  });
                  await createCatalog.save();
                }
              } else {
                const createCatalog = new this.Module({
                  data: storeCatalog,
                  error: error,
                  referenceName: referenceName,
                  importType: SHEET_NAME,
                  index: null,
                });
                await createCatalog.save();
              }
            }
          }
        } catch (error) {
        //   getBarcode = { status: false };
        }
      }
    } catch (error) {
      console.log('======= FILE ==========', error);
      const createCatalog = new this.Module({
        data: null,
        error: JSON.stringify(error),
        referenceName: referenceName,
        importType: 'Store Catalog',
        index: null,
      });
      await createCatalog.save();
    }
  }
}
