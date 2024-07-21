import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateUpdateMasterCatalogPage } from './create-update-master-catalog.page';

const routes: Routes = [
  {
    path: '',
    component: CreateUpdateMasterCatalogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateUpdateMasterCatalogPageRoutingModule {}
