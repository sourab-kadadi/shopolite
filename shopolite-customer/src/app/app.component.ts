import { Component, Inject } from '@angular/core';

import { Platform, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG, AppConfig } from './app.config';
import { MyEvent } from 'src/services/myevent.services';
import { Constants } from 'src/models/contants.models';
import { VtPopupPage } from './vt-popup/vt-popup.page';
import { Helper } from 'src/models/helper.models';
import { NavigationEnd, Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { NativeMarket } from '@capgo/native-market';
import { EndPointConst } from './constants/end-point.const';
import { App } from '@capacitor/app';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { LOCAL_STORAGE_TOKEN_NAME } from './constants/system.const';
import { AlertController } from '@ionic/angular';
import { StorageService } from './service/service/storage.service';
import { AppService } from './app.service';
import { HttpServerService } from './service/service/http-server.service';
declare const gtag: Function;
export class FCMtokenDto {
  token: string;
  uuid: string;
  deviceInfo: any;
}
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  rtlSide = 'left';
  selectedIndex: any;
  appPages: any;
  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private platform: Platform,
    private navCtrl: NavController,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modalController: ModalController,
    private translate: TranslateService,
    private myEvent: MyEvent,
    public router: Router,
    public storega: StorageService,
    private alertController: AlertController,
    private service: AppService,
    public httpServer: HttpServerService
  ) {
    this.initializeApp();
    this.myEvent.getLanguageObservable().subscribe((value) => {
      this.navCtrl.navigateRoot(['./']);
      this.globalize(value);
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-W755H77SYM', { page_path: event.urlAfterRedirects });
      }
    });
  }

  ngOnInit() {
    if (this.platform.is('mobile') && !this.platform.is('mobileweb')){
    this.pushNotification();
    }
  }

  async initializeApp() {
    this.platform.resume.subscribe(() => {
      this.checkVersion();
    })
    this.checkVersion();
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.show();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#000000');
      let defaultLang = window.localStorage.getItem(
        Constants.KEY_DEFAULT_LANGUAGE
      );
      this.globalize(defaultLang);
      setTimeout(() => this.splashScreen.hide(), 3000);
    });
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
                        appId: 'com.shopolite.customer'
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
                        appId: 'com.shopolite.customer'
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

  globalize(languagePriority) {
    this.translate.setDefaultLang('en');
    let defaultLangCode = this.config.availableLanguages[0].code;
    this.translate.use(
      languagePriority && languagePriority.length
        ? languagePriority
        : defaultLangCode
    );
    this.setDirectionAccordingly(
      languagePriority && languagePriority.length
        ? languagePriority
        : defaultLangCode
    );
  }

  setDirectionAccordingly(lang: string) {
    switch (lang) {
      case 'ar': {
        this.rtlSide = 'rtl';
        break;
      }
      default: {
        this.rtlSide = 'ltr';
        break;
      }
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: VtPopupPage,
    });
    return await modal.present();
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
            if (notification?.data?.isOrder) {
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
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      this.storeTokenToLocalStorage(token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {});

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        if (notification.data?.isOrder) this.presentAlert(notification);
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert(notification);
        if (notification?.notification?.data?.isOrder)
          this.navCtrl.navigateRoot([notification.notification.data.router]);
      }
    );
  }

  async storeTokenToLocalStorage(token) {
    await this.storega.set(LOCAL_STORAGE_TOKEN_NAME.FCM_TOKEN, token);
    const [uuid, deviceInfo] = await Promise.all([
      Device.getId(),
      Device.getInfo(),
    ]);
    this.storega.set(LOCAL_STORAGE_TOKEN_NAME.DEVICE_UUID, uuid.uuid);
    const fcmToken = {
      uuid: uuid?.uuid,
      deviceInfo: deviceInfo,
      token,
    };
    this.service.updateDeviceInfo(fcmToken).subscribe();
  }

  language(): void {
    this.navCtrl.navigateRoot(['./settings']);
  }

  darkModeSetting() {
    document.body.setAttribute(
      'class',
      Helper.getThemeMode(this.config.defaultThemeMode) ==
        Constants.THEME_MODE_DARK
        ? 'dark-theme'
        : 'light-theme'
    );
  }
}
