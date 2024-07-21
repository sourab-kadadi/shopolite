import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreTimingsPage } from './store-timings.page';

const routes: Routes = [
  {
    path: '',
    component: StoreTimingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreTimingsPageRoutingModule {}
