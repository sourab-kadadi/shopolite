import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { VerificationPageRoutingModule } from './verification-routing.module';

import { VerificationPage } from './verification.page';
import { NgOtpInputModule } from 'ng-otp-input';
import { CountDownTimeFormatPipe } from '../pipe/count-down-time-format.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,   
    VerificationPageRoutingModule,
    NgOtpInputModule
  ],
  declarations: [VerificationPage, CountDownTimeFormatPipe]
})
export class VerificationPageModule {}
