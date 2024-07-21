import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpServerService } from '../../service/service/http-server.service';
import { EndPointConst } from '../../constants/end-point.const';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(public server: HttpServerService) { }

  createSupportTicket(data: any): Observable<any> {
    return  this.server.post(`${EndPointConst.SUPPORT_TICKET}`, data, {});
  }

}
