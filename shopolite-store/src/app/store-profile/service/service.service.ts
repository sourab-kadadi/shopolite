import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from '../../service/service/http-server.service';
import { EndPointConst } from '../../constants/end-point.const';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public server: HttpServerService) { }

  getRoles(): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_USER_ROLES}`, {});
  }


  createStore(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.CREATE_STORE}`, data, {});
  }

  updateStore(data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_STORE}`, data, {});
  }

  getAllCategory(): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_CATEGORY_LIST_DROPDOWN}`, {});
  }


  getAllStoreType(): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ALL_STORE_TYPE_DROP_DOWN}`, {});
  }

  getStoreById(id): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_STORE}/${id}`, {});
  }

  updateStoreOnlineStatus(data): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_STORE_ONLINE_STATUS}`, data, {});
  }
}
