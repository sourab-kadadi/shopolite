import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from 'src/app/constants/end-point.const';
import { HttpServerService } from 'src/app/service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class AddressServiceService {

  constructor(public server: HttpServerService) { }


  createAddress(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.CREATE_ADDRESS}`, data, {});
  }

  updateAddress(documentId: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_ADDRESS}/${documentId}`, data, {});
  }

  deleteAddress(documentId: string): Observable<any> {
    return  this.server.delete(`${EndPointConst.DELETE_ADDRESS}/${documentId}`, {});
  }


  getAllCustomerAddress(): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ALL_CUSTOMER_ADDRESS}`, {});
  }

  getAddressById(documentId): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ADDRESS}/${documentId}`, {});
  }
}
