import { Response, Request } from 'express';
import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Put,
  Param,
  Delete,
  Get,
  Query,
  UseFilters,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StoreDto, StoreUpdateDto, StorefindOneByIdRes, storeOnlineStatusDto } from './store.dto';
import { StoreService } from './store.service';
import {
  ApiResponse,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiRequestTimeoutResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { IModuleRes } from '../../common.service';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../users/user.service';
@ApiTags('Store')
@Controller('store')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class StoreController {
  constructor(private StoreService: StoreService, private UserService: UserService) {}

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Post('/create')
  @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async Create(@Body() StoreDto: StoreDto, @Req() Req: Request, @Res() Res: Response) {
    let user: any = Req.user;
    StoreDto['userId'] = user.userId;
    let result = await this.StoreService.createModule(StoreDto);
    if (result.status) {
      let data = await this.UserService.loginStore(user.userId, Req);
      let token = {
        refresh_token: data.refreshToken.token,
        access_token: data.accessToken.token,
      };
      Res.setHeader('Set-Cookie', [data.accessToken.cookies, data.refreshToken.cookies]);
      Res.status(HttpStatus.CREATED).send(token);
    }
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Put('/update')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async update(@Req() Req: Request, @Body() StoreDto: StoreUpdateDto, @Res() Res: Response) {
    try {
      let user: any = Req.user;
      StoreDto['userId'] = user.userId;
      let result = await this.StoreService.updateModule(user.storeId, StoreDto);
      Res.status(HttpStatus.OK).send(result);
    } catch (error) {
      console.log(error);
    }
  }

    //admin
    // @UseGuards(AuthGuard('JWTaccessToken'))
    @Put('/admin-update/:storeId')
    @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async updateAdmin(@Req() Req: Request, @Param('storeId') storeId:any,  @Body() StoreDto: StoreUpdateDto, @Res() Res: Response) {
      try {
        let result = await this.StoreService.updateModule(storeId, StoreDto);
        Res.status(HttpStatus.OK).send(result);
      } catch (error) {
        console.log(error);
      }
    }

    
  // @UseGuards(AuthGuard('JWTaccessToken'))
  // @Delete("/delete/:_id")
  // @ApiOkResponse({type: IModuleRes,description: 'Deleted Successfully'})
  // @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
  // @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
  // @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
  // @ApiRequestTimeoutResponse({description: 'Time Out'})
  // async delete(@Param('_id') _id: string, @Res() Res: Response) {
  //         let result = await this.StoreService.deleteModule(_id);
  //         Res.status(HttpStatus.OK).send(result);
  // }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('find-my-store')
  @ApiOkResponse({ type: StorefindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneMyStore(@Req() Req: Request, @Res() Res: Response) {
    let user: any = Req.user;
    const id = user.storeId;
    let result = await this.StoreService.findOneModule(id);
    Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('find/:_id')
  @ApiOkResponse({ type: StorefindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneById(@Param('_id') _id: string, @Res() Res: Response) {
    let result = await this.StoreService.findOneModule(_id);
    Res.status(HttpStatus.OK).send(result);
  }

//admin
  // @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('admin-find/:_id')
  @ApiOkResponse({ type: StorefindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findOneByIdAdmin(@Param('_id') _id: string, @Res() Res: Response, @Req() Req: Request) {

let userRole = Req.user;
console.log(userRole)
    let result = await this.StoreService.findOneModule(_id);
    Res.status(HttpStatus.OK).send(result);
  }

  @Get('find-by-location')
  @ApiOkResponse({ type: StorefindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async findManyByLocation(
    @Res() Res: Response,
    @Query('page') page: number,
    @Query('count') count: number,
    @Query('businessCategoryId') businessCategoryId: string,
    @Query('place') place: string,
    @Query('state') state: string,
    @Query('lat') lat: number,
    @Query('long') long: number,
    @Query('search') search: string,
  ) {
    let result = await this.StoreService.findAllStoreByLocation(
      page,
      count,
      businessCategoryId,
      place || null,
      state || null,
      lat || null,
      long || null,
      search || null,
      true,
    );
    Res.status(HttpStatus.OK).send(result);
  }


  @Get('store-info/:storeCustomId')
  @ApiOkResponse({ type: StorefindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async getStoreInformation(
    @Res() Res: Response,
    @Param('storeCustomId') storeCustomId : string,
    @Query('lat') lat: number,
    @Query('long') long: number
  ) {
    let result = await this.StoreService.getStoreInformation(
      storeCustomId,
      lat || null,
      long || null,
    );
    Res.status(HttpStatus.OK).send(result);
  }

  // @Post("/location")
  // @ApiOkResponse({type: StorefindOneByIdRes,description: 'Found Successfully'})
  // @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
  // @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
  // @ApiRequestTimeoutResponse({description: 'Time Out'})
  // async findByGeo(@Query('latitued') latitued: number, @Query('logitude') logitude: number, @Res() Res: Response) {
  //     try {
  //         let result = await this.StoreService.findByGeoModule([Number(latitued), Number(logitude)]);
  //         if(result.status == true) {
  //         Res.status(HttpStatus.OK).send(result);
  //         } else {
  //         Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
  //         }
  //        } catch (error) {
  //         Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  //        }
  // }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('/store-category')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async storeCategory(@Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      StoreDto['userId'] = user.userId;
      let result = await this.StoreService.getStoreCategoryList(user.storeId);
      Res.status(HttpStatus.OK).send(result);
  }

  @UseGuards(AuthGuard('JWTaccessToken'))
  @Put('/store-online-toggle')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async storeOnlineOfflineToggle(@Req() Req: Request, @Body() storeOnlineStatus: storeOnlineStatusDto, @Res() Res: Response) {
    try {
      let user: any = Req.user;
      let result = await this.StoreService.storeOnlineOfflineToggle(user.storeId, storeOnlineStatus);
      Res.status(HttpStatus.OK).send(result);
    } catch (error) {
      console.log(error);
    }
  }

  //admin
  // @UseGuards(AuthGuard('JWTaccessToken'))
  @Put('/store-online-toggle-admin/:storeId')
  @ApiOkResponse({ type: IModuleRes, description: 'Update Successfully' })
  @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  async storeOnlineOfflineToggleAdmin(@Req() Req: Request, @Param('storeId') storeId : any, @Body() storeOnlineStatus: storeOnlineStatusDto, @Res() Res: Response) {
    try {
      console.log()
      let result = await this.StoreService.storeOnlineOfflineToggle(storeId, storeOnlineStatus);
      Res.status(HttpStatus.OK).send(result);
    } catch (error) {
      console.log(error);
    }
  }

  //admin
  // @UseGuards(AuthGuard('JWTaccessToken'))
  @Get('find-all')
  @ApiOkResponse({ type: StorefindOneByIdRes, description: 'Found Successfully' })
  @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ type: IModuleRes, description: 'Internal Server Error' })
  @ApiRequestTimeoutResponse({ description: 'Time Out' })
  @ApiQuery({ name: 'businessCategoryId', required: false })
  @ApiQuery({ name: 'place', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'storeOnline', required: false })
  @ApiQuery({ name: 'status', required: false })
  async findManyModule(
    @Req() Req: Request,
    @Res() Res: Response,
    @Query('page') page: number,
    @Query('count') count: number,
    @Query('businessCategoryId') businessCategoryId: string,
    @Query('place') place: string,
    @Query('search') search: string,
    @Query('storeOnline') storeOnline: boolean,
    @Query('status') status: boolean,
    ) {
    let result = await this.StoreService.findAllStore(page, count, businessCategoryId, place || null,
      search || null, storeOnline, status);
    Res.status(HttpStatus.OK).send(result);
  }


}
