import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from '../../service/service/http-server.service';
import { EndPointConst } from '../../constants/end-point.const';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public server: HttpServerService) { }


  requestOtp(otpkey: any): Observable<any> {
    return  this.server.get(`${EndPointConst.REQUEST_OTP}/${otpkey}`, {});
  }

  verifyOtp(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.VERIFY_OTP}`, data, {});
  }

  updateFCMToken(data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_FCM_TOKEN}`, data, {});
  }
}
