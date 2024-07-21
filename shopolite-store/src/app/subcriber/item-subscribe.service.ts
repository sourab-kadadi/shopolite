import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemSubscribeService {

  constructor() { }

  private itemSubject = new Subject<any>();

  publishData(data: any) {
      this.itemSubject.next(data);
  }

  getObservable(): Subject<any> {
      return this.itemSubject;
  }
}
