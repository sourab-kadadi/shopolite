import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubCategoryPage } from './sub-category.page';

const routes: Routes = [
  {
    path: '',
    component: SubCategoryPage,
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
    loadChildren: () => import('./create-update-sub-category/create-update-sub-category.module').then( m => m.CreateUpdateSubCategoryPageModule)
  },
  {
    path: 'update/:subcategory_id',
    data: {
      mode: 'update'
    },
    // eslint-disable-next-line max-len
    loadChildren: () => import('./create-update-sub-category/create-update-sub-category.module').then( m => m.CreateUpdateSubCategoryPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubCategoryPageRoutingModule {}
