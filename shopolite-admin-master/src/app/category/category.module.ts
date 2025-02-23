import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryPageRoutingModule } from './category-routing.module';

import { CategoryPage } from './category.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,

    CategoryPageRoutingModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    SharedModule
  ],
  declarations: [CategoryPage]
})
export class CategoryPageModule {}
