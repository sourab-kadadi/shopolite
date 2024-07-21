import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { IonDatetime } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ServiceService } from './service/service.service';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from '../constants/system.const';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../service/service/auth-service.service';
import { format, parseISO, getDate, getMonth, getYear } from 'date-fns';
import { AmazingTimePickerService } from 'amazing-time-picker'; // this line you need
import { SubscribeService } from '../subscriber/subscribe.service';
import { StorageService } from '../service/service/storage.service';

@Component({
  selector: 'app-store-profile',
  templateUrl: './store-profile.page.html',
  styleUrls: ['./store-profile.page.scss'],
})
export class StoreProfilePage implements OnInit {
  isLoading = false;
store_category: string = "1";
Countrys: any[] = [];
categories: any[] = [];
storeTypes: any[] = [];
isSubmitted: boolean = false;
public loaderType: string = ngXLoaderType;
spinner = ngXFgsType;
logo = "";
storeImage = "";
storeId: string;
mode: "create" | "update" = "create";
dateValue2 = '';
location = {}
coords: any;
mapFullAddress: any;
storeForm: any = this.formBuilder.group({
  businessName: ['', [Validators.required, Validators.minLength(2)]],
  businessCategoryId: ['', [Validators.required, Validators.minLength(1)]],
  email: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
  phoneNo: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
  address1: ['', [Validators.required]],
  address2: ['', []],
  gstNumber: ['', []],
  timing: this.formBuilder.group({
    startTime: ['', [Validators.required]],
    endTime: ['', [Validators.required]]
  }),
  storeType: ['', [Validators.required]],
});
user: any;
  constructor(
    public platform: Platform,
    public service: ServiceService,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthServiceService,
    private atp: AmazingTimePickerService,
    private locationSubject: SubscribeService,
    public ionStorage: StorageService

  ) {
    this.mode = this.route.snapshot.data.mode || 'create';
    this.storeId = this.route.snapshot.paramMap.get("store_id");
    this.initUser();
   }

   async initUser() {
    this.user = await this.auth.jwtDecoder();
    console.log(this.user);
    this.storeForm.patchValue({phoneNo: this.user.phoneNo});
    this.storeForm.controls["phoneNo"].disable();
    if (this.user && this.user.storeId) {
      this.storeId = this.user.storeId;
      this.mode = 'update';
      this.getStoreById(this.storeId);
    }
   }


   ionViewWillEnter() {
    this.locationSubject.subscribeLocation().subscribe((location) => {
      this.coords = location?.coords;
      this.mapFullAddress = location?.mapFullAddress;
    });
  }

  compareWith(o1, o2) {
    if(!o1 || !o2) {
      return o1 === o2;
    }

    if(Array.isArray(o2)) {
      return o2.some((o) => o._id === o1._id);
    }

    return o1._id === o2._id;
  }


  ngOnInit() {
    this.getAllCategory();
    this.getAllStoreType();
    if (this.mode === "update") {
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  get errorControl() {
    return this.storeForm.controls;
  }

  storeLogo(event) {
    this.logo =event.data;
  }

  storeImageLogo(event) {
    this.storeImage = event.data;
  }

  onSelection($event) {
  }


  getAllCategory() {
      this.ngxUiLoader.startLoader("loader-03");
      this.service.getAllCategory().subscribe(res => {
        this.categories = res.data;
        this.ngxUiLoader.stopLoader("loader-03");
      }, error => {
        this.ngxUiLoader.stopLoader("loader-03");
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      })
  }

  getAllStoreType() {
    this.ngxUiLoader.startLoader("loader-03");
    this.service.getAllStoreType().subscribe(res => {
      this.storeTypes = res.data;
      this.ngxUiLoader.stopLoader("loader-03");
    }, error => {
      this.ngxUiLoader.stopLoader("loader-03");
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    })
}


  getStoreById(storeId) {
    this.isLoading = true;
    this.service.getStoreById(storeId).subscribe(res => {
      this.ngxUiLoader.stopLoader("loader-03");
      res.data["phoneNo"] = this.user.phoneNo;
      this.storeForm.patchValue(res.data);
      this.logo = res.data.logo;
      this.storeImage = res.data.storeImage;
      this.mapFullAddress = res.data.mapFullAddress;
      this.coords = res.data.location.coordinates;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-03");
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    })
  }

  submitForm() {
    console.log("Subiter trigger", this.mode);

    if (this.mode === "create") {
      this.createStore();
    } else if (this.mode === "update") {
      this.updateStore();
    }
  }

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1._id === o2._id : o1 === o2;
  };


  createStore() {
    this.isSubmitted = true;
    // this.isLoading = true;
    if (!this.storeForm.valid) {
      this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
      return false;
    } else {
      let store = this.storeForm.value;
      if (this.logo) {
        store["logo"] = this.logo;
      }
      if (this.storeImage) {
        store["storeImage"] = this.storeImage;
      }
      if (this.coords && this.coords.length == 2) {
        store["location"] = {coordinates: this.coords};
      } else {
        this.presentToast("Please Select Location");
        return;
      }
      if (this.mapFullAddress) {
        store["mapFullAddress"] = this.mapFullAddress;
      } else {
        this.presentToast("Please Select Map Location");
        return;
      }
      this.ngxUiLoader.startLoader("loader-03");
      this.service.createStore(this.storeForm.value).subscribe(res => {
        this.ngxUiLoader.stopLoader("loader-03");
        this.ionStorage.set("token", res.access_token);
        this.ionStorage.set("refreshToken", res.refresh_token);
        this.presentToast(MessageLib.STORE_CREATE_SUCCESS);
        this.router.navigate(['/tabs/category']);
      }, error => {
        // this.isLoading = false;
        this.ngxUiLoader.stopLoader("loader-03");
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      })
    }
  }

  updateStore() {
    this.isSubmitted = true;

    if (!this.storeForm.valid) {
      this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
      return false;
    } else {
      let store = this.storeForm.value;
      if (this.logo) {
        store["logo"] = this.logo;
      }
      if (this.storeImage) {
        store["storeImage"] = this.storeImage;
      }
      if (this.coords && this.coords.length == 2) {
        store["location"] = {coordinates: this.coords};
      } else {
        this.presentToast("Please Select Location");
        return;
      }
      if (this.mapFullAddress) {
        store["mapFullAddress"] = this.mapFullAddress;
      } else {
        this.presentToast("Please Select Map Location");
        return;
      }
      this.ngxUiLoader.startLoader("loader-03");
    // this.isLoading = true;
      this.service.updateStore(this.storeForm.value).subscribe(res => {
        this.ngxUiLoader.stopLoader("loader-03");
        // this.isLoading = false;
        this.presentToast(MessageLib.STORE_UPDATE_SUCCESS);
        this.router.navigate(['/tabs/category']);
      }, error => {
        this.ngxUiLoader.stopLoader("loader-03");
        // this.isLoading = false;
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      })
    }
  }

  set_location() {
      this.router.navigate(['./set-location']);
    }


  open() {
    // const amazingTimePicker = this.atp.open();
    // amazingTimePicker.afterClose().subscribe(time => {
    //   console.log(time);
    // });
  }
}
