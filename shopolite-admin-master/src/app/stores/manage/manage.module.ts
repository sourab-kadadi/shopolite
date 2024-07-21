import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManagePageRoutingModule } from './manage-routing.module';

import { ManagePage } from './manage.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { TranslateModule } from '@ngx-translate/core';
import { ImageUploadModule } from '../../reusable-modules/image-upload/image-upload.module';
// import { AmazingTimePickerModule } from 'amazing-time-picker';
// import { Time24to12Pipe } from 'src/app/pipes/time24to12.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManagePageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    IonicSelectableModule,
    TranslateModule,
    ImageUploadModule,
    // AmazingTimePickerModule
  ],
  declarations: [ManagePage, 
    // Time24to12Pipe
  ]
})
export class ManagePageModule {}
