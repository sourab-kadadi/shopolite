import { Injectable } from '@angular/core';
import { HttpServerService } from '../../../service/service/http-server.service';
import { EndPointConst } from 'src/app/constants/end-point.const';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BarcodeServiceService {

  constructor(public server: HttpServerService) { }

  getCatlaogIdByBarCode(barcode: string): Observable<any> {
    return  this.server.get(`${EndPointConst.GET_CATALOG_ID_BY_BARCODE}/${barcode}`, {});
  }
}
