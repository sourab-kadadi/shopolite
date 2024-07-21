import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IModuleRes } from '../../common.service';
import { ProfileDto, ProfilefindManyRes, ProfilefindOneByIdRes, ProfileUpdateDto } from './profile.dto';
import { IProfileMessage, Profile } from './profile.interface';
@Injectable()
export class ProfileService {
    constructor(@InjectModel('Profile') private readonly Module: Model<Profile>) { }
        async createModule(ProfilesDto: ProfileDto): Promise<IModuleRes> {
            try {
              const createUser = new this.Module(ProfilesDto);
              await createUser.save();
              return { status: true, message: IProfileMessage.createdSuccess };
            } catch (error) {
              console.log(error);
              if (error.code && error.code == 11000) {
                let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
                let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
                throw new HttpException(`${DuplicateArrayToString} Aleary Exist`, HttpStatus.CONFLICT);
              } else {
                 throw new HttpException(error._message || "Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
              }
            }
          }

          async updateModule(ProfilesId: string, ProfilesDto: ProfileUpdateDto): Promise<IModuleRes> {
            try {
              await this.Module.update({ _id: ProfilesId }, { $set: ProfilesDto });
              return { status: true, message: IProfileMessage.updateSuccess };
            } catch (error) {
              if (error.code && error.code == 11000) {
                let findDuplicateObjecttoArray = Object.keys(error.keyPattern);
                let DuplicateArrayToString = findDuplicateObjecttoArray.toString();
                throw new HttpException(DuplicateArrayToString + ' Aleary Exist', HttpStatus.CONFLICT);
              } else {
                 throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
              }
            }
          }

          async deleteModule(ProfilesId: string): Promise<IModuleRes> {
            try {
              await this.Module.deleteOne({ _id: ProfilesId });
              return { status: true, message: IProfileMessage.deleteSuccess };
            } catch (error) {
               throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }

          async findOneModule(ProfilesId: string): Promise<ProfilefindOneByIdRes> {
            try {
              let result = await this.Module.findOne({ _id: ProfilesId });
              if (result) {
                return { status: true, message: IProfileMessage.foundSuccess, data: result };
              } else {
                return { status: false, message: IProfileMessage.notFound, data: null };
              }
            } catch (error) {
               throw new HttpException("Something went wrong. Please try after sometime", HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }

          async findManyModule(
            page: number,
            count: number,
            search: string,
            project: any
          ): Promise<ProfilefindManyRes> {
            try {
              count = Number(count || 0);
              page = Number(page || 0);
              let totalCount: any[] = [{ $count: 'count' }];
              let item: any[] = [
                { $sort: { _id: -1 } },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                  },
                }
              ];
              let match: any = {};
              if (search && search != '') {
                 let searchMatch: any[] = [
                  {
                    "user.firstName": { $regex: new RegExp(search, 'i') },
                  },
                  {
                    "user.email": { $regex: new RegExp(search, 'i') },
                  },
                  {
                    'compnayName': { $regex: new RegExp(search, 'i') },
                  },
                ];
                match['$or'] = searchMatch;
              }
              if (match) {
                item.unshift({ $match: match });
                totalCount.unshift({ $match: match });
              }
              let pagination = [
                { $skip: page * count },
                { $limit: count },
                { $unwind: '$user' },
                {
                  $project: project,
                },
              ]
              item = item.concat(pagination);
              console.log(JSON.stringify(totalCount));
              let result = this.Module.aggregate(item);
              let resultCount = this.Module.count(match);
              let data = await Promise.all([result, resultCount]);
              if (data) {
               result = data[0];
               resultCount = data[1];
              }
               if (result.length) {
                 return {
                   status: true,
                   message: IProfileMessage.foundSuccess,
                   data: result,
                   totalCount: resultCount,
                 };
             } else {
               return {
                 status: true,
                 message: IProfileMessage.foundSuccess,
                 data: [],
                 totalCount: 0,
               };
             }
            } catch (error) {
              throw error;
            }
          }
    }