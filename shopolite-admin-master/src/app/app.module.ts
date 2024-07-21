import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpServerService } from '../app/service/service/http-server.service';
import { IonicSelectableModule } from 'ionic-selectable';
import {DatePipe} from '@angular/common';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { ngxUiLoaderConfig } from './constants/system.const';
import { HttpInterceptorService } from './service/service/http-interceptor.service';
// import { APP_CONFIG, BaseAppConfig } from './app.config';
// import { IonicStorageModule } from '@ionic/storage-angular';
// import { CountDownTimeFormatPipe } from './pipe/count-down-time-format.pipe';
import { AuthGuard } from '../app/login-page/auth.guard';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from './login-page/auth.service';
import {
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { APP_CONFIG, BaseAppConfig } from './app.config';
import { Time24to12Pipe } from './pipes/time24to12.pipe';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent, 
    Time24to12Pipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    NgxPaginationModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
    }),
  ],

  providers: [HttpServerService, DatePipe, { provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy }, { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    AuthService, AuthGuard,
    { provide: APP_CONFIG, useValue: BaseAppConfig },

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
