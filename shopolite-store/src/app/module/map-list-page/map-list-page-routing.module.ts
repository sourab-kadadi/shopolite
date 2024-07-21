import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapListPagePage } from './map-list-page.page';

const routes: Routes = [
  {
    path: '',
    component: MapListPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapListPagePageRoutingModule {}
