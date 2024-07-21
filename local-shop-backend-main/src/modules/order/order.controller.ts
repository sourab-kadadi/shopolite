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
  ApiBearerAuth,
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
import { OrderService } from './order.service';
import { CreateOrder } from './order.dto';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/roles.enum';
import { OrderStatus, OrderUpdate } from './order.interface';

@ApiTags('Order')
@Controller('order')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class OrderController {
    constructor(private Service: OrderService) {}

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('/item/:storeCustomId/:addressId')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async Create(@Param('storeCustomId') storeCustomId: string, @Param('addressId') addressId: string, @Query('note') note: string, @Query('code') code: string, @Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      let result = await this.Service.createModule(user.userId, user.name, storeCustomId, addressId, note, code);
      Res.status(HttpStatus.CREATED).send(result);
    }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('/customer')
    @ApiBearerAuth()
    @Roles(Role.CUSTOMER)
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async GetAllItemCustomer(@Query('page') page: number, @Query('count') count: number,@Query('search') search: string, @Query('fromDate') fromDate: Date, @Query('toDate') toDate: Date, @Query('orderStatus') orderStatus: string, @Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      let result = await this.Service.findManyCustomer(user.userId, page, count, search || null, fromDate || null, toDate || null, orderStatus || null);
      Res.status(HttpStatus.OK).send(result);
    }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Roles(Role.STORE)
    @Get('/store')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async GetAllItemMember(@Query('page') page: number, @Query('count') count: number,@Query('search') search: string, @Query('fromDate') fromDate: Date, @Query('toDate') toDate: Date, @Query('orderStatus') orderStatus: string, @Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      if (!user.storeId) {
        return Res.status(HttpStatus.BAD_REQUEST).send();
      }
      let result = await this.Service.findMany(user.storeId, page, count, search || null, fromDate || null, toDate || null, orderStatus || null);
      Res.status(HttpStatus.OK).send(result);
    }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('/details/:documentId')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async GetOrderDetails(@Param('documentId') documentId: string, @Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      let result = await this.Service.findMyOrder(user.userId, documentId, user.userType);
      Res.status(HttpStatus.OK).send(result);
    }

    // Need to Remove Duplicate
    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('/details/store/:documentId')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async GetOrderDetailsForStore(@Param('documentId') documentId: string, @Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      let result = await this.Service.findMyOrder(user.storeId, documentId, user.userType);
      Res.status(HttpStatus.OK).send(result);
    }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('/ready-to-delivered/:documentId')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async ReadyToDelivere(@Param('documentId') documentId: string, @Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      let result = await this.Service.updateStatus(user.storeId, documentId, OrderStatus.ACCEPT, OrderStatus.READY_TO_DELIVER);
      Res.status(HttpStatus.OK).send(result);
    }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('/delivered/:documentId')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async delivered(@Param('documentId') documentId: string, @Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      let result = await this.Service.updateStatus(user.storeId, documentId, OrderStatus.READY_TO_DELIVER, OrderStatus.DELIVERED);
      Res.status(HttpStatus.OK).send(result);
    }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('/return/:documentId')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async return(@Param('documentId') documentId: string, @Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      let result = await this.Service.updateReturn(user.userId, documentId, OrderStatus.DELIVERED, OrderStatus.RETURN);
      Res.status(HttpStatus.OK).send(result);
    }

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('/reject/:documentId')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async reject(@Param('documentId') documentId: string, @Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      let result = await this.Service.updateStatus(user.storeId, documentId, OrderStatus.PENDING, OrderStatus.REJECT);
      Res.status(HttpStatus.OK).send(result);
    }

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('/accept/:documentId')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async accept(@Param('documentId') documentId: string, @Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      let result = await this.Service.updateStatus(user.storeId, documentId, OrderStatus.PENDING, OrderStatus.ACCEPT);
      Res.status(HttpStatus.OK).send(result);
    }

    // @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('/filter-order-status')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Found Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async customerOrderStatus(@Res() Res: Response) {
      const listItems: any[] = Object.keys(OrderStatus).map((key,index) => ({
        id: index,
        value: OrderStatus[key as keyof typeof OrderStatus],
        label: key
       }));
      Res.status(HttpStatus.OK).send({status: true, data: listItems});
    }

    /// ADMIN ////
    // @UseGuards(AuthGuard('JWTaccessToken'))
    // @Roles(Role.ADMIN)
    @Get('/strict/details/:documentId')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async findOrderDetailsStrict(@Param('documentId') documentId: string, @Req() Req: Request, @Res() Res: Response) {
      let result = await this.Service.findOrderDetailsStrict(documentId);
      Res.status(HttpStatus.OK).send(result);
    }

    /// ADMIN ////
    // @UseGuards(AuthGuard('JWTaccessToken'))
    @Get('/strict/list')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async GetAllItem(@Query('page') page: number, @Query('count') count: number,@Query('search') search: string, @Query('fromDate') fromDate: Date, @Query('toDate') toDate: Date, @Query('orderStatus') orderStatus: string, @Req() Req: Request, @Res() Res: Response, @Query('storeId') storeId: string) {
      let result = await this.Service.findMany(storeId || null, page, count, search || null, fromDate || null, toDate || null, orderStatus || null);
      Res.status(HttpStatus.OK).send(result);
    }

    /// ADMIN ////
    // @UseGuards(AuthGuard('JWTaccessToken'))
    // @Roles(Role.ADMIN)
    @Put('/strict/update-status/:documentId')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async updateStatus(@Body() body: OrderUpdate, @Param('documentId') documentId: string, @Req() Req: Request, @Res() Res: Response) {
      let result = await this.Service.updateStatusStrict(documentId, body.orderStatus);
      Res.status(HttpStatus.OK).send(result);
    }
    

}
