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
import { CartService } from './cart.service';
import { CartfindOneByIdRes, CreateReqDto, UpdateCartDto } from './cart.dto';
import { CartStatus } from './cart.interface';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private Service: CartService) {}

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Post('create')
  @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async Create(@Body() CreateCartDto: CreateReqDto, @Req() Req: Request, @Res() Res: Response) {
    let user: any = Req.user;
    let result = await this.Service.createModule(user.userId, user.userName, CreateCartDto);
    Res.status(HttpStatus.CREATED).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Put('update/:addressId?')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async update(
    @Body() UpdateCartDto: UpdateCartDto,
    @Param('addressId') addressId: string,
    @Query('code') code: string,
    @Req() Req: Request,
    @Res() Res: Response,
  ) {
    let user: any = Req.user;
    let result = await this.Service.updateQuantityModule(user.userId, addressId || null, UpdateCartDto, code || null);
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
  @ApiOkResponse({ type: CartfindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
    let result = await this.Service.findOneModule(_id);
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('find-customer-cart/:storeId/:addressId?')
  @ApiOkResponse({ type: CartfindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findManyStoreProduct(@Param('storeId') storeId: string, @Param('addressId') addressId: string, @Query('code') code: string, @Req() Req: Request, @Res() Res: Response) {
    let user: any = Req.user;
    let result = await this.Service.findManyByCustomerId(user.userId, storeId, addressId || null, false, CartStatus.IN_CART, false, code);
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('total-cart-cost/:storeCustomId')
  @ApiOkResponse({ type: CartfindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findTotalCartCostByStoreCustomId(@Param('storeCustomId') storeCustomId: string, @Req() Req: Request, @Res() Res: Response) {
    let user: any = Req.user;
    let result = await this.Service.getTotalAmount(user.userId, storeCustomId);
    Res.status(HttpStatus.OK).send(result);
  }
}
