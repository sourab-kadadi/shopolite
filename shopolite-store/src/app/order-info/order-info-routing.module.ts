import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderInfoPage } from './order-info.page';

const routes: Routes = [
  {
    path: ':order_Id',
    component: OrderInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderInfoPageRoutingModule {}
