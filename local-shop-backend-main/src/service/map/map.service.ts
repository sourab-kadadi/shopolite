import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../utils/utils.service';
import { GoogleMapDistanceMatrix } from './map.dto';

@Injectable()
export class MapService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    public utils: UtilsService,
  ) {}

  async distanceMatrix(
    distanceMatrixReq: GoogleMapDistanceMatrix,
    units: string = 'kms',
  ) {
    try {
      let googleMapConfig = this.configService.get('googleMap');
      const request: any = await this.httpService.axiosRef.get(
        `${googleMapConfig.map_url}/distancematrix/json?origins=${distanceMatrixReq.origin}&destinations=${distanceMatrixReq.destination}&key=${googleMapConfig.apiKey}`
      );
      return request;
    } catch (error) {
      console.log(
        `Google map issue/////////////// ${error} //////////////////`,
      );
    }
  }
}
