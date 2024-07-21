import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from '../../service/service/http-server.service';
import { EndPointConst } from '../../constants/end-point.const';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public server: HttpServerService) { }


  getStoreProducts(isAuth: boolean, storeCustomId: string, filter: any, subCategoryId?: string, categoryId?: string): Observable<any> {
    let basrUrl = isAuth ? EndPointConst.STORE_PRODUCT_CATALOG_AUTH : EndPointConst.STORE_PRODUCT_CATALOG;
    let url = `${basrUrl}/${storeCustomId}?&page=${filter.page}&count=${filter.count}`;
    if(filter.search) {
      url += `&search=${filter.search}`;
    }
    if(filter.location) {
      url += `&location=${filter.location}`;
    }
    if(categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    if(subCategoryId) {
      url += `&subCategoryId=${subCategoryId}`;
    }
    if(filter.type) {
      url += `&type=${filter.type}`;
    }
    return this.server.get(url, {});
  }


  getCatalogById(id): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_CATALOG_BY_ID}/${id}`, {});
  }


  getTotalCost(storeCustomId): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_TOTAL_CART_COST}/${storeCustomId}`, {});
  }

  addToCart(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.ADD_TO_CART}`, data, {});
  }

  updateCart(data: any, addressId?: string, couponCode?: string): Observable<any> {
   let url = `${EndPointConst.UPDATE_TO_CART}${addressId ? `/${addressId}` : ''}`;
   if(couponCode) {
    url += `?&code=${couponCode}`;
   }
    return  this.server.put(url, data, {});
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
    url += `&search=${filter.search}`;
  }
  if (filter.type) {
    url += `&type=${filter.type}`;
  }
  return  this.server.get(url, {});
}



getAllActiveSubCategory(storeId, filter?: any): Observable<any> {
  let url = `${EndPointConst.GET_ALL_SUB_CATEGORY_BY_STORE_ID_DROP_DOWN}/${storeId}?`;
  if(filter.type) {
    url += `&type=${filter.type}`;
  }
  return  this.server.get(url, {});
}

getAllActiveCategory(storeId, filter?: any): Observable<any> {
  let url = `${EndPointConst.GET_ALL_CATEGORY_BY_STORE_ID_DROP_DOWN}/${storeId}`;
  if(filter.type) {
    url += `&veg=${filter.type}`;
  }
  return  this.server.get(url, {});
}

getStoreDetails(storeId, lat: number, long: number): Observable<any> {
  let url = `${EndPointConst.GET_STORE_INFO}/${storeId}`;
  if (lat && long) {
    url = `${url}?&lat=${lat}&long=${long}`;
  }
  return  this.server.get(url, {});
}


getAllCouponList(storeId): Observable<any> {
  let url = `${EndPointConst.COUPON_LIST}/${storeId}`;
  return  this.server.get(url, {});
}

}
