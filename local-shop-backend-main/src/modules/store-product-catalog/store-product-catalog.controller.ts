import { Response, Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiRequestTimeoutResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IModuleRes } from '../../common.service';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { StoreProductCatalogService } from './store-product-catalog.service';
import {
  CreateReqDto,
  CreateStoreProductCatalogDto,
  IStoreProductCatalogfindManyRes,
  StatusUpdateStoreProductCatalogDto,
  StoreProductCatalogfindOneByIdRes,
  UpdateStoreProductCatalogDto,
} from './store-product-catalog.dto';
@ApiTags('StoreProductCatalog')
@Controller('store-product-catalog')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class StoreProductCatalogController {
  constructor(private Service: StoreProductCatalogService) {}

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Post('create/:catalogId')
  @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async Create(
    @Param('catalogId') catalogId,
    @Body() CreateStoreProductCatalogDto: CreateReqDto,
    @Req() Req: Request,
    @Res() Res: Response,
  ) {
    let user: any = Req.user;
    console.log(user);
    CreateStoreProductCatalogDto['storeId'] = user.storeId;
    CreateStoreProductCatalogDto['storeName'] = user.storeName;
    CreateStoreProductCatalogDto['storeCustomId'] = user.storeCustomId;
    let result = await this.Service.createModule(catalogId, CreateStoreProductCatalogDto);
    Res.status(HttpStatus.CREATED).send(result);
  }

  @Put('update/:_id')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async update(
    @Param('_id') _id: string,
    @Body() UpdateStoreProductCatalogDto: UpdateStoreProductCatalogDto,
    @Res() Res: Response,
  ) {
    let result = await this.Service.updateModule(_id, UpdateStoreProductCatalogDto);
    Res.status(HttpStatus.OK).send(result);
  }

  @Put('status-update/:_id')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async updateStatus(
    @Param('_id') _id: string,
    @Body() statusUpdateStoreProductCatalogDto: StatusUpdateStoreProductCatalogDto,
    @Res() Res: Response,
  ) {
    let result = await this.Service.statusUpdate(_id, statusUpdateStoreProductCatalogDto);
    Res.status(HttpStatus.OK).send(result);
  }


  @Delete('delete/:_id')
  @ApiOkResponse({ type: IModuleRes, description: 'Deleted Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async delete(@Param('_id') _id: string, @Res() Res: Response) {
    let result = await this.Service.deleteModule(_id);
    Res.status(HttpStatus.OK).send(result);
  }

  @Get('find/:_id')
  @ApiOkResponse({ type: StoreProductCatalogfindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
    let result = await this.Service.findOneModule(_id);
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('all/:categoryId?/:subCategoryId?')
  @ApiOkResponse({ type: IStoreProductCatalogfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findManyActive(
    @Res() Res: Response,
    @Req() Req: Request,
    @Query('page') page: number,
    @Query('count') count: number,
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Query('filter') filter?: string,
    @Query('status') status?: boolean,
  ) {
    let user: any = Req.user;
    let result = await this.Service.findManyModule(user.userId, page, count, categoryId || null, subCategoryId || null, filter, status);
    Res.status(HttpStatus.OK).send(result);
  }


  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('shop/:storeId/:categoryId?/:subCategoryId?')
  @ApiOkResponse({ type: IStoreProductCatalogfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findShopManyActive(
    @Res() Res: Response,
    @Query('page') page: number,
    @Query('count') count: number,
    @Param('storeId') storeId: string,
    @Param('categoryId') categoryId?: string,
    @Param('subCategoryId') subCategoryId?: string,
    @Query('filter') filter?: string,
  ) {
    let result = await this.Service.findManyModule(storeId, page, count, categoryId || null, subCategoryId || null, filter, true);
    Res.status(HttpStatus.OK).send(result);
  }

  @Get('my-shop/:storeCustomId/:categoryId?/:subCategoryId?')
  @ApiOkResponse({ type: IStoreProductCatalogfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findShopManyProduct(
    @Res() Res: Response,
    @Query('page') page: number,
    @Query('count') count: number,
    @Param('storeCustomId') storeCustomId: string,
    @Query('categoryId') categoryId?: string,
    @Query('subCategoryId') subCategoryId?: string,
    @Query('filter') filter?: string,
  ) {
    let result = await this.Service.findManyModuleByStoreCustomId(storeCustomId, page, count, categoryId || null, subCategoryId || null, filter, true);
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('my-shop-auth/:storeCustomId/:categoryId?/:subCategoryId?')
  @ApiOkResponse({ type: IStoreProductCatalogfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findShopAuthManyProduct(
    @Req() Req: Request,
    @Res() Res: Response,
    @Query('page') page: number,
    @Query('count') count: number,
    @Param('storeCustomId') storeCustomId: string,
    @Query('categoryId') categoryId?: string,
    @Query('subCategoryId') subCategoryId?: string,
    @Query('search') filter?: string,
    @Query('type') type?: string,
  ) {
    let user: any = Req.user;
    let result = await this.Service.findManyModuleByStoreCustomId(storeCustomId, page, count, categoryId || null, subCategoryId || null, filter, true, user.userId || null, type);
    Res.status(HttpStatus.OK).send(result);
  }


  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('find-product-customer/:_id')
  @ApiOkResponse({ type: StoreProductCatalogfindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneProductForCustomer(@Param('_id') _id: string, @Req() Req: Request, @Res() Res: Response) {
    let user: any = Req.user;
    let result = await this.Service.findOneForCustomer(_id, user.userId);
    Res.status(HttpStatus.OK).send(result);
  }


  @Get('active-sub-category/:storeCustomId')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async getAllUniqueSubCategory(
    @Param('storeCustomId') storeCustomId: string,
    @Query('type') type: string,
    @Res() Res: Response,
  ) {
    let result = await this.Service.getAllActiveSubCategory(storeCustomId, true, null, type);
    Res.status(HttpStatus.OK).send(result);
  }


  @Get('active-category/:storeCustomId')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async getAllActiveCategory(
    @Param('storeCustomId') storeCustomId: string,
    @Res() Res: Response,
  ) {
    let result = await this.Service.getAllActiveCategory(storeCustomId);
    Res.status(HttpStatus.OK).send(result);
  }


  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('store/active-sub-category/:categoryId')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async getAllActiveSubCategoryByCategoryIds(
    @Param('categoryId') categoryId: string,
    @Res() Res: Response,
    @Req() Req: Request,
  ) {
    let user: any = Req.user;
    let result = await this.Service.getAllActiveSubCategory(user.storeCustomId, false, categoryId);
    Res.status(HttpStatus.OK).send(result);
  }



}
