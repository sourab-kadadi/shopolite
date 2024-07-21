import { Response, Request } from 'express';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { CouponListService } from './coupon-list.service';
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
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiRequestTimeoutResponse,
    ApiTags,
  } from '@nestjs/swagger';
  import { IModuleRes } from '../../common.service';
import { CouponListCreateDto, CouponListUpdateDto, ICouponListfindManyRes, ICouponListfindOneByIdRes } from './coupon-list.dto';


@ApiTags('CouponList')
@Controller('coupon-list')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)

export class CouponListController {

    constructor(private Service: CouponListService){}

    // @UseGuards(AuthGuard('JWTaccessToken'))
    @Post('create')
    // @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async Create(@Body() couponListCreate: CouponListCreateDto, @Req() Req: Request, @Res() Res: Response) {
      let result = await this.Service.createModule(couponListCreate);
      Res.status(HttpStatus.CREATED).send(result);
    }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Put('update/:documentId')
    @ApiBearerAuth()
    @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async update(
      @Body() UpdateCartDto: CouponListUpdateDto,
      @Param('documentId') documentId: string,
      @Req() Req: Request,
      @Res() Res: Response,
    ) {
      let result = await this.Service.updateModule(documentId, UpdateCartDto);
      Res.status(HttpStatus.OK).send(result);
    }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Delete('delete/:documentId')
    @ApiBearerAuth()
    @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async deleteModule(
      @Param('documentId') documentId: string,
      @Req() Req: Request,
      @Res() Res: Response,
    ) {
      let result = await this.Service.deleteModule(documentId);
      Res.status(HttpStatus.OK).send(result);
    }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get("find/:_id")
    @ApiBearerAuth()
    @ApiOkResponse({type: ICouponListfindOneByIdRes,description: 'Found Successfully'})
    @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
    @ApiRequestTimeoutResponse({description: 'Time Out'})
    async findOneById(@Param('_id') _id: string, @Req() Req: Request, @Res() Res: Response) {
            let result = await this.Service.findOneModule(_id);
            Res.status(HttpStatus.OK).send(result);
    }

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('active/all')
    @ApiOkResponse({ type: ICouponListfindManyRes, description: 'Found Successfully' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findManyActive(
      @Query('page') page: number,
      @Query('count') count: number,
      @Query('search') filter: string,
      @Res() Res: Response,
      @Req() Req: Request,
    ) {
      try {
        let user :any = Req.user;
        let result = await this.Service.findManyModule(page, count, filter, true, user.storeCustomId);
        if (result.status == true) {
          Res.status(HttpStatus.OK).send(result);
        } else {
          Res.status(HttpStatus.NOT_FOUND).send(result);
        }
      } catch (error) {
        Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
      }
    }

}