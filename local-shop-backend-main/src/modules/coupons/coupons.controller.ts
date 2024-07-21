import { Response, Request } from 'express';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { CouponsService } from './coupons.service';
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
import { CouponsCreateDto, CouponsUpdateDto, ICouponsfindOneByIdRes, ProviderCouponsCreateDto } from './coupons.dto';


@ApiTags('Coupons')
@Controller('coupons')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)

export class CouponsController {

    constructor(private Service: CouponsService){}

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Post('create')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async Create(@Body() couponsCreate: CouponsCreateDto, @Req() Req: Request, @Res() Res: Response) {
      let result = await this.Service.createModule(couponsCreate);
      Res.status(HttpStatus.CREATED).send(result);
    }

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Post('create/:couponListId')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async ProviderCouponCreate(@Param('couponListId') couponListId: string, @Body() couponsCreate: ProviderCouponsCreateDto, @Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      let result = await this.Service.createProviderCouponModule(couponListId, user.storeCustomId, couponsCreate);
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
      @Body() UpdateCartDto: CouponsUpdateDto,
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
    @ApiOkResponse({type: ICouponsfindOneByIdRes,description: 'Found Successfully'})
    @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
    @ApiRequestTimeoutResponse({description: 'Time Out'})
    async findOneById(@Param('_id') _id: string, @Req() Req: Request, @Res() Res: Response) {
            let result = await this.Service.findOneModule(_id);
            Res.status(HttpStatus.OK).send(result);
    }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get("provider-find-all")
    @ApiBearerAuth()
    @ApiOkResponse({type: ICouponsfindOneByIdRes,description: 'Found Successfully'})
    @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
    @ApiRequestTimeoutResponse({description: 'Time Out'})
    async findManyById(
        @Req() Req: Request, 
        @Res() Res: Response,
        @Query('page') page: number,
        @Query('count') count: number,
        @Query('search') filter: string,
        @Query('status') status: boolean,
        ) {
            let user :any = Req.user;
            let result = await this.Service.findManyModule(page, count, user.storeCustomId,  filter, status);
            Res.status(HttpStatus.OK).send(result);
    }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get("customer-find-all/:storeCustomId")
    @ApiBearerAuth()
    @ApiOkResponse({type: ICouponsfindOneByIdRes,description: 'Found Successfully'})
    @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
    @ApiRequestTimeoutResponse({description: 'Time Out'})
    async activeCouponListCustomer(
        @Req() Req: Request, 
        @Res() Res: Response,
        @Param('storeCustomId') storeCustomId: string,
        ) {
            let result = await this.Service.activeCouponListCustomer(storeCustomId);
            Res.status(HttpStatus.OK).send(result);
    }

}