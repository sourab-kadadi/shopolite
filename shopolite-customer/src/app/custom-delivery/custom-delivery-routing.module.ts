import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomDeliveryPage } from './custom-delivery.page';

const routes: Routes = [
  {
    path: '',
    component: CustomDeliveryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomDeliveryPageRoutingModule {}
