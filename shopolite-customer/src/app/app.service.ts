import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from './constants/end-point.const';
import { HttpServerService } from './service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public server: HttpServerService) { }


  updateDeviceInfo(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.UPDATE_DEVICE_INFO}`, data, {});
  }
}
