import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(public server: HttpServerService) { }

  getOrders(filter: any): Observable<any> {
    let url = `${EndPointConst.ORDERS}?&page=${filter.page}`;
    if(filter.count) {
      url += `&count=${filter.count}`;
    }
    // if(filter.categoryId) {
    //   url += `&categoryId=${filter.categoryId}`;
    // }
    // if(filter.subCategoryId) {
    //   url += `&subCategoryId=${filter.subCategoryId}`;
    // }
    // if(filter.search) {
    //   url += `&filter=${filter.search}`;
    // }

    return this.server.get(url, {});
  }

  getOrderDetailById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ORDER_DETAILS}/${id}`, {});
  }


  
  updateOrderStatusByAdmin(orderId: any, data: any): Observable<any> {
    return this.server.put(`${EndPointConst.UPDATE_ORDER_STATUS_ADMIN}/${orderId}`, data)
  }
}
