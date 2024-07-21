import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateUpdateCategoryPageRoutingModule } from './create-update-category-routing.module';

import { CreateUpdateCategoryPage } from './create-update-category.page';
import { SharedModule } from '../../shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CreateUpdateCategoryPageRoutingModule,
    SharedModule
  ],
  declarations: [CreateUpdateCategoryPage]
})
export class CreateUpdateCategoryPageModule {}
