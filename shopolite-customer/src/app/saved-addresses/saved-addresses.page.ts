import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, NavController, ToastController } from '@ionic/angular';
import { MessageLib } from '../constants/system.const';
import { StorageService } from '../service/service/storage.service';
import { SubscribeService } from '../subscriber/subscribe.service';
import { AddressServiceService } from './service/address-service.service';

@Component({
  selector: 'app-saved-addresses',
  templateUrl: './saved-addresses.page.html',
  styleUrls: ['./saved-addresses.page.scss'],
})
export class SavedAddressesPage implements OnInit {
  addressList: any[] = [];
  mode: any; //"manage" | "selection"
  defHref = "/tabs/home";
  isLoading= false;
  serverError = false;
  selectedAddress: any;
  constructor(
    public toastController: ToastController,
    private service: AddressServiceService,
    private route: ActivatedRoute,
    private navController: NavController,
    private router: Router,
    private addressSubject: SubscribeService,
    public actionSheetController: ActionSheetController,
    public ionStorage: StorageService,

  ) {
    this.mode = this.route.snapshot.data.mode;
    if (this.route.snapshot.queryParams?.backUrl) {
      this.defHref = this.route.snapshot.queryParams.backUrl;
    }
  }

  ionViewWillEnter() {
    this.getAddress();
    this.getCacheAddress();
  }

  ngOnInit() {

  }

  manageAddress() {
    this.router.navigate(['/saved-addresses'], {})
  }

  // ionViewEntewre

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


  async confirmDeleteAddress(addressId) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    if (role == 'confirm') {
      this.deleteAddress(addressId);

    }

  }


  deleteAddress(addressId) {
    this.serverError = false;
    this.isLoading = true;
    this.service.deleteAddress(addressId).subscribe(res => {
      this.isLoading = false;
      this.presentToast(res.message);

      this.getAddress();

    }, error => {
      this.isLoading = false;
      // this.serverError = true;
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    })
  }

  getAddress() {
    this.serverError = false;
    this.isLoading = true;
    this.service.getAllCustomerAddress().subscribe(res => {
      this.isLoading = false;
      this.addressList = res.data;
      // if (this.addressList?.length <= 0) {
      //   this.addNewAddress();
      // }
    }, error => {
      this.isLoading = false;
      // this.serverError = true;
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    })
  }


  async getCacheAddress() {
    this.selectedAddress = await this.ionStorage.get("defaultAddress");
  }
  routeToManageAddress() {
    this.router.navigate(['/saved-addresses'], { queryParams: { backUrl: this.route.snapshot.queryParams.backUrl }});
  }


  addNewAddress() {
    this.router.navigate(['/set-location'], { queryParams: { backUrl: this.route.snapshot.queryParams.backUrl }});
  }

  async onClickOnAddress(address) {
    // if (this.mode == 'selection') {

    // } else {
    //   this.router.navigate(['/saved-addresses/edit-address', address._id], { queryParams: { backUrl: this.route.snapshot.queryParams.backUrl }});
    // }
  }

  async confirmSelectionAddress(address) {
    if (address) {
    this.addressSubject.publishAddressData(address);
    await this.ionStorage.set("defaultAddress", address);
    this.navController.back();
    } else {
      this.presentToast(MessageLib.SELECT_ADDRESS);
    }
  }


  editAddress(address) {
      this.router.navigate(['/saved-addresses/edit-address', address._id], { queryParams: { backUrl: this.route.snapshot.queryParams.backUrl }});
  }

  onSelected(event, address) {
    event.preventDefault();
    this.selectedAddress = address;
  }


}
