import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../../constants/end-point.const';
import { HttpServerService } from '../http-server.service';

@Injectable({
  providedIn: 'root'
})
export class StoreTypeService {

  constructor(public server: HttpServerService) { }




  getStoreTypeDropDown(): Observable<any> {
    return this.server.get(`${EndPointConst.GET_ALL_STORE_TYPE_DROP_DOWN}`);
  }



}
