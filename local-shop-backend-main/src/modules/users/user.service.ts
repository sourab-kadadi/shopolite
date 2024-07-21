import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto, LoginDto, ILoginTokenPayload, ILoginPayload, UpdateUserDto, UserType, ILoginStorePayload, UserDetails, PasswordUserDto, FCMtoken } from './user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IjwtTokenSecrate } from 'src/config/configration.dto';
import { ProfileService } from '../profile/profile.service';
import { OtpService } from '../otp/otp.service';
import { IDataModuleRes } from '../../common.service';
import { OtpRes } from '../otp/otp.dto';
import { RedisService } from '../redis/redis.service';
import * as mongoose from 'mongoose';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private profileService: ProfileService,
    private otpService: OtpService, private RedisService: RedisService
  ) {}

  async generateHash(password: string): Promise<string> {
    let salt = bcrypt.genSaltSync(12);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  async CreateUser(UserDto: PasswordUserDto): Promise<any> {
    try {
      const session = await this.userModel.db.startSession();
      session.startTransaction();
      try {
        UserDto.psw = await this.generateHash(UserDto.psw);
        const createUser = new this.userModel(UserDto);
        let result = await createUser.save({session});
        // console.log(result);
        // UserDto.profile["userId"] = result._id;
        // await this.profileService.createModule(UserDto.profile);
        await session.commitTransaction();
        return {message: "Registerd Successfully"};
      } catch (error) {
        console.log("ERROROR", error);
        await session.abortTransaction();
        if (error.code && error.code == 11000) {
          let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
          let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
          throw new HttpException(
            (DuplicateArrayToString == 'phoneNo' ? 'Phone Number' : 'Email')  + ' Aleary Exist',
            HttpStatus.CONFLICT,
          );
        } else {
           throw error;
        }
      } finally {
        session.endSession();
      }
    } catch(error) {
      throw error;
    }

  }


  async   loginOrSignUpMobileNumber(UserDto: UserDto, userType: UserType): Promise<any> {
    try {
      let userId = "";
        const findPhone = await this.userModel.findOne({phoneNo: UserDto.phoneNo, userType: userType});
        if (!findPhone) {
          let user = {
            phoneNo: UserDto.phoneNo, userType: userType
          }
          const createUser = new this.userModel(user);
          let result = await createUser.save();
          userId = result._id;
        } else {
          userId = findPhone._id;
        }
        let otp: IDataModuleRes<OtpRes> = await this.otpService.createModule({userId, phoneNo: UserDto.phoneNo});
        return otp;
    } catch(error) {
      if (error.code && error.code == 11000) {
        let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
        let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
        throw new HttpException(
          (DuplicateArrayToString == 'phoneNo' ? 'Phone Number' : 'Email')  + ' Aleary Exist',
          HttpStatus.CONFLICT,
        );
    }
    throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  async verifyUser(LoginDto: LoginDto, UserType: string, req: any): Promise<any> {
    try {
      let user = await this.userModel.findOne({ email: LoginDto.email, userType:  UserType});
      let verify = await this.verifyBcrypt(LoginDto.psw, user.psw);
      if (user && verify) {
        let payload = {
          email: user.email,
          userId: user._id,
          userType: user.userType,
          iat: new Date().getTime(),
        };
        let accessToken = await this.generateAccessToken(payload);
        let accessCookies = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=Session`;
        let refreshToken = await this.generateRefreshToken(payload);
        let refreshCookies = `RefreshToken=${refreshToken}; Path=/; Max-Age=Session`;
        await this.RedisService.createRefreshToken(refreshToken, payload, req);
        return {
          accessToken:{
            cookies: accessCookies,
            token: accessToken
          },
          refreshToken: {
            cookies: refreshCookies,
            token: refreshToken
          },
          payload: payload
        };
      }
      return null;
    } catch (error) {
       throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async updateActiveTime(userId: string): Promise<any> {
    try {
      let user = await this.userModel.update({ userId: userId }, {$set: {lastActiveDate: new Date()}});
      if (user) {
        // let userObj = {
        //   email: user.email,
        //   userId: user._id,
        //   userName: user.userName,
        // };
        return user;
      }
      return null;
    } catch (error) {
       throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyBcrypt(psw: string, hash: string): Promise<boolean> {
    return bcrypt.compareSync(psw, hash);
  }

  async loginStore(userId: any, req: any): Promise<ILoginTokenPayload> {
    let aggregate: any[] = await this.userModel.aggregate([
      { $match: { _id:  mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'stores',
          localField: '_id',
          foreignField: 'userId',
          as: 'store',
        },
      },
      { $unwind: { path: '$store', preserveNullAndEmptyArrays: true } },
    ]);
    console.log(aggregate[0]);
    const payload: ILoginStorePayload  = {
      name: aggregate && aggregate[0].store && aggregate[0].store.name ? aggregate[0].store.name : null,
      phoneNo: aggregate[0].phoneNo,
      userId: aggregate[0]._id,
      storeId:  aggregate[0].store && aggregate[0].store._id ?  aggregate[0].store._id : null,
      storeName: aggregate[0].store && aggregate[0].store.businessName ?  aggregate[0].store.businessName : null,
      businessCategoryId:  aggregate[0].store && aggregate[0].store.businessCategoryId ?  aggregate[0].store.businessCategoryId : null,
      userType: aggregate[0].userType,
      iat: new Date().getTime(),
      storeCustomId: aggregate[0].store && aggregate[0].store.storeCustomId ?  aggregate[0].store.storeCustomId : null,
    };
    let accessToken = await this.generateAccessToken(payload);
    let accessCookies = `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=Session`;
    let refreshToken = await this.generateRefreshToken(payload);
    let refreshCookies = `RefreshToken=${refreshToken}; Path=/; Max-Age=Session`;
    await this.RedisService.createRefreshToken(refreshToken, payload, req);
    return {
      accessToken:{
        cookies: accessCookies,
        token: accessToken
      },
      refreshToken: {
        cookies: refreshCookies,
        token: refreshToken
      },
      payload: payload
    };
  }

  async generateRefreshToken(payload: any) {
    return await this.jwtService.sign(payload, {
      expiresIn: `${this.configService.get('expiryToken.refresh_token_exp')}`
    });
  }

  async generateAccessToken(payload: any) {
    return await this.jwtService.sign(payload, {
      expiresIn: `${this.configService.get('expiryToken.access_token_exp')}`
      });
  }

  logOut() {
      return [
        'Authentication=; HttpOnly; Path=/; Max-Age=0',
        'Refresh=; HttpOnly; Path=/; Max-Age=0'
      ];
  }


  async updateUser(userId: string, updateUser:  UpdateUserDto) {
    let user = await this.userModel.update({ _id: userId }, {$set: updateUser});
    if (user && user.n > 0) {
      return {message: "Updated Successfully"};
    }
    throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
  }


  async updateCompany(userId: string, updateUser:  UpdateUserDto) {
    let user = await this.userModel.update({ _id: userId }, {$set: updateUser});
    if (user && user.n > 0) {
      return {message: "Updated Successfully"};
    }
    throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
  }


  async updateCustomerDetails(userId: string, updateUser:  UserDetails) {
    let user = await this.userModel.update({ _id: userId }, {$set: updateUser});
    if (user && user.n > 0) {
      return {message: "Updated Successfully"};
    }
    throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
  }


  async findUserById(userId: string) {
    let user = await this.userModel.aggregate([{ $match : { _id: mongoose.Types.ObjectId(userId) }}, {$project: {firstName: 1, lastName: 1, phoneNo: 1, email: 1, fcmToken: 1}}]);
    if (user && user.length) {
      return {message: "User Information", data: user[0]};
    }
    throw new HttpException("User not found", HttpStatus.NOT_FOUND);
  }


  async updateFcmToken(userId: string, fcmToken:  FCMtoken) {
    let user = await this.userModel.update({ _id: userId }, {$set: {fcmToken: [fcmToken]}});
    if (user && user.n > 0) {
      return {message: "Updated Successfully"};
    }
    throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
  }


}
