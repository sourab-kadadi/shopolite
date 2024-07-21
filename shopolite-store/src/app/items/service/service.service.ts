import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from '../../service/service/http-server.service';
import { EndPointConst } from '../../constants/end-point.const';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public server: HttpServerService) { }


  getStoreProducts(categoryId: string, subCategoryId: string, myProducts: boolean, filter: any): Observable<any> {
    let url = `${EndPointConst.STORE_CATALOG}/${categoryId}`;
    if (subCategoryId) {
      url += `/${subCategoryId}`;
    }
    url += `?&page=${filter.page}&count=${filter.count}&myProducts=${myProducts}`;
    if(filter.search) {
      url += `&search=${filter.search}`;
    }
    if(filter.location) {
      url += `&location=${filter.location}`;
    }
    return this.server.get(url, {});
  }


  getCatalogById(id): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_CATALOG_BY_ID}/${id}`, {});
  }


  getoriginalPrice(storeCustomId): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_TOTAL_CART_COST}/${storeCustomId}`, {});
  }

  addToCart(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.ADD_TO_CART}`, data, {});
  }

  updateCart(data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_TO_CART}`, data, {});
  }


createStoreProduct(catalogId: string, data: any): Observable<any> {
  return  this.server.post(`${EndPointConst.CREATE_STORE_PRODUCT}/${catalogId}`, data, {});
}

updateStoreProduct(productId: string, data: any): Observable<any> {
  return  this.server.put(`${EndPointConst.UPDATE_STORE_PRODUCT}/${productId}`, data, {});
}


getSubCategory(categoryId, filter): Observable<any> {
  let url = `${EndPointConst.GET_ALL_SUB_CATEGORY_BY_CAT_ID_DROP_DOWN}/${categoryId}?&page=${filter.page}&count=${filter.count}`;
  if(filter.search) {
    url += `&search=${filter.search}`
  }
  return  this.server.get(url, {});
}

statusUpdateStoreProduct(productId: string, status: boolean): Observable<any> {
  return  this.server.put(`${EndPointConst.STATUS_UPDATE_STORE_PRODUCT}/${productId}`, {status}, {});
}

getAllActiveSubCategory(categoryId): Observable<any> {
  let url = `${EndPointConst.GET_ACTIVE_SUB_CATEGORY_BY_CAT_ID_DROP_DOWN}/${categoryId}`;
  return  this.server.get(url, {});
}
}



