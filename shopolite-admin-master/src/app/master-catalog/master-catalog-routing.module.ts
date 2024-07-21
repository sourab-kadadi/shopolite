import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterCatalogPage } from './master-catalog.page';

const routes: Routes = [
  {
    path: '',
    component: MasterCatalogPage,
    data: {
      // toolbarShadowEnabled: true,
      mode: 'create'
    }
  },
  {
    path: 'create',
    data: {
      mode: 'create'
    },
    // eslint-disable-next-line max-len
    loadChildren: () => import('./create-update-master-catalog/create-update-master-catalog.module').then( m => m.CreateUpdateMasterCatalogPageModule)
  },
  {
    path: 'update/:catalog_id',
    data: {
      mode: 'update'
    },
    // eslint-disable-next-line max-len
    loadChildren: () => import('./create-update-master-catalog/create-update-master-catalog.module').then( m => m.CreateUpdateMasterCatalogPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterCatalogPageRoutingModule {}
