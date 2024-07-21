import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { EndPointConst } from '../constants/end-point.const';
import { HttpServerService } from '../service/service/http-server.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    public server: HttpServerService
  ) { }

  updateProfile(data: any): Observable<any> {
    return  this.server.put(`${EndPointConst.UPDATE_PROFILE}`, data, {});
  }

  getMyProfile(): Observable<any> {
    return  this.server.get(`${EndPointConst.USER_PROFILE}`, {});
  }
}
