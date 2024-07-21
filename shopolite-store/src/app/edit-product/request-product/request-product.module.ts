import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestProductPageRoutingModule } from './request-product-routing.module';

import { RequestProductPage } from './request-product.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestProductPageRoutingModule,
    TranslateModule,
  ],
  declarations: [RequestProductPage]
})
export class RequestProductPageModule {}
