import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchItemsPage } from './search-items.page';

const routes: Routes = [
  {
    path: '',
    component: SearchItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchItemsPageRoutingModule {}
