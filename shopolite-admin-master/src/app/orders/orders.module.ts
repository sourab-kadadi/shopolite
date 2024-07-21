import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPage } from './orders.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedModule } from '../shared/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdersPageRoutingModule,
    SharedModule,
    IonicSelectableModule,
    NgxPaginationModule
  ],
  declarations: [OrdersPage]
})
export class OrdersPageModule {}
