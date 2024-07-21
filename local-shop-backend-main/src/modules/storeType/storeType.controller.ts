import { Response } from 'express';
import { Controller, Post, Body, Res, HttpStatus, Put, Param, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { StoreTypeService } from './storeType.service';
import {
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiRequestTimeoutResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IModuleRes } from '../../common.service';
import { StoreTypeUpdateDto, StoreTypeCreateDto, IStoreTypefindOneByIdRes, IStoreTypefindManyRes } from './storeType.dto';
import { idproofType } from './storeType.static';
import { AuthGuard } from '@nestjs/passport';
@ApiTags('StoreType')
@Controller('store-type')
export class StoreTypeController {
  constructor(private StoreTypeService: StoreTypeService) {}

  @Post('create')
  @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async Create(@Body() StoreTypeDto: StoreTypeCreateDto, @Res() Res: Response) {
    try {
      let result = await this.StoreTypeService.createModule(StoreTypeDto);
      Res.status(HttpStatus.CREATED).send(result);
    } catch (error) {
      Res.status(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @Put('update/:_id')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async update(@Param('_id') _id: string, @Body() StoreTypeDto: StoreTypeUpdateDto, @Res() Res: Response) {
    try {
      let result = await this.StoreTypeService.updateModule(_id, StoreTypeDto);
      if (result.status == true) {
        Res.status(HttpStatus.OK).send(result);
      } else {
        Res.status(HttpStatus.BAD_REQUEST).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @Delete('delete/:_id')
  @ApiOkResponse({ type: IModuleRes, description: 'Deleted Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async delete(@Param('_id') _id: string, @Res() Res: Response) {
    try {
      let result = await this.StoreTypeService.deleteModule(_id);
      if (result.status == true) {
        Res.status(HttpStatus.OK).send(result);
      } else {
        Res.status(HttpStatus.BAD_REQUEST).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @Get('find/:_id')
  @ApiOkResponse({ type: IStoreTypefindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
    try {
      let result = await this.StoreTypeService.findOneModule(_id);
      if (result.status == true) {
        Res.status(HttpStatus.OK).send(result);
      } else {
        Res.status(HttpStatus.NOT_FOUND).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @Get('all')
  @ApiOkResponse({ type: IStoreTypefindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findMany(
    @Query('page') page: number,
    @Query('count') count: number,
    @Query('filter') filter: string,
    @Res() Res: Response,
  ) {
    try {
      let result = await this.StoreTypeService.findManyModule(page, count, filter);
      if (result.status == true) {
        Res.status(HttpStatus.OK).send(result);
      } else {
        Res.status(HttpStatus.NOT_FOUND).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @Get('active/all')
  @ApiOkResponse({ type: IStoreTypefindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findManyActive(
    @Query('page') page: number,
    @Query('count') count: number,
    @Query('filter') filter: string,
    @Res() Res: Response,
  ) {
    try {
      let result = await this.StoreTypeService.findManyModule(page, count, filter, true);
      if (result.status == true) {
        Res.status(HttpStatus.OK).send(result);
      } else {
        Res.status(HttpStatus.NOT_FOUND).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @Get('text/:text')
  @ApiOkResponse({ type: IStoreTypefindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findbyText(
    @Param('text') text: string,
    @Query('page') page: number,
    @Query('count') count: number,
    @Res() Res: Response,
  ) {
    try {
      let result = await this.StoreTypeService.findManyTextModule(text, page, count);
      if (result.status == true) {
        Res.status(HttpStatus.OK).send(result);
      } else {
        Res.status(HttpStatus.NOT_FOUND).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @Get('drop-down/all')
  @ApiOkResponse({ type: IStoreTypefindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findAllDropDown(@Res() Res: Response) {
    try {
      let result = await this.StoreTypeService.findAllDropDownModule();
      if (result.status == true) {
        Res.status(HttpStatus.OK).send(result);
      } else {
        Res.status(HttpStatus.NOT_FOUND).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @Get('storeType-list/drop-down/all')
  @ApiOkResponse({ type: IStoreTypefindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async lookUpSubStoreTypeDBFind(@Res() Res: Response) {
    try {
      let result = await this.StoreTypeService.lookUpSubStoreTypeDBFind();
      if (result.status == true) {
        Res.status(HttpStatus.OK).send(result);
      } else {
        Res.status(HttpStatus.NOT_FOUND).send(result);
      }
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  @Get('id-details')
  @ApiOkResponse({ type: IStoreTypefindManyRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async idDetails(@Res() Res: Response) {
    try {
      let result = idproofType;
      Res.status(HttpStatus.OK).send(result);
    } catch (error) {
      Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }
}
