import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { VariationSelectionPageRoutingModule } from './variation-selection-routing.module';

import { VariationSelectionPage } from './variation-selection.page';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    VariationSelectionPageRoutingModule,
        SwiperModule
  ],
  declarations: [VariationSelectionPage]
})
export class VariationSelectionPageModule {}
