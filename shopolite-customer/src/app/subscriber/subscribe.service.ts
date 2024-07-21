import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface LocationInterface {
  coords: number[],
  mapFullAddress: string
}

@Injectable({
  providedIn: 'root'
})
export class SubscribeService {

  constructor() { }

  private location = new BehaviorSubject<any>(null);
  private address = new Subject<any>();


  publishLocationData(data: LocationInterface) {
      this.location.next(data);
  }

  subscribeLocation(): Subject<LocationInterface> {
      return this.location;
  }

   publishAddressData(data: any) {
    return this.address.next(data);
}

subscribeAddress(): Subject<any> {
    return this.address;
}
}
