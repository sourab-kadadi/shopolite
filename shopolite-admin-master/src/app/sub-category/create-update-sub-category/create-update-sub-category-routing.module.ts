import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateUpdateSubCategoryPage } from './create-update-sub-category.page';

const routes: Routes = [
  {
    path: '',
    component: CreateUpdateSubCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateUpdateSubCategoryPageRoutingModule {}
