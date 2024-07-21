import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from "../../environments/environment";
import { map } from 'rxjs/operators';
import { MapsAPILoader } from '@agm/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpWithoutInterceptorService } from '../service/service/http-without-interceptor.service';
import { SubscribeService } from '../subscriber/subscribe.service';
declare var google: any;
@Component({
  selector: 'app-set-location',
  templateUrl: './set-location.page.html',
  styleUrls: ['./set-location.page.scss'],
})
export class SetLocationPage implements OnInit {

  lat: number = 15.139393;
  lng: number = 76.921443;
  address: string;
  defHref: string;
  isLoader: boolean = false;

  @ViewChild('search')
  public searchElementRef: ElementRef;
  geoCoder: any;
  mapIconUrl: any =  {url: "assets/images/map_pin.png", scaledSize: {height: 30, width: 20} };
  mode: 'manage-address' | 'go-back' = 'manage-address';
  constructor(
    private http: HttpWithoutInterceptorService,
    public toastController: ToastController,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private router: Router, 
    private locationSubject: SubscribeService,
    private navController: NavController,
    private route: ActivatedRoute,
  ) { 
    this.mode = this.route.snapshot.data.mode;
    if (this.route.snapshot.queryParams?.backUrl) {
      this.defHref = this.route.snapshot.queryParams.backUrl;
      console.log(this.defHref);
      
    } else {
      this.defHref = "/saved-addresses"
    }
  }



  ngOnInit() {

  }


  async checkGeoLocationPermission() {
   Geolocation.checkPermissions().then(data => {
    if (data.location === 'granted') {
      this.mapLoad()
    } else {
      Geolocation.requestPermissions().then(data => {
        if (data.location === 'granted') {
          this.mapLoad()
        } else{

        }
      })
    }
   }, error => {
    Geolocation.requestPermissions().then(data => {
      if (data.location === 'granted') {
        this.mapLoad()
      } else{

      }
    })
   });
  }


  mapLoad() {
    this.printCurrentPosition();
    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: any = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          console.log("ADDED", place.geometry);

          // set latitude, longitude and zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          console.log(this.lat, this.lng);
          
          this.getAddress(this.lat, this.lng).subscribe(decodedAddress => {
            console.log("decodedAddress", decodedAddress);
            
            this.address = decodedAddress;
          }, err => {
            console.log(err);
            
          });
          // this.address = place.geometry
          // this.zoom = 12;
        });
      });
    });
  }

   printCurrentPosition = async () => {
    try {
    this.isLoader = true;
    const coordinates = await Geolocation.getCurrentPosition();
    console.log(coordinates);
    this.lat = coordinates.coords.latitude;
    this.lng = coordinates.coords.longitude;
    this.getAddress(this.lat, this.lng).subscribe(decodedAddress => {
      this.address = decodedAddress;
    this.isLoader = false;
    }, err => {
      console.log(err);
    this.isLoader = false;
      
    });
   } catch (error) {
      console.log(error);
    this.isLoader = false;
      
    }
  };



  private getAddress(lat: number, lan: number) {
    console.log("ADDEDSS");
    
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
          console.log("geoData.results[0].formatted_address", geoData.results[0].formatted_address);
          
          this.address = geoData.results[0].formatted_address;
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
    this.lat = $event.latLng.lat();
    this.lng = $event.latLng.lng();
    this.getAddress(this.lat, this.lng).subscribe(decodedAddress => {
      this.address = decodedAddress;
    });;
  }
  // click function to display a toast message with the address

  onMarkerClick() {
    this.presentToast();
  }


  navigateToMapSearch() {
    this.router.navigate(['./map-search'])
  }

  confirmMapSelection() {
    this.locationSubject.publishLocationData({coords: [this.lat, this.lng], mapFullAddress: this.address});
    if (this.mode == "go-back") {
      this.navController.back();
    } else {
      if (this.route.snapshot.queryParams?.backUrl) {
      this.router.navigate(['/saved-addresses/manage-address'], { queryParams: { backUrl: this.route.snapshot.queryParams.backUrl }});
      } else {
      this.router.navigate(['/saved-addresses/manage-address']);
      }
    }

  }

  onMapReady(map?: google.maps.Map ){
    if(map)
      map.setOptions({
        streetViewControl: false,
        fullscreenControl: false
      });
  }
}
