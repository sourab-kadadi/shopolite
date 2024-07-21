import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductImagePage } from './product-image.page';

const routes: Routes = [
  {
    path: '',
    component: ProductImagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductImagePageRoutingModule {}
