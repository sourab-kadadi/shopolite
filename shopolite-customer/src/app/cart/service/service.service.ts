import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from '../../service/service/http-server.service';
import { EndPointConst } from '../../constants/end-point.const';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public server: HttpServerService) { }

  getMyCart(storeCustomId: string, addressId: string, couponCode?: string): Observable<any> {
   let url = `${EndPointConst.GET_CUSTOMER_CART}/${storeCustomId}${addressId ? `/${addressId}` : ''}`;
   if (couponCode) {
    url = `${url}?&code=${couponCode}`
   }
    return  this.server.get(url, {});
  }

  getTotalCost(storeCustomId: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_TOTAL_CART_COST}/${storeCustomId}`, {});
  }

  order(storeCustomId: string, addressId: string, note: string, code: string): Observable<any> {
    let url = `${EndPointConst.ORDER}/${storeCustomId}/${addressId}`;
    if (code) {
      url = `${url}?&code=${code}`
     }
    if (note) {
      url = `${url}${code ? '' : '?' }&note=${note}`;
     }
    return  this.server.get(url, {});
  }

  getAllCouponList(storeId): Observable<any> {
    let url = `${EndPointConst.COUPON_LIST}/${storeId}`;
    return  this.server.get(url, {});
  }
}
