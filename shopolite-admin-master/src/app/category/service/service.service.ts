import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public server: HttpServerService) { }


  getCategory(filter?: any): Observable<any> {
    let url = `${EndPointConst.GET_ALL_CATEGORY}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(filter.location) {
      url += `&location=${filter.location}`;
    }
    return this.server.get(url, {});
  }

  createCategory(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.CREATE_CATEGORY}`, data, {});
  }


  getCategoryById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_CATEGORY_BY_ID}/${id}`, {});
  }


  updateCategoryById(id: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_CATEGORY_BY_ID}/${id}`, data, {});
  }

  // deleteCategoryById(id: string): Observable<any> {
  //   return  this.server.put(`${EndPointConst.DELETE_CATEGORY_BY_ID}/${id}`, {});
  // }

  getCategoryDropDown(): Observable<any> {
    return this.server.get(`${EndPointConst.GET_ALL_CATEGORY_DROPDOWN}`);
  }



}
