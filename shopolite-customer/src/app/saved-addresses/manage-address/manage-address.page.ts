import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageLib, ngXFgsType, ngXLoaderType } from 'src/app/constants/system.const';
import { StorageService } from 'src/app/service/service/storage.service';
import { SubscribeService } from 'src/app/subscriber/subscribe.service';
import { AddressServiceService } from '../service/address-service.service';

@Component({
  selector: 'app-manage-address',
  templateUrl: './manage-address.page.html',
  styleUrls: ['./manage-address.page.scss'],
})
export class ManageAddressPage implements OnInit {
  isSubmitted: boolean = false;
  public loaderType: string = ngXLoaderType;
  spinner = ngXFgsType;
  mapFullAddress: string = "";
  coords: number[] = [];
  defHref = "/saved-addresses";
  isLoading = false;
serverError = false;
  addressForm : any = this.formBuilder.group({
    tag: ['HOME', Validators.required],
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    buildingNumber: ['', [Validators.required, Validators.minLength(2)]],
    buildingName: ['', [Validators.required, Validators.minLength(2)]],
    area: ['', [Validators.required, Validators.minLength(2)]],
    phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
    landmark: ['', []],
    reciverPhoneNumber: ['', []]
  });
  mode: "create" | "update" = "create";
  addressId: string;
  constructor(
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: AddressServiceService,
    private locationSubject: SubscribeService,
    private navController: NavController,
    public ionStorage: StorageService,
  ) {
    // this.mode = this.route.snapshot.data.mode;
    this.addressId = this.route.snapshot.paramMap.get("address_id");
    if (this.addressId) {
      this.mode = 'update';
      this.getAddress(this.addressId);
    }
    if (this.route.snapshot.queryParams?.backUrl) {
      this.defHref = this.route.snapshot.queryParams.backUrl;
    }
   }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.locationSubject.subscribeLocation().subscribe((location) => {
      this.coords = location?.coords;
      this.mapFullAddress = location?.mapFullAddress;
    });
  }

  get errorControl() {
    return this.addressForm.controls;
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  submitForm() {
   this.manageAddress();
  }


  getAddress(addressId) {
    this.isLoading=true;

    this.service.getAddressById(addressId).subscribe(res => {
      this.mapFullAddress = res.data?.mapFullAddress || null;
      this.coords = res.data?.location.coordinates;
      this.addressForm.patchValue(res.data);
      this.isLoading=false;
      this.serverError = false;
    }, error => {
      this.isLoading=false;
      // this.serverError = true;
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    });
  }

  manageAddress() {
    this.serverError = false;
    this.isSubmitted = true;
    if (!this.addressForm.valid) {
      this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
      return false;
    } else {
      let addressData = this.addressForm.value;
      if (this.coords && this.coords.length == 2 && this.mapFullAddress) {
        addressData["location"] = {coordinates: this.coords};
        addressData["mapFullAddress"] = this.mapFullAddress;
      } else {
      this.presentToast(MessageLib.PLEASE_PROVIDE_MAP_LOCATION);
      return
      }

      if (this.mode === "create") {
        this.isLoading=true;
        this.ngxUiLoader.startLoader("loader-03");
        this.service.createAddress(this.addressForm.value).subscribe(async res => {
          if (this.route.snapshot.queryParams?.backUrl) {
          await this.ionStorage.set("defaultAddress", res.data);
          this.locationSubject.publishAddressData(res.data);
          }
          this.ngxUiLoader.stopLoader("loader-03");
          this.isLoading=false;
          this.router.navigate([this.route.snapshot.queryParams?.backUrl || '/saved-addresses']);
          this.presentToast(MessageLib.ADDRESS_CREATE_SUCCESS);
        }, error => {
          this.isLoading=false;
          this.ngxUiLoader.stopLoader("loader-03");
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        })
      }
     else if (this.mode === "update" && this.addressId) {
      this.isLoading=true;
        this.ngxUiLoader.startLoader("loader-03");
      this.service.updateAddress(this.addressId, this.addressForm.value).subscribe(async res => {
        const updatedAddress = {_id: this.addressId, ...this.addressForm.value};
        await this.ionStorage.set("defaultAddress", updatedAddress);
        this.locationSubject.publishAddressData(res.data);
        this.ngxUiLoader.stopLoader("loader-03");
        this.isLoading=false;
        this.presentToast(MessageLib.ADDRESS_UPDATE_SUCCESS);
        this.router.navigate([this.route.snapshot.queryParams?.backUrl || '/saved-addresses']);
      }, error => {
        this.isLoading=false;
        // this.serverError = true;
        this.ngxUiLoader.stopLoader("loader-03");
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      })
      } else {
        this.isLoading=false;
        // this.serverError = true;
        this.presentToast(MessageLib.INTERNAL_SERVER_ERROR);
      }

  }
}



}
