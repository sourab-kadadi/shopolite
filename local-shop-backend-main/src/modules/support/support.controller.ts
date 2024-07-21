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
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { IModuleRes } from '../../common.service';
import { SupportService } from './support.service';
import { clientSubmitDto, SupportfindOneByIdRes, adminSubmitDto, adminUpdateDto, ISupportfindManyRes } from './support.dto';

@ApiTags('Support')
@Controller('support')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class SupportController {

    constructor(private Service: SupportService) {

    }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Post('create')
  @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async Create(@Body() CreateSupportDto: any, 
    @Req() Req: Request,
    @Res() Res: Response,
  ) {
    let user: any = Req.user;
    let result = await this.Service.createModule(CreateSupportDto, user);
    Res.status(HttpStatus.CREATED).send(result);
  }

//   @UseGuards(AuthGuard('JWTaccessToken'))
//   @Post('create/admin')
//   @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
//   @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
//   @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
//   @ApiRequestTimeoutResponse({ description: 'Time Out' })
//   async Create(@Body() CreateSupportDto: adminSubmitDto, @Res() Res: Response) {
//     let result = await this.Service.updateModule(CreateSupportDto);
//     Res.status(HttpStatus.CREATED).send(result);
//   }

//   @UseGuards(AuthGuard('JWTaccessToken'))
//   @Put('update/:_id')
//   @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
//   @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
//   @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
//   @ApiRequestTimeoutResponse({ description: 'Time Out' })
//   async update(@Param('_id') _id: string, @Body() UpdateSupportDto: adminUpdateDto, @Res() Res: Response) {
//     let result = await this.Service.updateModule(_id, UpdateSupportDto);
//     Res.status(HttpStatus.OK).send(result);
//   }

//   @UseGuards(AuthGuard('JWTaccessToken'))
//   @Delete('delete/:_id')
//   @ApiOkResponse({ type: IModuleRes, description: 'Deleted Successfully' })
//   @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
//   @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
//   @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
//   @ApiRequestTimeoutResponse({ description: 'Time Out' })
//   async delete(@Param('_id') _id: string, @Res() Res: Response) {
//     let result = await this.Service.deleteModule(_id);
//     Res.status(HttpStatus.OK).send(result);
//   }

//   @UseGuards(AuthGuard('JWTaccessToken'))
//   @Get('find/:_id')
//   @ApiOkResponse({ type: SupportfindOneByIdRes, description: 'Found Successfully' })
//   @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
//   @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
//   @ApiRequestTimeoutResponse({ description: 'Time Out' })
//   async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
//     let result = await this.Service.findOneModule(_id);
//     Res.status(HttpStatus.OK).send(result);
//   }


//   @UseGuards(AuthGuard('JWTaccessToken'))
//   @Get('all')
//   @ApiOkResponse({ type: ISupportfindManyRes, description: 'Found Successfully' })
//   @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
//   @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
//   @ApiRequestTimeoutResponse({ description: 'Time Out' })
//   async findManyActive(
//     @Req() Req: Request,
//     @Res() Res: Response,
//     @Query('page') page: number,
//     @Query('count') count: number,
//     @Query('search') search?: string,
//     @Query('status') status?: boolean,
//   ) {
//     let user: any = Req.user;
//     let result = await this.Service.findSupportAll(page, count, user.userId, search, status);
//     Res.status(HttpStatus.OK).send(result);
//   }
}
