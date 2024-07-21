import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubCategoryPageRoutingModule } from './sub-category-routing.module';

import { SubCategoryPage } from './sub-category.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubCategoryPageRoutingModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    SharedModule
  ],
  declarations: [SubCategoryPage]
})
export class SubCategoryPageModule {}
