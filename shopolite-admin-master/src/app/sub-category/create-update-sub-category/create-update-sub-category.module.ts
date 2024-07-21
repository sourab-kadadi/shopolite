import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateUpdateSubCategoryPageRoutingModule } from './create-update-sub-category-routing.module';

import { CreateUpdateSubCategoryPage } from './create-update-sub-category.page';
import { SharedModule } from '../../shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateUpdateSubCategoryPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    IonicSelectableModule
  ],
  declarations: [CreateUpdateSubCategoryPage]
})
export class CreateUpdateSubCategoryPageModule {}
