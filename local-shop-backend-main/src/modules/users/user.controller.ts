import { Controller, Get, Post, Body, HttpStatus, Res, UseGuards, Req, UnauthorizedException, Put, UseFilters, Param } from '@nestjs/common';
import { UserDto, LoginDto, IRenewRefreshToken, UpdateUserDto, UserType, ILoginTokenPayload, UserDetails, PasswordUserDto, FCMtoken } from './user.dto';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { LocalAuthGuard } from '../Auth/local.auth.guard';
import { RedisService } from '../redis/redis.service';
import { LocalClientAuthGuard } from '../Auth/local-client.auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { AllExceptionsFilter } from '../../exception-handler/exception.filter';
import { HttpExceptionFilter } from '../../exception-handler/http-exception.filter';
import { MongoExceptionFilter } from '../../exception-handler/mongo-exception.filter';
import { LoingWithOtp } from '../otp/otp.dto';
import { ApiTags } from '@nestjs/swagger/dist';

@ApiTags('Auth')
@Controller("auth")
@UseFilters(AllExceptionsFilter, HttpExceptionFilter, MongoExceptionFilter)
export class UserController {

    constructor(private readonly UserService: UserService, public RedisService: RedisService) { }

    @UseGuards(LocalAuthGuard)
    @Post("/login")
    async login(@Body() LoginReq: LoingWithOtp, @Res() Res: Response, @Req() Req: Request) {
        try {
            let result = Req.user as ILoginTokenPayload;
            let token = {
                refresh_token: result.refreshToken.token,
                access_token: result.accessToken.token
            };
            Res.setHeader('Set-Cookie', [result.accessToken.cookies, result.refreshToken.cookies]);
            Res.status(HttpStatus.OK).send(token);
        } catch (error) {
            Res.status(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
    }


    @UseGuards(LocalClientAuthGuard)
    @Post("/store/login")
    async loginStore(@Body() LoginReq: LoingWithOtp, @Res() Res: Response, @Req() Req: Request) {
        try {
            let result = Req.user as ILoginTokenPayload;
            let token = {
                refresh_token: result.refreshToken.token,
                access_token: result.accessToken.token
            };
            Res.setHeader('Set-Cookie', [result.accessToken.cookies, result.refreshToken.cookies]);
            Res.status(HttpStatus.OK).send(token);
        } catch (error) {
            console.log(error);
            Res.status(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
    }

    @UseGuards(LocalClientAuthGuard)
    @Post("/customer/login")
    async loginCustomer(@Body() LoginReq: LoingWithOtp, @Res() Res: Response, @Req() Req: Request) {
        try {
            let result = Req.user as ILoginTokenPayload;
            let token = {
                refresh_token: result.refreshToken.token,
                access_token: result.accessToken.token
            };
            Res.setHeader('Set-Cookie', [result.accessToken.cookies, result.refreshToken.cookies]);
            Res.status(HttpStatus.OK).send(token);
        } catch (error) {
            console.log(error);
            Res.status(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
    }

    // @UseGuards(AuthGuard('JWTaccessToken'))
    @Post("/signUp")
    // @Roles(Role.ADMIN)
    async signUp(@Body() UserDto: PasswordUserDto, @Res() Res: Response) {
        let result = await this.UserService.CreateUser(UserDto);
        Res.status(HttpStatus.ACCEPTED).send(result);
    }

    @Post("/store/otp")
    async storeSignInOrLogin(@Body() UserDto: UserDto, @Res() Res: Response) {
        try {
            let result = await this.UserService.loginOrSignUpMobileNumber(UserDto, UserType.STORE);
            Res.status(HttpStatus.ACCEPTED).send(result);
        } catch (error) {
            console.log(error);
        }
    }

    @Post("/otp")
    async customerSignInOrLogin(@Body() UserDto: UserDto, @Res() Res: Response) {
        let result = await this.UserService.loginOrSignUpMobileNumber(UserDto, UserType.CUSTOMER);
        Res.status(HttpStatus.ACCEPTED).send(result);
    }

    @Post("/renew-token")
    async renewRefreshToken(@Body() renewToken: IRenewRefreshToken, @Res() Res: Response) {
        try {
            let result = await this.RedisService.getValueFromRefreshToken(renewToken.refreshToken);
            if (result) {
                result = JSON.parse(result);
                let accessToken = await this.UserService.generateAccessToken(result.payload);
                await this.UserService.updateActiveTime(result.userId);
                Res.status(HttpStatus.ACCEPTED).send({ access_token: accessToken });
            } else {
                throw new UnauthorizedException();
            }
        } catch (error) {
            if (error.status) {
                Res.status(error.status).send(error.response);
            } else {
                Res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
            }
        }
    }

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Put("/candidate/update")
    async updateUser(@Body() UpdateUser: UpdateUserDto, @Req() Req: Request, @Res() Res: Response) {
        try {
            let user: any = Req.user;
            let result = await this.UserService.updateUser(user.userId, UpdateUser);
            Res.status(HttpStatus.ACCEPTED).send(result);
        } catch (error) {
            Res.status(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
    }

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Put("/partner/update")
    async updateCompany(@Body() UpdateUser: UpdateUserDto, @Req() Req: Request, @Res() Res: Response) {
        try {
            let user: any = Req.user;
            let result = await this.UserService.updateUser(user.userId, UpdateUser);
            Res.status(HttpStatus.ACCEPTED).send(result);
        } catch (error) {
            Res.status(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
    }



    @UseGuards(AuthGuard('JWTaccessToken'))
    @Put("/customer/update")
    async updateCustomerDetails(@Body() UpdateUser: UpdateUserDto, @Req() Req: Request, @Res() Res: Response) {
        try {
            let user: any = Req.user;
            let result = await this.UserService.updateCustomerDetails(user.userId, UpdateUser);
            Res.status(HttpStatus.ACCEPTED).send(result);
        } catch (error) {
            Res.status(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
    }

    @UseGuards(AuthGuard('JWTaccessToken'))
    @Get("/user-profile")
    async userById(@Req() Req: Request, @Res() Res: Response) {
        let user: any = Req.user;
        let result = await this.UserService.findUserById(user.userId);
        Res.status(HttpStatus.ACCEPTED).send(result);
    }

    //     // admin
    //     // @UseGuards(AuthGuard('JWTaccessToken'))
    //     @Get("/admin-find-user/:userId")
    //     async userByIdForAdmin(@Req() Req: Request, @Res() Res: Response, @Param('userId') userId: any) {
    //         let result = await this.UserService.findUserById(userId);
    //         Res.status(HttpStatus.ACCEPTED).send(result);
    //     }


    @UseGuards(AuthGuard('JWTaccessToken'))
    @Put("/fcm-token")
    async updateFCMToken(@Body() fcmToken: FCMtoken, @Req() Req: Request, @Res() Res: Response) {
        try {
            let user: any = Req.user;
            let result = await this.UserService.updateFcmToken(user.userId, fcmToken);
            Res.status(HttpStatus.ACCEPTED).send(result);
        } catch (error) {
            Res.status(error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
    }

    @Get("/version-check")
    async versionCheck(@Req() Req: Request, @Res() Res: Response) {
        Res.status(HttpStatus.ACCEPTED).send({
            android: {
                version: "11.0",
                header: "Update Application",
                message: "Major Update Available please install 11.0",
            },
            ios: {
                version: "1.2.0",
                header: "Update Application",
                message: "Major Update Available please install 1.2.0"
            }
        });
    }


    @Get("/store-version-check")
    async storeVersionCheck(@Req() Req: Request, @Res() Res: Response) {
        Res.status(HttpStatus.ACCEPTED).send({
            android: {
                version: "2.0",
                header: "Update Application",
                message: "Major Update Available please install 2.0",
            },
            ios: {
                version: "1.2.0",
                header: "Update Application",
                message: "Major Update Available please install 1.2.0" 
            }
        });
     }
}