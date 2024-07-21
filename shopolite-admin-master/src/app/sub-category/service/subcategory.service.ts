import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {


  constructor(public server: HttpServerService) { }


  getSubCategory(filter: any): Observable<any> {
    let url = `${EndPointConst.GET_ALL_SUB_CATEGORY}?&page=${filter.page}&count=${filter.count}`;
    if(filter.categoryId) {
      url += `&categoryId=${filter.categoryId}`;
    }
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }
    if(filter.location) {
      url += `&location=${filter.location}`;
    }
    return this.server.get(url, {});
  }

  createSubCategory(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.CREATE_SUB_CATEGORY}`, data, {});
  }


  getSubCategoryById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_SUB_CATEGORY_BY_ID}/${id}`, {});
  }


  updateSubCategoryById(id: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_SUB_CATEGORY_BY_ID}/${id}`, data, {});
  }

  // deleteCategoryById(id: string): Observable<any> {
  //   return  this.server.put(`${EndPointConst.DELETE_CATEGORY_BY_ID}/${id}`, {});
  // }


  getSubCategoryByCategoryIdDropdown(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_ALL_SUB_CATEGORY_BY_CAT_ID_DROP_DOWN}/${id}`, {});
  }




}
