import { Response } from 'express';
import { Controller, Post, Body, Res, HttpStatus, Put, Param, Delete, Get, Query, UseGuards, UseFilters } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiRequestTimeoutResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubCategoryService } from './sub-category.service';
import { IModuleRes } from 'src/common.service';
import {
  SubCategoryCreateDto,
  SubCategoryUpdateDto,
  ISubCategoryfindOneByIdRes,
  ISubCategoryfindManyRes,
} from './sub-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
@ApiTags('SubCategory')
@Controller('sub-category')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class SubCategoryController {
  constructor(private SubCategoryService: SubCategoryService) {}

  @Post('create')
  @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async Create(@Body() SubCategoryDto: SubCategoryCreateDto, @Res() Res: Response) {
    let result = await this.SubCategoryService.createModule(SubCategoryDto);
    Res.status(HttpStatus.CREATED).send(result);
  }

  @Put('update/:_id')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async update(@Param('_id') _id: string, @Body() SubCategoryDto: SubCategoryUpdateDto, @Res() Res: Response) {
    let result = await this.SubCategoryService.updateModule(_id, SubCategoryDto);
    Res.status(HttpStatus.OK).send(result);
  }

  @Delete('delete/:_id')
  @ApiOkResponse({ type: IModuleRes, description: 'Deleted Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async delete(@Param('_id') _id: string, @Res() Res: Response) {
    let result = await this.SubCategoryService.deleteModule(_id);
    Res.status(HttpStatus.OK).send(result);
  }

  @Get('find/:_id')
  @ApiOkResponse({ type: ISubCategoryfindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
    let result = await this.SubCategoryService.findOneModule(_id);
    Res.status(HttpStatus.OK).send(result);
  }

  @Get('all/:categoryId?')
  @ApiOkResponse({ type: ISubCategoryfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findMany(
    @Res() Res: Response,
    @Query('page') page: number,
    @Query('count') count: number,
    @Query('filter') filter?: string,
    @Param('categoryId') categoryId?: string,
  ) {
    let result = await this.SubCategoryService.findManyModule(page, count, categoryId, filter);
    Res.status(HttpStatus.OK).send(result);
  }

  @Get('active/:categoryId')
  @ApiOkResponse({ type: ISubCategoryfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findManyActive(
    @Res() Res: Response,
    @Query('page') page: number,
    @Query('count') count: number,
    @Param('categoryId') categoryId: string,
    @Query('filter') filter?: string,
  ) {
    let result = await this.SubCategoryService.findManyModule(page, count, categoryId, filter, true);
    Res.status(HttpStatus.OK).send(result);
  }

  @Get('text/:text')
  @ApiOkResponse({ type: ISubCategoryfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findbyText(
    @Param('text') text: string,
    @Query('page') page: number,
    @Query('count') count: number,
    @Res() Res: Response,
  ) {
    let result = await this.SubCategoryService.findManyTextModule(text, page, count);
    Res.status(HttpStatus.OK).send(result);
  }

  @Get('groupByCategory/:categoryId?')
  @ApiOkResponse({ type: ISubCategoryfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findManyByCategoryId(
    @Res() Res: Response,
    @Query('page') page: number,
    @Query('count') count: number,
    @Query('filter') filter?: string,
    @Param('categoryId') categoryId?: string,
  ) {
    let result = await this.SubCategoryService.findSubCategoryByCategoryGroup(page, count, filter, categoryId);
    Res.status(HttpStatus.OK).send(result);
  }

  @Get('drop-down/all/:categoryId')
  @ApiOkResponse({ type: ISubCategoryfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findAllDropDown(@Res() Res: Response, @Param('categoryId') categoryId) {
    let result = await this.SubCategoryService.findAllDropDownModule(categoryId);
    Res.status(HttpStatus.OK).send(result);
  }


  @Get('drop-down/all-active/:categoryId')
  @ApiOkResponse({ type: ISubCategoryfindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findAllActiveDropDownByCategory(
    @Query('page') page: number,
    @Query('count') count: number,
    @Res() Res: Response,
    @Param('categoryId') categoryId,
    @Query('search') search?: string
    ) {
    let result = await this.SubCategoryService.findManyDropDown(page, count, search, categoryId, true);
    Res.status(HttpStatus.OK).send(result);
  }
}
