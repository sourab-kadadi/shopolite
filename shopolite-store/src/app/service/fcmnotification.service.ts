import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from './service/http-server.service';
import { EndPointConst } from '../constants/end-point.const';

@Injectable({
  providedIn: 'root'
})
export class FCMnotificationService {

  constructor(public server: HttpServerService) { }

  verifyOtp(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.VERIFY_OTP}`, data, {});
  }

}
