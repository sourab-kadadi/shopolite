import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { LoginDto } from '../users/user.dto';
import { Response, Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly UserService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'psw',
      passReqToCallback: true
    });
  }

  async validate(req: Request, email: string, psw: string): Promise<any> {
    try {
    let loginObj: LoginDto = {
      email: email,
      psw: psw
    }
     const user = await this.UserService.verifyUser(loginObj, 'ADMIN', req);
    if (!user) {
      throw new HttpException("Invalid OTP! Please enter correct OTP", HttpStatus.BAD_REQUEST);

    }
    return user;
  }
 catch (error) {
  throw new HttpException("Invalid OTP! Please enter correct OTP", HttpStatus.BAD_REQUEST);

}
  }
}