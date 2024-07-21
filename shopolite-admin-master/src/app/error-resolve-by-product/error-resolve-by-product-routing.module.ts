import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorResolveByProductPage } from './error-resolve-by-product.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorResolveByProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorResolveByProductPageRoutingModule {}
