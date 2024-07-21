import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class MyOrderService {

  constructor(public server: HttpServerService) { }


  myOrder(page: number, count: number, search?: string, fromDate?: Date, toDate?: Date, orderStatus?: string): Observable<any> {
    let myOrderEndPoint = `${EndPointConst.MY_ORDER}?&page=${page}&count=${count}`;
    if(search) {
      myOrderEndPoint= `${myOrderEndPoint}&&search=${search}`;
    }
    if(fromDate) {
      myOrderEndPoint= `${myOrderEndPoint}&&fromDate=${fromDate}`;
    }
    if(toDate) {
      myOrderEndPoint= `${myOrderEndPoint}&&toDate=${toDate}`;
    }
    if(orderStatus) {
      myOrderEndPoint= `${myOrderEndPoint}&&orderStatus=${orderStatus}`;
    }
    return  this.server.get(myOrderEndPoint, {});
  }

  getOrderStatusDropDown() {
    return  this.server.get(`${EndPointConst.ORDER_STATUS}`, {});
  }

}
