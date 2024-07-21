import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class StoresService {

  constructor(public server: HttpServerService) { }


  getAllStores(filter: any): Observable<any> {
    let url = `${EndPointConst.GET_ALL_STORES}?&page=${filter.page}&count=${filter.count}`;
    if(filter.businessCategoryId) {
      url += `&businessCategoryId=${filter.businessCategoryId}`;
    }
    if(filter.place) {
      url += `&place=${filter.place}`;
    }
    if(filter.search) {
      url += `&search=${filter.search}`;
    }
    if(filter.storeOnline) {
      url += `&storeOnline=${filter.storeOnline}`;
    }
    if(filter.status) {
      url += `&status=${filter.status}`;
    }
    return this.server.get(url, {});
  }

  // createCategory(data: any): Observable<any> {
  //   return  this.server.post(`${EndPointConst.CREATE_CATEGORY}`, data, {});
  // }


  getStoreById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_STORE_BY_ID}/${id}`, {});
  }


  updateStoreById(id: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_STORE}/${id}`, data, {});
  }

  // deleteCategoryById(id: string): Observable<any> {
  //   return  this.server.put(`${EndPointConst.DELETE_CATEGORY_BY_ID}/${id}`, {});
  // }

updateStoreOnlineStatus(id: string, data: any): Observable<any>{
  return this.server.put(`${EndPointConst.ADMIN_STORE_ONLINE_UPDATE}/${id}`, data)
}



updateStoreByAdmin(storeId: any, data: any): Observable<any> {
  return this.server.put(`${EndPointConst.ADMIN_STORE_UPDATE}/${storeId}`, data)
}



}
