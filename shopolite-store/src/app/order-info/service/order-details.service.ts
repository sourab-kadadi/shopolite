import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from 'src/app/constants/end-point.const';
import { HttpServerService } from 'src/app/service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {

  constructor(public server: HttpServerService) { }

  getMyOrderDetails(documentId): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ORDER_DETAILS}/${documentId}`, {});
  }

  readyToDeliver(documentId): Observable<any> {
    return  this.server.get(`${EndPointConst.READY_TO_DELIVERED_STATUS_CHANGE}/${documentId}`, {});
  }

  delivered(documentId): Observable<any> {
    return  this.server.get(`${EndPointConst.DELIVERED_STATUS_CHANGE}/${documentId}`, {});
  }

  accept(documentId): Observable<any> {
    return  this.server.get(`${EndPointConst.ACCEPT_STATUS_CHANGE}/${documentId}`, {});
  }

  reject(documentId): Observable<any> {
    return  this.server.get(`${EndPointConst.REJECT_STATUS_CHANGE}/${documentId}`, {});
  }
}
