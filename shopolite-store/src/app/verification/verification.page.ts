import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthServiceService } from '../service/service/auth-service.service';
import { LOCAL_STORAGE_TOKEN_NAME, MessageLib } from '../constants/system.const';
import { ServiceService } from './service/service.service';
import { StorageService } from '../service/service/storage.service';
import { Subscription, timer } from 'rxjs';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  otpConfig = {length:4, inputStyles: {'width': '40px', 'height': '40px', 'font-size': "25px"}, allowNumbersOnly: true}
  otpKey: string = "";
  otp: string = "";
  countDown: Subscription;
  countDownReSend: Subscription;
  counter = 600;
  counterResend = 120;
  tick = 1000;
  constructor(
    private navCtrl: NavController,
    public platform: Platform,
    public service: ServiceService,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthServiceService,
    public ionStorage: StorageService
    ) {
    this.otpKey = this.route.snapshot.paramMap.get("otpKey");
    }

  ngOnInit() {
    this.countDown = timer(60, this.tick).subscribe(() => {
      --this.counter;
      if (this.counter == 0) {
        this.countDown.unsubscribe();
      }
    } );
    this.countDownReSend = timer(60, this.tick).subscribe(() => {
      --this.counterResend;
      if (this.counter == 0) {
        this.countDownReSend.unsubscribe();
      }
    } );
  }
  tabs() {
    this.navCtrl.navigateRoot(['./tabs']);
  }

  onOtpChange(event) {
    this.otp = event;
    if(this.otp.length == 4) {
      this.submitForm();
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  submitForm() {
    if (this.otp.length != 4) {
      this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
      return false;
    } else {
      const otp = {
        otp: this.otp,
        otpKey: this.otpKey
      }
      this.ngxUiLoader.startLoader("loader-03");
      this.service.verifyOtp(otp).subscribe(async res => {
        this.ngxUiLoader.stopLoader("loader-03");
        this.ionStorage.set("token", res.access_token);
        this.ionStorage.set("refreshToken", res.refresh_token);
        let user = await this.auth.jwtDecoder();
        await this.saveToken();
        if (user?.storeId) {
        this.navCtrl.navigateRoot(['./tabs']);
        } else {
        this.navCtrl.navigateRoot(['/store-profile']);
        }
        this.presentToast(MessageLib.LOGIN_SUCCESS);
      }, error => {
        this.ngxUiLoader.stopLoader("loader-03");
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      });
    }
  }

  ngOnDestroy() {
    this.countDown.unsubscribe();
    this.countDownReSend.unsubscribe();

  }

  async saveToken() {
    this.presentToast("saveToken");

    const [uuid, deviceInfo, token] = await Promise.all([
      Device.getId(),
      Device.getInfo(),
      this.ionStorage.get(LOCAL_STORAGE_TOKEN_NAME.FCM_TOKEN)
    ]);
    const fcmToken = {
      uuid: uuid?.uuid,
      deviceInfo: deviceInfo,
      token
    }
    if (token) {
      this.service.updateFCMToken(fcmToken).subscribe(data => {
      }, error => {
      });
    }

  }
}
