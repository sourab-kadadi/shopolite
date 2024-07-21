import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilsService } from '../../service/utils/utils.service';
import { AwsService } from '../aws/aws.service';
import { CatalogModule } from '../catalog/catalog.module';
import { JobPostController } from './job-post.controller';
import { jobPost } from './job-post.schema';
import { JobPostService } from './job-post.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'JobPosts', schema: jobPost }]), HttpModule, CatalogModule ],
  controllers: [JobPostController],
  providers: [JobPostService, UtilsService, AwsService]
})
export class JobPostModule {}
