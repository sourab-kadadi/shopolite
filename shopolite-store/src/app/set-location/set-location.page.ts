import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from "../../environments/environment";
import { map } from 'rxjs/operators';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { HttpWithoutInterceptorService } from '../service/service/http-without-interceptor.service';
import { SubscribeService } from '../subscriber/subscribe.service';
declare var google: any;
@Component({
  selector: 'app-set-location',
  templateUrl: './set-location.page.html',
  styleUrls: ['./set-location.page.scss'],
})
export class SetLocationPage implements OnInit {

  lat: number;
  lng: number;
  address: string;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  geoCoder: any;
  mapIconUrl: any =  {url: "assets/images/map_pin.png", scaledSize: {height: 30, width: 20} };
  constructor(
    private http: HttpWithoutInterceptorService,
    public toastController: ToastController,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: Router,
    private locationSubject: SubscribeService,
    private navController: NavController

  ) { }



  ngOnInit() {
    this.printCurrentPosition();

    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log("PLACE");
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
        });
      });
    });
  }

   printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    this.lat = coordinates.coords.latitude;
    this.lng = coordinates.coords.longitude;
    console.log('Current position:', coordinates, this.lat, this.lng);
    this.getAddress(this.lat, this.lng).subscribe(decodedAddress => {
      console.log("Addresss", decodedAddress);
      this.address = decodedAddress;
      console.log(this.address);
    }, err => {
      console.log(err);
    });
  };



  private getAddress(lat: number, lan: number) {
    return this.http
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lan}&key=${environment.googleMapsAPIKey}&libraries=places`,
        {}
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.address,

      position: "middle",
      buttons: [
        {
          icon: "close-circle",
          role: "cancel"
        }
      ]
    });
    toast.present();
  }


  markerDragEnd($event: any) {
    console.log($event.latLng.lat());
    this.lat = $event.latLng.lat();
    this.lng = $event.latLng.lng();
    this.getAddress(this.lat, this.lng).subscribe(decodedAddress => {
      this.address = decodedAddress;
      console.log(this.address);
    });;
  }
  // click function to display a toast message with the address

  onMarkerClick() {
    this.presentToast();
  }

  onMapClick(event) {
    console.log(event);
  }

  navigateToMapSearch() {
    this.locationSubject.publishLocationData({coords: [this.lat, this.lng], mapFullAddress: this.address});
    this.navController.back();
  }


}
