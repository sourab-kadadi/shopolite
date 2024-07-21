import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { StoreProfilePageRoutingModule } from './store-profile-routing.module';

import { StoreProfilePage } from './store-profile.page';
import { SharedModule } from '../shared/shared/shared.module';
import { ImageUploadModule } from '../reuse-module/image-upload/image-upload.module';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { AmazingTimePickerModule } from 'amazing-time-picker'; // this line you need

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    StoreProfilePageRoutingModule,
    SharedModule,
    ImageUploadModule,
    AmazingTimePickerModule
  ],
  declarations: [StoreProfilePage],
  providers: [AmazingTimePickerService]
})
export class StoreProfilePageModule {}
