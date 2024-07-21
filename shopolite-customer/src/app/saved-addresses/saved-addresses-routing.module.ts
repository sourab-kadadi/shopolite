import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavedAddressesPage } from './saved-addresses.page';

const routes: Routes = [
  {
    path: '',
    data: {mode: 'manage'},
    component: SavedAddressesPage
  },
  {
    path: 'select',
    data: {mode: 'selection'},
    component: SavedAddressesPage
  },
  {
    path: 'manage-address',
    data: {mode: 'create'},
    loadChildren: () => import('./manage-address/manage-address.module').then( m => m.ManageAddressPageModule)
  },
  {
    path: 'edit-address/:address_id',
    data: {mode: 'update'},
    loadChildren: () => import('./manage-address/manage-address.module').then( m => m.ManageAddressPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavedAddressesPageRoutingModule {}
