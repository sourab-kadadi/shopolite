import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateUpdateCategoryPage } from './create-update-category.page';

const routes: Routes = [
  {
    path: '',
    component: CreateUpdateCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateUpdateCategoryPageRoutingModule {}
