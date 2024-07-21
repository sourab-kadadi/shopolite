import { Controller, Post, Body, Res, HttpStatus, Put, Param, Delete, Get, UseFilters, Query, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response, Request } from 'express';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiRequestTimeoutResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ExcelUploadService } from './excel-upload.service';
import { IModuleRes } from '../../common.service';
import { CatalogUploadData, IExcelfindOneByIdRes, IExcelDatafindManyRes } from './excel-upload.dto';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('excel-upload')
@Controller('excel-upload')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)

export class ExcelUploadController {
    constructor(public excelUplaodService: ExcelUploadService ) {}

    @Post('upload/:referenceName')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('referenceName') referenceName: string) {
      await this.excelUplaodService.uploadCatalog(file, referenceName)
    }


    @Delete('delete/:_id')
    @ApiOkResponse({ type: IModuleRes, description: 'Deleted Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async delete(@Param('_id') _id: string, @Res() Res: Response) {
      let result = await this.excelUplaodService.deleteModule(_id);
      Res.status(HttpStatus.OK).send(result);
    }
  
    @Get('find/:_id')
    @ApiOkResponse({ type: IExcelfindOneByIdRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
      let result = await this.excelUplaodService.findOneModule(_id);
      Res.status(HttpStatus.OK).send(result);
    }

    // @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('all')
    @ApiOkResponse({ type: IExcelDatafindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findManyActive(
      @Req() Req: Request,
      @Res() Res: Response,
      @Query('page') page: number,
      @Query('count') count: number,
      @Query('search') search?: string,
    ) {
      // let user: any = Req.user;
      console.log('trig');
      let result = await this.excelUplaodService.findManyModule(page, count, search);
      Res.status(HttpStatus.OK).send(result);
    }


    @Get('upload-store-catalog/:referenceName/:storeCustomId')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    async storeCatalogUploadFile(@UploadedFile() file: Express.Multer.File, @Res() Res: Response, @Param('referenceName') referenceName: string, @Param('storeCustomId') storeCustomId: string) {
      let result = await this.excelUplaodService.uploadStoreProductCatalog(file, referenceName, storeCustomId);
      Res.status(HttpStatus.OK).send(result);
    }









}
