import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { BuyappalertPage } from '../buyappalert/buyappalert.page';
import { APP_CONFIG, AppConfig } from '../app.config';
import { AuthServiceService } from '../service/service/auth-service.service';
import { RegisterService } from '../register/register.service';
import { MessageLib } from '../constants/system.const';
import { StorageService } from '../service/service/storage.service';
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  constructor(@Inject(APP_CONFIG) public config: AppConfig, private route: Router, private navCtrl: NavController, private modalController: ModalController, private auth: AuthServiceService, private registerService: RegisterService, public toastController: ToastController,
  public ionStorage: StorageService
  ) { }
  user: any;
  userProfile: any;
  ngOnInit() {
    this.getUser();
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  saved_addresses() {
    this.route.navigate(['./saved-addresses']);
  }
  terms_conditions() {
    this.route.navigate(['./terms-conditions']);
  }
  register() {
    this.route.navigate(['/register']);
  }
  support() {
    this.route.navigate(['./support']);
  }
  wallet() {
    this.route.navigate(['./wallet']);
  }
  //about_us() {
  //    this.route.navigate(['./about-us']);
  //  }
  settings() {
    this.route.navigate(['./settings']);
  }
  phone_number() {
    this.ionStorage.remove("token");
    this.ionStorage.remove("refreshToken");
    this.route.navigate(['./phone-number']);
  }
  developed_by() {
    window.open("https://opuslab.works/", '_system', 'location=no');
  }
  buyappalert() {
    this.modalController.create({ component: BuyappalertPage }).then((modalElement) => {
      modalElement.present();
    }
    )
  }

  getUser() {
    this.registerService.getMyProfile().subscribe(res => {
      this.userProfile = res.data;
    }, error => {
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    })
  }
}
