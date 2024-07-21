import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { APP_CONFIG, AppConfig } from '../app.config';
import { StorageService } from '../service/service/storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { ServiceService } from '../store-profile/service/service.service';
import { MessageLib } from '../constants/system.const';
import { AuthServiceService } from '../service/service/auth-service.service';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {
  tokenData: any;
  storeName: any;
  storeId: any;
  logo: any;
  place: any;
  s3path: any = environment.s3Url;
  isLoading = false;
  storeUrl: any;
  storeDetails: any;
  storeOnline: boolean;

  constructor(@Inject(APP_CONFIG) public config: AppConfig, private route: Router, private navCtrl: NavController,
    private modalController: ModalController,
    public ionStorage: StorageService,
    public service: ServiceService,
    public toastController: ToastController,
    public AuthServiceService: AuthServiceService
  ) {


  }

  ngOnInit() {
    // console.log(this.ionStorage.get("refreshToken"));
  }

  ionViewWillEnter() {
    this.getTokenData();
  }

  store_profile() {
    this.route.navigate(['./store-profile']);
  }
  insight() {
    this.route.navigate(['./insight']);
  }
  wallet() {
    this.route.navigate(['./wallet']);
  }
  terms_conditions() {
    this.route.navigate(['./terms-conditions']);
  }
  support() {
    this.route.navigate(['./support']);
  }
  reviews() {
    this.route.navigate(['./reviews']);
  }
  settings() {
    this.route.navigate(['./settings']);
  }

  requestProductList() {
    this.route.navigate(['/request-product']);
  }

  editStoreTimings() {
    this.route.navigate(['/store-timings', this.storeId]);
  }
//about_us() {
//    this.route.navigate(['./about-us']);
//  }
//select_language() {
//    this.route.navigate(['./select-language']);
//  }
  async phone_number() {
    await this.AuthServiceService.logout()
    this.route.navigate(['./phone-number']);
  }

  


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  async getTokenData() {
    const helper = new JwtHelperService();
    const token = this.ionStorage.get('token').then(res => helper.decodeToken(res));
    const user = token.then(result => {
      if (result) {
        this.tokenData = result;
        this.storeId = this.tokenData.storeId;
        this.storeName = this.tokenData.storeName;
        this.getStoreById();
      } else {
        return;
      }
    });
  }


  getStoreById() {
    this.isLoading = true;
    this.service.getStoreById(this.storeId).subscribe(res => {
      // this.ngxUiLoader.stopLoader("loader-03");
      this.storeDetails = res.data;
      this.logo = res.data.logo.filePath;
      this.place = res.data.place;
      this.storeOnline = res.data.storeOnline;
      this.storeUrl = `https://shopolite.com/items/${res.data.storeCustomId}`;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      // this.ngxUiLoader.stopLoader("loader-03");
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    });
  }

  async basicShare() {
    await Share.share({
      title: 'We are Live!!',
      text: `Your favorite ${this.storeName} is now live on Shopolite!!
            Click the link below to buy online and get them at your doorstep only in ${this.storeDetails.place}!!`,
      url: this.storeUrl,
      dialogTitle: 'Share with your friends and relatives',
    });
  }

  onStoreOnlineStatusChange(event: any) {
    if (!this.storeOnline) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
      let data = { storeOnline: true };
      this.service.updateStoreOnlineStatus(data).subscribe(res => {
        if (res.status === true) { this.storeOnline = true; }
        else {
          setTimeout(() => { this.storeOnline = false; });
        }
      }, error => {
        if (error) { this.storeOnline = false; }
        // this.ngxUiLoader.stopLoader("product-loader");
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      });
    }
    if (this.storeOnline) {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();
      let data = { storeOnline: false };
      this.service.updateStoreOnlineStatus(data).subscribe(res => {
        if (res.status === true) { this.storeOnline = false; }
        else {
          setTimeout(() => { this.storeOnline = true; });
        }
      }, error => {
        if (error) { this.storeOnline = true; }
        // this.ngxUiLoader.stopLoader("product-loader");
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      });
    }
  }

  // onClick(event){
  //    let systemDark = window.matchMedia("(class: night-mode)");
  //    systemDark.addListener(this.colorTest);
  //    if(event.detail.checked){
  //      document.body.setAttribute('class', 'night-mode');
  //    }
  //    else{
  //      document.body.setAttribute('class', 'day-mode');
  //    }
  //  }
  //
  //   colorTest(systemInitiatedDark) {
  //    if (systemInitiatedDark.matches) {
  //      document.body.setAttribute('class', 'night-mode');
  //    } else {
  //      document.body.setAttribute('class', 'day-mode');
  //    }
  //  }
}
