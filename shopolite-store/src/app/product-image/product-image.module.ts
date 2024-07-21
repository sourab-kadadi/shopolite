import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductImagePageRoutingModule } from './product-image-routing.module';

import { ProductImagePage } from './product-image.page';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductImagePageRoutingModule,
    SwiperModule
  ],
  declarations: [ProductImagePage]
})
export class ProductImagePageModule {}
