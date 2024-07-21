import { Response, Request } from 'express';
import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiRequestTimeoutResponse, ApiTags } from '@nestjs/swagger';
import { IModuleRes } from '../../common.service';
import { OtpService } from './otp.service';
import { OtpDto } from './otp.dto';

@ApiTags('OTP')
@Controller('otp')
export class OtpController {
    constructor(private otpService: OtpService) {}

    @Post("/create")
    @ApiCreatedResponse({type: IModuleRes,description: 'Created Successfully'})
    @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
    @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    @ApiRequestTimeoutResponse({description: 'Time Out'})
    async Create(@Body() OtpDto: OtpDto, @Res() Res: Response) {
        try {
            let result = await this.otpService.createModule(OtpDto);
            if(result.status == true) {
            Res.status(HttpStatus.CREATED).send(result);
            } else {
            Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
            }
           } catch (error) {
            Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
           }
    }

    @Get("/resend/:otpKey")
    @ApiCreatedResponse({type: IModuleRes,description: 'Created Successfully'})
    @ApiConflictResponse({type: IModuleRes,description: 'Conflict'})
    @ApiBadRequestResponse({type: IModuleRes,description: 'Bad Request'})
    @ApiRequestTimeoutResponse({description: 'Time Out'})
    async ResendOtp(@Param('otpKey') otpKey: string, @Res() Res: Response) {
        try {
            let result = await this.otpService.resendOtp(otpKey);
            if(result.status == true) {
            Res.status(HttpStatus.CREATED).send(result);
            } else {
            Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(result);
            }
           } catch (error) {
            Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
           }
    }
}

