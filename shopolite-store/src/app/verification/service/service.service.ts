import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from '../../service/service/http-server.service';
import { EndPointConst } from '../../constants/end-point.const';
import { StorageService } from 'src/app/service/service/storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  userData: any;
  constructor(public server: HttpServerService, public ionStorage: StorageService) { }


  requestOtp(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.REQUEST_OTP}`, data, {});
  }

  verifyOtp(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.VERIFY_OTP}`, data, {});
  }

  updateFCMToken(data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_FCM_TOKEN}`, data, {});
  }


}
