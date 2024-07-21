import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateUpdateMasterCatalogPageRoutingModule } from './create-update-master-catalog-routing.module';

import { CreateUpdateMasterCatalogPage } from './create-update-master-catalog.page';
import { SharedModule } from '../../shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateUpdateMasterCatalogPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    IonicSelectableModule

  ],
  declarations: [CreateUpdateMasterCatalogPage]
})
export class CreateUpdateMasterCatalogPageModule {}
