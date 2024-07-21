import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreTimingsPageRoutingModule } from './store-timings-routing.module';

import { StoreTimingsPage } from './store-timings.page';
import { TranslateModule } from '@ngx-translate/core';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { Time24to12Pipe } from '../../pipe/time24to12.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreTimingsPageRoutingModule,
    TranslateModule,   
    AmazingTimePickerModule
  ],
  declarations: [StoreTimingsPage, Time24to12Pipe]
})
export class StoreTimingsPageModule {}
