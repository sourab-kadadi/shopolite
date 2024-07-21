import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelDumpService {

  constructor(public server: HttpServerService) { }


  getExcelDumpAll(filter: any): Observable<any> {
    let url = `${EndPointConst.GET_EXCEL_DUMP_CATALOG}?&page=${filter.page}`;
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


  getExcelDumpById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_EXCEL_DUMP_BY_ID}/${id}`, {});
  }




  deleteExcelDumpById(id: string): Observable<any> {
    return  this.server.delete(`${EndPointConst.DELETE_EXCEL_DUMP_BY_ID}/${id}`, {});
  }

  // getCatalogOnCatIDSubCatId(categoryId: string, subCategoryId: string, filter: any): Observable<any> {
  //   let url = `${EndPointConst.GET_MASTER_CATALOG}/`;
  //   if (subCategoryId) {
  //     url += `/${subCategoryId}`;
  //   }
  //   url += `?&page=${filter.page}&count=${filter.count}`;
  //   if(filter.search) {
  //     url += `&search=${filter.search}`;
  //   }
  //   if(filter.location) {
  //     url += `&location=${filter.location}`;
  //   }
  //   return this.server.get(url, {});
  // }
  // // deleteCategoryById(id: string): Observable<any> {
  // //   return  this.server.put(`${EndPointConst.DELETE_CATEGORY_BY_ID}/${id}`, {});
  // // }


}
