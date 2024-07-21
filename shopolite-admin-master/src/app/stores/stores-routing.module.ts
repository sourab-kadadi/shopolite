import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoresPage } from './stores.page';

const routes: Routes = [
  {
    path: '',
    component: StoresPage
  },
  {
    path: 'create',
    data: {
      mode: 'create'
    },
    // eslint-disable-next-line max-len
    loadChildren: () => import('./manage/manage.module').then( m => m.ManagePageModule)
  },
  {
    path: 'manage/:storeId',
    data: {
      mode: 'update'
    },
    // eslint-disable-next-line max-len
    loadChildren: () => import('./manage/manage.module').then( m => m.ManagePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoresPageRoutingModule {}
