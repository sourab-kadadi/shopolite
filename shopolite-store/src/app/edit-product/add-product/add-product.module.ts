import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
  
import { IonicModule } from '@ionic/angular';

import { AddProductPageRoutingModule } from './add-product-routing.module';

import { AddProductPage } from './add-product.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { ImageUploadModule } from 'src/app/reuse-module/image-upload/image-upload.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,  
    AddProductPageRoutingModule,
    SharedModule,
    ImageUploadModule
  ],
  declarations: [AddProductPage]
})
export class AddProductPageModule {}
