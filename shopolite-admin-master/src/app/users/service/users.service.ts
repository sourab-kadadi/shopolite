import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointConst } from '../../constants/end-point.const';
import { HttpServerService } from '../../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(public server: HttpServerService) { }

  getUserById(id: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_USER_BY_ID}/${id}`, {});
  }
}
