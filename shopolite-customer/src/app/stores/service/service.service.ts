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


  getStoreById(id): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_STORE}/${id}`, {});
  }


  getStoreByCategoryId(categoryId: string, filter: any): Observable<any> {
    let url = `${EndPointConst.GET_ALL_STORE_BY_CATEGORY_ID}?&page=${filter.page}&count=${filter.count}&businessCategoryId=${categoryId}`;
    if(filter.search) {
      url += `&search=${filter.search}`;
    }
    if(filter.lat) {
      url += `&lat=${filter.lat}`;
    }
    if(filter.long) {
      url += `&long=${filter.long}`;
    }
    return this.server.get(url, {});
  }


  getCategoryById(id): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_CATEGORY_BY_ID}/${id}`, {});
  }
}
