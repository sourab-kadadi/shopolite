import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchItemsPageRoutingModule } from './search-items-routing.module';

import { SearchItemsPage } from './search-items.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchItemsPageRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [SearchItemsPage]
})
export class SearchItemsPageModule {}
