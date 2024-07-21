import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetLocationPage } from './set-location.page';

const routes: Routes = [
  {
    path: '',
    data: {mode: 'manage-address'},
    component: SetLocationPage
  },
  {
    path: 'go-back',
    data: {mode: "go-back"},
    component: SetLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetLocationPageRoutingModule {}
