import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonSearchbar, LoadingController } from '@ionic/angular';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../../constants/system.const';
// import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
// import { Directory, Filesystem } from '@capacitor/filesystem';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { UploadService } from '../../service/service/upload.service';
import { environment } from '../../../environments/environment.prod';
import { HttpEventType } from '@angular/common/http';
import { ServiceService } from '../../category/service/service.service';
import { SubCategoryService } from '../../sub-category/service/subcategory.service';
import { StoresService } from '../service/stores.service';
import { StoreTypeService } from 'src/app/service/service/storeType service/store-type-service.service';
import { UsersService } from 'src/app/users/service/users.service';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class ManagePage implements OnInit {

  storeId: any
  mode: 'create' | 'update' = 'create';
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
  dateValue2 = '';
  location = {}
  coords: any;
  mapFullAddress: any;
  userPhoneNo: any;
  storeUserId: any;

  days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  timings = [
    {
      day: 1,
      nameOfDay: 'Sunday',
      timings: [],
      isHoliday: false
    },
    {
      day: 2,
      nameOfDay: 'Monday',
      timings: [],
      isHoliday: false

    },
    {
      day: 3,
      nameOfDay: 'Tuesday',
      timings: [],
      isHoliday: false
    },
    {
      day: 4,
      nameOfDay: 'Wednesday',
      timings: [],
      isHoliday: false

    },
    {
      day: 5,
      nameOfDay: 'Thursday',
      timings: [],
      isHoliday: false
    },
    {
      day: 6,
      nameOfDay: 'Friday',
      timings: [],
      isHoliday: false
    },
    {
      day: 7,
      nameOfDay: 'Saturday',
      timings: [],
      isHoliday: false
    },
  ];

  storeForm: any = this.formBuilder.group({
    businessName: ['', [Validators.required, Validators.minLength(2)]],
    businessCategoryId: ['', [Validators.required, Validators.minLength(1)]],
    email: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    phoneNo: [''],
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
    private categoryService: ServiceService,
    private subCategoryservice: SubCategoryService,
    private router: Router,
    private loadingCtrl: LoadingController,
    public platform: Platform,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private ngxUiLoader: NgxUiLoaderService,
    private uploadService: UploadService,
    public alertController: AlertController,
        private route: ActivatedRoute,
        private storeService: StoresService,
        private storeTypeService: StoreTypeService,
        private userService: UsersService,
        public service: ServiceService,
  ) {
      this.mode = this.route.snapshot.data.mode || 'create';
      this.storeId = this.route.snapshot.paramMap.get("storeId");
  }

    ngOnInit() {
      console.log(this.storeId)
      this.getAllCategory();
      this.getAllStoreType();
      if (this.mode === "update") {
        this.getStoreById(this.storeId);
      }
    }

  
  
     ionViewWillEnter() {
      // this.locationSubject.subscribeLocation().subscribe((location) => {
      //   this.coords = location?.coords;
      //   this.mapFullAddress = location?.mapFullAddress;
      // });
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
  
    storeLogo(event: any) {
      this.logo =event.data;
    }
  
    storeImageLogo(event) {
      this.storeImage = event.data;
    }
  
    onSelection($event) {
    }
  
    getAllCategory() {
        this.ngxUiLoader.startLoader("loader-stores-manage");
        this.categoryService.getCategoryDropDown().subscribe(res => {
          this.categories = res.data;
          this.ngxUiLoader.stopLoader("loader-stores-manage");
        }, error => {
          this.ngxUiLoader.stopLoader("loader-stores-manage");
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        })
    }
  
    getAllStoreType() {
      this.ngxUiLoader.startLoader("loader-stores-manage");
      this.storeTypeService.getStoreTypeDropDown().subscribe(res => {
        this.storeTypes = res.data;
        this.ngxUiLoader.stopLoader("loader-stores-manage");
      }, error => {
        this.ngxUiLoader.stopLoader("loader-stores-manage");
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      })
  }
  
      getStoreById(storeId:any) {
      this.isLoading = true;
      this.storeService.getStoreById(storeId).subscribe(res => {
        this.ngxUiLoader.stopLoader("loader-stores-manage");
        // this.userPhoneNo = res.data["phoneNo"];
        // this.storeUserId = res.data["userId"];
        // this.getUserById();
        if (res?.data?.openTimings)
        this.timings = res?.data?.openTimings;
        this.storeForm.patchValue(res.data);
        this.logo = res.data.logo;
        this.storeImage = res.data.storeImage;
        this.mapFullAddress = res.data.mapFullAddress;
        this.coords = res.data.location.coordinates;
        this.isLoading = false;

      }, error => {
        this.isLoading = false;
        this.ngxUiLoader.stopLoader("loader-stores-manage");
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      })
    }
  

getUserById() {
  this.userService.getUserById(this.storeUserId).subscribe(res => {
    console.log(this.storeUserId)
  }, error => {
    this.isLoading = false;
    this.ngxUiLoader.stopLoader("loader-stores-manage");
    this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
  }
    ) 
}


// open(index) {
//   const startTime = this.atp.open({
//     preference: {
//       labels: {
//         ok: 'Start Date',
//       },
//     },
//   });
//   startTime.afterClose().subscribe((startTimeRes) => {
//     const endTime = this.atp.open({
//       preference: {
//         labels: {
//           ok: 'End Date',
//         },
//       },
//     });
//     endTime.afterClose().subscribe((endTimeRes) => {
//       if (startTimeRes && endTimeRes)
//         this.timings[index].timings.push({
//           startTime: this.getFormatted12Hr(startTimeRes),
//           startTimeMin: this.getInMin(startTimeRes),
//           endTime: this.getFormatted12Hr(endTimeRes),
//           endTimeMin: this.getInMin(endTimeRes),
//         });
//     });
//   });
// }

getInMin(time) {
  let timeSplit = time.split(':');
  let minutes = +timeSplit[0] * 60 + +timeSplit[1];
  return minutes;
}

getFormatted12Hr(a) {
  let timing: any = new Date('1994-05-10T' + a + 'Z').toLocaleTimeString(
    'bestfit',
    {
      timeZone: 'UTC',
      hour12: !0,
      hour: 'numeric',
      minute: 'numeric',
    }
  );
  const seperateColon = timing.split(':');
  if (seperateColon[0] == '0') {
    seperateColon[0] = '12';
  }
  timing = `${seperateColon[0]}:${seperateColon[1]}`;
  return timing;
}

deleteTiming(dayIndex, timingIndex) {
  this.timings[dayIndex].timings.splice(timingIndex, 1);
}



onStatusChange($event, i) {
  console.log($event, i);
  
  this.timings[i].isHoliday = $event.detail.checked;
}
    submitForm() {
      console.log("Subiter trigger", this.mode);
  
      if (this.mode === "create") {
        // this.createStore();
      } else if (this.mode === "update") {
        this.updateStore();
      }
    }
  
    compareWithFn = (o1, o2) => {
      return o1 && o2 ? o1._id === o2._id : o1 === o2;
    };
  
  
    // createStore() {
    //   this.isSubmitted = true;
    //   // this.isLoading = true;
    //   if (!this.storeForm.valid) {
    //     this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
    //     return false;
    //   } else {
    //     let store = this.storeForm.value;
    //     if (this.logo) {
    //       store["logo"] = this.logo;
    //     }
    //     if (this.storeImage) {
    //       store["storeImage"] = this.storeImage;
    //     }
    //     if (this.coords && this.coords.length == 2) {
    //       store["location"] = {coordinates: this.coords};
    //     } else {
    //       this.presentToast("Please Select Location");
    //       return;
    //     }
    //     if (this.mapFullAddress) {
    //       store["mapFullAddress"] = this.mapFullAddress;
    //     } else {
    //       this.presentToast("Please Select Map Location");
    //       return;
    //     }
    //     this.ngxUiLoader.startLoader("loader-stores-manage");
    //     this.storeService.createStore(this.storeForm.value).subscribe(res => {
    //       this.ngxUiLoader.stopLoader("loader-stores-manage");
    //       this.ionStorage.set("token", res.access_token);
    //       this.ionStorage.set("refreshToken", res.refresh_token);
    //       this.presentToast(MessageLib.STORE_CREATE_SUCCESS);
    //       this.router.navigate(['/tabs/category']);
    //     }, error => {
    //       // this.isLoading = false;
    //       this.ngxUiLoader.stopLoader("loader-stores-manage");
    //       this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    //     })
    //   }
    // }
  
    updateStore() {
      this.isSubmitted = true;
  console.log(this.storeForm.value)
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
        if (this.timings) {
          store["openTimings"] = this.timings;
        } else {
          this.presentToast("Please store timings");
          return;
        }
        this.ngxUiLoader.startLoader("loader-stores-manage");
      // this.isLoading = true;
        this.storeService.updateStoreById(this.storeId, this.storeForm.value).subscribe(res => {
          this.ngxUiLoader.stopLoader("loader-stores-manage");
          // this.isLoading = false;
          this.presentToast("Store Updated Successfully");
          this.router.navigate(['/stores']);
        }, error => {
          this.ngxUiLoader.stopLoader("loader-stores-manage");
          // this.isLoading = false;
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        })
      }
    }
  
    set_location() {
        this.router.navigate(['./set-location']);
        
      }
  
  

}
