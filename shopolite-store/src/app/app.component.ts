import { Component, Inject } from '@angular/core';

import { Platform, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG, AppConfig } from './app.config';
import { MyEvent } from 'src/services/myevent.services';
import { Constants } from 'src/models/contants.models';
import { VtPopupPage } from './vt-popup/vt-popup.page';
import { Router } from '@angular/router';
import { Helper } from 'src/models/helper.models';
import { Storage } from '@ionic/storage';
import { AuthServiceService } from './service/service/auth-service.service';
import { NativeMarket } from '@capgo/native-market';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { StorageService } from './service/service/storage.service';
import { LOCAL_STORAGE_TOKEN_NAME } from './constants/system.const';
import { AlertController } from '@ionic/angular';
import { HttpServerService } from './service/service/http-server.service';
import { App } from '@capacitor/app';
import { EndPointConst } from './constants/end-point.const';

// import { FCM } from "@capacitor-community/fcm";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  rtlSide = "left";
  selectedIndex: any;
  appPages: any;
  token: any;

  constructor(@Inject(APP_CONFIG) public config: AppConfig, private platform: Platform, private navCtrl: NavController,
    private splashScreen: SplashScreen, private statusBar: StatusBar, private modalController: ModalController,
    public httpServer: HttpServerService,
    private translate: TranslateService, private myEvent: MyEvent, public auth: AuthServiceService, public storega: StorageService, private alertController: AlertController, ) {
    this.initializeApp(); 
    this.myEvent.getLanguageObservable().subscribe(value => {
      // this.navCtrl.navigateRoot(['./']);
      this.globalize(value);
    });
  }


  async ngOnInit() {
    if (this.platform.is('mobile') && !this.platform.is('mobileweb')){
     this.pushNotification();
    }
    const token = await this.auth.jwtDecoder();
    if (token && token.userType == 'STORE') {
      this.navCtrl.navigateRoot(['/tabs/category']);
    }
  }


  initializeApp() {
    // if (this.config.demoMode && this.platform.is('cordova') && !window.localStorage.getItem(Constants.KEY_IS_DEMO_MODE)) {
    //   window.localStorage.setItem(Constants.KEY_IS_DEMO_MODE, "true");
    //   this.language();
    //   setTimeout(() => this.presentModal(), 30000);
    // } else {
    //   this.navCtrl.navigateRoot(['./']);
    // }
    this.platform.resume.subscribe(() => {
      this.checkVersion();
    })
    this.checkVersion();
    this.darkModeSetting();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.show();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#000000');
      let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
      this.globalize(defaultLang);
      setTimeout(() => this.splashScreen.hide(), 3000);
    });
  }

  globalize(languagePriority) {
    this.translate.setDefaultLang("en");
    let defaultLangCode = this.config.availableLanguages[0].code;
    this.translate.use(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
    this.setDirectionAccordingly(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
  }

  setDirectionAccordingly(lang: string) {
    switch (lang) {
      case 'ar': {
        this.rtlSide = "rtl";
        break;
      }
      default: {
        this.rtlSide = "ltr";
        break;
      }
    }
  }


  checkVersion() {
    if (this.platform.is('capacitor')) {
      this.httpServer.get(EndPointConst.VERSION_CHECK).subscribe(storeVersion => {
        App.getInfo().then(async appInfo => {
          if (this.platform.is('android')){
            if(storeVersion?.android?.version !== appInfo?.version) {
              const alert = await this.alertController.create({
                header: storeVersion?.android?.header,
                message: storeVersion?.android?.message,
                backdropDismiss: false,
                // subHeader: JSON.stringify(appInfo),
                buttons: [
                  {
                    text: 'Open',
                    handler: async () => {
                      NativeMarket.openStoreListing({
                        appId: 'com.shopolite.seller'
                      });
                    },
                  },
                ],
              });
          
              await alert.present();
            }
          } else if (this.platform.is('ios')){
            if(storeVersion?.ios?.version !== appInfo?.version) {
              const alert = await this.alertController.create({
                header: storeVersion?.ios?.header,
                message: storeVersion?.ios?.message,
                backdropDismiss: false,
                buttons: [
                  {
                    text: 'Open',
                    handler: async () => {
                      NativeMarket.openStoreListing({
                        appId: 'com.shopolite.seller'
                      });
                    },
                  },
                ],
              });
          
              await alert.present();
            }
          }
        })       
      })
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: VtPopupPage,
    });
    return await modal.present();
  }

  language(): void {
    this.navCtrl.navigateRoot(['./settings']);
  }

 async darkModeSetting() {
    document.body.setAttribute('class', (Helper.getThemeMode(this.config.defaultThemeMode) == Constants.THEME_MODE_DARK ? 'dark-theme' : 'light-theme'));
    console.log("HElper Set", Helper.getThemeMode(this.config.defaultThemeMode));
    
  }

  async presentAlert(notification: PushNotificationSchema) {
    const alert = await this.alertController.create({
      header: JSON.stringify(notification),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: async () => {
            await alert.onDidDismiss();
          },
        },
        {
          text: 'Open',
          role: 'confirm',
          handler: async () => {
            if (notification?.data?.isOrder){
            this.navCtrl.navigateRoot([notification.data.router]);
            } else {
            await alert.onDidDismiss();
            }
          },
        },
      ],
    });

    await alert.present();
  }



   pushNotification() {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error  
      }
    });

        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration',
         (token: Token) => {
          this.storeTokenToLocalStorage(token.value);
        }
      );
  
      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
        (error: any) => {
        }
      );
  
      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          if (notification.data?.isOrder)
          this.presentAlert(notification );
        }
      );
  
      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          alert(notification);
          if (notification?.notification?.data?.isOrder)
          this.navCtrl.navigateRoot([notification.notification.data.router]);
        }
      );

      // FCM.subscribeTo({topic: 'store'}).then((notification) => {
      //   alert(notification);
      // })
      
  }


  async storeTokenToLocalStorage(token) {
    await this.storega.set(LOCAL_STORAGE_TOKEN_NAME.FCM_TOKEN, token);
    Device.getId().then(deviceId => {
      this.storega.set(LOCAL_STORAGE_TOKEN_NAME.DEVICE_UUID, deviceId.uuid);
    })
  }
}
