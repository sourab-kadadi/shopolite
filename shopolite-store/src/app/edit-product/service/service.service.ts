import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from '../../service/service/http-server.service';
import { EndPointConst } from '../../constants/end-point.const';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public server: HttpServerService) { }
  getCatalogById(id): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_CATALOG_BY_ID}/${id}`, {});
  }

createStoreProduct(catalogId: string, data: any): Observable<any> {
  return  this.server.post(`${EndPointConst.CREATE_STORE_PRODUCT}/${catalogId}`, data, {});
}

updateStoreProduct(productId: string, data: any): Observable<any> {
  return  this.server.put(`${EndPointConst.UPDATE_STORE_PRODUCT}/${productId}`, data, {});
}


/////////// REQUEST CATALOG ///////////////////
createStoreRequestCatalog(data: any): Observable<any> {
  return  this.server.post(`${EndPointConst.CREATE_STORE_REQ_CATALOG}`, data, {});
}

updateStoreRequestCatalog(productId: string, data: any): Observable<any> {
  return  this.server.put(`${EndPointConst.UPDATE_STORE_REQ_CATALOG}/${productId}`, data, {});
}

getAllCategory(): Observable<any> {
  return  this.server.get(`${EndPointConst.GET_CATEGORY_LIST_DROPDOWN}`, {});
}

getAllSubCategoryDropDown(categoryId: string): Observable<any> {
  return  this.server.get(`${EndPointConst.GET_ALL_SUB_CATEGROY_DROP_DROP_DOWN}/${categoryId}`, {});
}

getRequestedProducts(filter: any, categoryId?: string, subCategoryId?: string, ): Observable<any> {
  let url = `${EndPointConst.GET_ALL_STORE_REQ_CATALOG}`;
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
  return this.server.get(url, {});
}
}
