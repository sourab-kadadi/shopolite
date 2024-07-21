import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpWithoutInterceptorService } from '../../service/service/http-without-interceptor.service';

@Component({
  selector: 'app-map-list-page',
  templateUrl: './map-list-page.page.html',
  styleUrls: ['./map-list-page.page.scss'],
})
export class MapListPagePage implements OnInit {
  searchList: any[] = [];
  searchText: string = '';
  constructor(public http: HttpWithoutInterceptorService) {}

  ngOnInit() {}

  onMapSearch($event) {
    this.onMapSearchHttp(this.searchText).subscribe((data) => {
      console.log(data);
    });
  }

  onMapSearchHttp(searchText) {
    this.searchText = 'DIFC';
    return this.http.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${environment.googleMapsAPIKey}&libraries=places&query=${this.searchText}`,
        {}
      )
      .pipe(
        map((geoData) => {
          return geoData;
        })
      );
  }
}
