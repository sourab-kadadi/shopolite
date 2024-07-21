import { Response, Request } from 'express';
import { Controller, Post, Body, Res, HttpStatus, Put, Param, Delete, Get, UseFilters, Query, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiRequestTimeoutResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { IModuleRes } from '../../common.service';
import { CreateCatalogDto, UpdateCatalogDto, CatalogfindOneByIdRes, ICatalogfindManyRes } from './catalog.dto';
import { CatalogSchema } from './catalog-schema';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@ApiTags('Catalog')
@Controller('catalog')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class CatalogController {
  constructor(private Service: CatalogService) {}

  @Post('create')
  @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async Create(@Body() CreateCatalogDto: CreateCatalogDto, @Res() Res: Response) {
    let result = await this.Service.createModule(CreateCatalogDto);
    Res.status(HttpStatus.CREATED).send(result);
  }

  @Put('update/:_id')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async update(@Param('_id') _id: string, @Body() UpdateCatalogDto: UpdateCatalogDto, @Res() Res: Response) {
    let result = await this.Service.updateModule(_id, UpdateCatalogDto);
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
  @ApiOkResponse({ type: CatalogfindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
    let result = await this.Service.findOneModule(_id);
    Res.status(HttpStatus.OK).send(result);
  }

  @Get('barcode/:barcode')
  @ApiOkResponse({ type: CatalogfindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneByBarcode(@Param('barcode') barcode: string, @Res() Res: Response) {
    let result = await this.Service.findIdByBarcode(barcode, {_id: 1});
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('find/store/:_id')
  @ApiOkResponse({ type: CatalogfindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneByIdForStore(@Param('_id') _id: string,  @Req() Req: Request, @Res() Res: Response) {
    let user: any = Req.user;
    let result = await this.Service.findOneModuleForStore(_id, user.storeId);
    Res.status(HttpStatus.OK).send(result);
  }

  @Get('catalog-schema')
  @ApiOkResponse({ type: CatalogfindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async getSchema(@Res() Res: Response) {
    let result = { Message: 'Scheam', data: CatalogSchema };
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('all/:categoryId?/:subCategoryId?')
  @ApiOkResponse({ type: ICatalogfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findManyActive(
    @Req() Req: Request,
    @Res() Res: Response,
    @Query('page') page: number,
    @Query('count') count: number,
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Query('myProducts') myProducts: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    let user: any = Req.user;
    let result = await this.Service.findStoreCatalog(page, count, categoryId || null, subCategoryId || null, user.storeId, myProducts, search, status);
    Res.status(HttpStatus.OK).send(result);
  }

  // @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('admin/all/:categoryId?/:subCategoryId?')
  @ApiOkResponse({ type: ICatalogfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findManyActiveAll(
    @Req() Req: Request,
    @Res() Res: Response,
    @Query('page') page: number,
    @Query('count') count: number,
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    // @Query('myProducts') myProducts: string,
    @Query('search') search?: string,
    @Query('status') status?: boolean,
    @Query('verified') verified?: boolean,
  ) {
    // let user: any = Req.user;
    let result = await this.Service.findManyModule(page, count, categoryId || null, subCategoryId || null, search, status, verified);
    Res.status(HttpStatus.OK).send(result);
  }
}
