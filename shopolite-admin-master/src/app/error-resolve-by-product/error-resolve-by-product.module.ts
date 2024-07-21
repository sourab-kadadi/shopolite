import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorResolveByProductPageRoutingModule } from './error-resolve-by-product-routing.module';

import { ErrorResolveByProductPage } from './error-resolve-by-product.page';
import { SharedModule } from '../shared/shared/shared.module';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorResolveByProductPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    IonicSelectableModule

  ],
  declarations: [ErrorResolveByProductPage]
})
export class ErrorResolveByProductPageModule {}
