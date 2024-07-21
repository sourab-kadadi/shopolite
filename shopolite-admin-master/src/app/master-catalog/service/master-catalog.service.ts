import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class MasterCatalogService {

  constructor(public server: HttpServerService) { }


  getCatalog(filter: any): Observable<any> {
    let url = `${EndPointConst.GET_MASTER_CATALOG}?&page=${filter.page}`;
    if(filter.count) {
      url += `&count=${filter.count}`;
    }
    if(filter.categoryId) {
      url += `&categoryId=${filter.categoryId}`;
    }
    if(filter.subCategoryId) {
      url += `&subCategoryId=${filter.subCategoryId}`;
    }
    if(filter.search) {
      url += `&filter=${filter.search}`;
    }

    return this.server.get(url, {});
  }

  createCatalog(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.CREATE_MASTER_CATALOG}`, data, {});
  }


  getCatalogById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_MASTER_CATALOG_BY_ID}/${id}`, {});
  }


  updateCatalogById(id: string, data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_MASTER_CATALOG_BY_ID}/${id}`, data, {});
  }

  getCatalogOnCatIDSubCatId(categoryId: string, subCategoryId: string, filter: any): Observable<any> {
    let url = `${EndPointConst.GET_MASTER_CATALOG}`;
    if (categoryId) {
      url += `/${categoryId}`;
    }
    if (subCategoryId) {
      url += `/${subCategoryId}`;
    }
    url += `?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&search=${filter.search}`;
    }
    if(filter.location) {
      url += `&location=${filter.location}`;
    }
    if(typeof filter.verified === 'boolean') {
      url += `&verified=${filter.verified}`;
    }
    return this.server.get(url, {});
  }
  // deleteCategoryById(id: string): Observable<any> {
  //   return  this.server.put(`${EndPointConst.DELETE_CATEGORY_BY_ID}/${id}`, {});
  // }


}
