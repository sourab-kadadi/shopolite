
import { Response, Request } from 'express';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { AddressService } from './address.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    Post,
    Put,
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
import { AddressCreateDto, AddressUpdateDto, IAddressfindOneByIdRes } from './address.dto';


@ApiTags('Address')
@Controller('address')
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)

export class AddressController {

    constructor(private Service: AddressService){}

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Post('create')
    @ApiBearerAuth()
    @ApiCreatedResponse({ type: IModuleRes, description: 'Created Successfully' })
    @ApiConflictResponse({ type: IModuleRes, description: 'Conflict' })
    @ApiBadRequestResponse({ type: IModuleRes, description: 'Bad Request' })
    @ApiRequestTimeoutResponse({ description: 'Time Out' })
    async Create(@Body() addressCreate: AddressCreateDto, @Req() Req: Request, @Res() Res: Response) {
      let user: any = Req.user;
      let result = await this.Service.createModule(addressCreate, user.userId);
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
      @Body() UpdateCartDto: AddressUpdateDto,
      @Param('documentId') documentId: string,
      @Req() Req: Request,
      @Res() Res: Response,
    ) {
      let user: any = Req.user;
      let result = await this.Service.updateModule(documentId, user.userId, UpdateCartDto);
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
      let user: any = Req.user;
      let result = await this.Service.deleteModule(documentId, user.userId);
      Res.status(HttpStatus.OK).send(result);
    }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get("find/:_id")
    @ApiBearerAuth()
    @ApiOkResponse({type: IAddressfindOneByIdRes,description: 'Found Successfully'})
    @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
    @ApiRequestTimeoutResponse({description: 'Time Out'})
    async findOneById(@Param('_id') _id: string, @Req() Req: Request, @Res() Res: Response) {
            let user: any = Req.user;
            let result = await this.Service.findOneModule(_id, user.userId);
            Res.status(HttpStatus.OK).send(result);
    }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get("find-all")
    @ApiBearerAuth()
    @ApiOkResponse({type: IAddressfindOneByIdRes,description: 'Found Successfully'})
    @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    @ApiInternalServerErrorResponse({type: IModuleRes,description: 'Internal Server Error'})
    @ApiRequestTimeoutResponse({description: 'Time Out'})
    async findManyById(@Req() Req: Request, @Res() Res: Response) {
            let user: any = Req.user;
            let result = await this.Service.findManyModule(user.userId);
            Res.status(HttpStatus.OK).send(result);
    }

}
