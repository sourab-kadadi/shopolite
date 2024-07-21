import { HttpModule, HttpService, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../utils/utils.service';
import { MapService } from './map.service';


@Module({
    imports: [HttpModule],
    providers: [MapService, UtilsService],
    exports: [MapService, UtilsService, HttpModule]
})
export class MapModule {
}
