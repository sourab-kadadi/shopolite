import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { LoginDto, LoginOtpDto } from '../users/user.dto';
import { OtpService } from "../otp/otp.service";
import { Response, Request } from 'express';

@Injectable()
export class LocalClientStrategy extends PassportStrategy(Strategy, 'local-client') {
  constructor(private readonly OtpService: OtpService, private readonly userService: UserService) {
    super({
      usernameField: 'otpKey',
      passwordField: 'otp',
      passReqToCallback: true
    });
  }

  async validate( req: Request, otpKey: string, otp: string): Promise<any> {
    try {
    const user = await this.OtpService.verifyOtp(otpKey, otp);
    if (user && user.data.verified) {
      const loginStore = await this.userService.loginStore(user.data.userId, req);
      console.log(loginStore);
      return loginStore;
    }
    throw new HttpException("Invalid OTP! Please enter correct OTP", HttpStatus.BAD_REQUEST);
  }
 catch (error) {
   console.log(error);
   throw new HttpException("Invalid OTP! Please enter correct OTP", HttpStatus.BAD_REQUEST);

}
}
}