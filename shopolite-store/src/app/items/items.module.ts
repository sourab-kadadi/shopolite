import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
 
import { IonicModule } from '@ionic/angular';

import { ItemsPageRoutingModule } from './items-routing.module';

import { ItemsPage } from './items.page';
import { SharedModule } from '../shared/shared/shared.module';
import { ItemSubscribeService } from '../subcriber/item-subscribe.service';
import { BarcodeScannerPageModule } from '../module/barcode-scanner/barcode-scanner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ItemsPageRoutingModule,
    SharedModule,
    BarcodeScannerPageModule
  ],
  declarations: [ItemsPage],
  // providers: [ItemSubscribeService]
})
export class ItemsPageModule {}
