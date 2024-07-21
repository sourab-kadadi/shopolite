import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterCatalogPageRoutingModule } from './master-catalog-routing.module';

import { MasterCatalogPage } from './master-catalog.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedModule } from '../shared/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MasterCatalogPageRoutingModule,
    SharedModule,
    IonicSelectableModule,
    NgxPaginationModule
  ],
  declarations: [MasterCatalogPage]
})
export class MasterCatalogPageModule {}
