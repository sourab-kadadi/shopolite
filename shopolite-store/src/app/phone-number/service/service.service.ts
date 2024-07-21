import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from '../../service/service/http-server.service';
import { EndPointConst } from '../../constants/end-point.const';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public server: HttpServerService) { }


  requestOtp(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.REQUEST_OTP}`, data, {});
  }

  verifyOtp(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.VERIFY_OTP}`, data, {});
  }

  getUser(filter: any): Observable<any> {
    let url = `${EndPointConst.GET_USER_LIST}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&search=${filter.search}`
    }
    return  this.server.get(url, {});
  }
}
