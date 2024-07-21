import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { CustomDeliveryPageRoutingModule } from './custom-delivery-routing.module';

import { CustomDeliveryPage } from './custom-delivery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,   
    CustomDeliveryPageRoutingModule
  ],
  declarations: [CustomDeliveryPage]
})
export class CustomDeliveryPageModule {}
