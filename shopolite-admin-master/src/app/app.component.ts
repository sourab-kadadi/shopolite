import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG, AppConfig } from './app.config';
import { Constants } from './models/constants.models';
import { Platform } from '@ionic/angular';
import { MyEvent } from '../../src/app/service/service/myevent.services'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  rtlSide = "left";
  // selectedIndex: any;
  // appPages: any;
  // token: any;

  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(@Inject(APP_CONFIG) public config: AppConfig, private translate: TranslateService, private platform: Platform, private myEvent: MyEvent,) {
    this.initializeApp(); 
    this.myEvent.getLanguageObservable().subscribe(value => {
      // this.navCtrl.navigateRoot(['./']);
      this.globalize(value);
    });
  }


  initializeApp() {
    // if (this.config.demoMode && this.platform.is('cordova') && !window.localStorage.getItem(Constants.KEY_IS_DEMO_MODE)) {
    //   window.localStorage.setItem(Constants.KEY_IS_DEMO_MODE, "true");
    //   this.language();
    //   setTimeout(() => this.presentModal(), 30000);
    // } else {
    //   this.navCtrl.navigateRoot(['./']);
    // }
    // this.darkModeSetting();
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.show();
      // this.statusBar.overlaysWebView(false);
      // this.statusBar.backgroundColorByHexString('#000000');
      let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
      this.globalize(defaultLang);
      // setTimeout(() => this.splashScreen.hide(), 3000);
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

}
