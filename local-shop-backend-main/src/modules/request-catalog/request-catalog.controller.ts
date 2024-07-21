import { Response, Request } from 'express';
import { Controller, Post, Body, Res, HttpStatus, Put, Param, Delete, Get, UseFilters, Query, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiRequestTimeoutResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { IModuleRes } from '../../common.service';
import { RequestCatalogService } from './request-catalog.service';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { IRequestCatalogfindManyRes, RequestCatalogfindOneByIdRes } from './request-catalog.dto';
import  { CreateRequestCatalogDto, UpdateRequestCatalogDto } from './request-catalog.dto';

@ApiTags('Request Catalog')
@Controller('request-catalog')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class RequestCatalogController {
    constructor(private Service: RequestCatalogService) {}

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Post('create')
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async Create(@Body() CreateRequestCatalogDto: CreateRequestCatalogDto, @Req() Req: Request, @Res() Res: Response, ) {
      let user: any = Req.user;
      CreateRequestCatalogDto['storeId'] = user.storeId;
      CreateRequestCatalogDto['storeName'] = user.storeName;
      let result = await this.Service.createModule(CreateRequestCatalogDto);
      Res.status(HttpStatus.CREATED).send(result);
    }
  
    
    @UseGuards(AuthGuard('JWTaccessToken'))
    @Put('update/:_id')
    @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async update(@Param('_id') _id: string, @Body() UpdateRequestCatalogDto: UpdateRequestCatalogDto,  @Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      CreateRequestCatalogDto['storeId'] = user.storeId;
      CreateRequestCatalogDto['storeName'] = user.storeName;
      let result = await this.Service.updateModule(_id, UpdateRequestCatalogDto);
      Res.status(HttpStatus.OK).send(result);
    }
  
    @UseGuards(AuthGuard('JWTaccessToken'))
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
  
    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('find/:_id')
    @ApiOkResponse({ type: RequestCatalogfindOneByIdRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
      let result = await this.Service.findOneModule(_id);
      Res.status(HttpStatus.OK).send(result);
    }

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('my-shop/:categoryId?/:subCategoryId?')
    @ApiOkResponse({ type: IRequestCatalogfindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findShopManyProduct(
      @Res() Res: Response,
      @Req() Req: Request,
      @Query('page') page: number,
      @Query('count') count: number,
      @Query('categoryId') categoryId?: string,
      @Query('subCategoryId') subCategoryId?: string,
      @Query('filter') filter?: string,
    ) {
      let user: any = Req.user;
      let result = await this.Service.findManyModuleByStoreCustomId(user.storeId, page, count, categoryId || null, subCategoryId || null, filter, true);
      Res.status(HttpStatus.OK).send(result);
    }
}
