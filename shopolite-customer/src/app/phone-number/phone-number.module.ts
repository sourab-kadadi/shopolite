import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { PhoneNumberPageRoutingModule } from './phone-number-routing.module';

import { PhoneNumberPage } from './phone-number.page';
import { SharedModule } from '../shared/shared/shared.module';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PhoneNumberPageRoutingModule,
    SharedModule
  ],
  declarations: [PhoneNumberPage],
  providers: [Keyboard]
})
export class PhoneNumberPageModule {}
