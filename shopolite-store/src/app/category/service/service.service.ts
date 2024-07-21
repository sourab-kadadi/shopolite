import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from '../../service/service/http-server.service';
import { EndPointConst } from '../../constants/end-point.const';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public server: HttpServerService) { }

  getAllCategory(): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_STORE_CATEGORY}`, {});
  }

}
