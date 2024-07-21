import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryPage } from './category.page';
import { CreateUpdateCategoryPageModule } from './create-update-category/create-update-category.module';

const routes: Routes = [
  {
    path: '',
    component: CategoryPage,
    data: {
      // toolbarShadowEnabled: true,
      mode: 'create'
    }
  },
  // {
  //   path: 'create',
  //   data: {
  //     mode: 'create'
  //   },
  //   component: CreateUpdateCategoryPageModule,
  // },
  // {
  //   path: 'update/:category_id',
  //   data: {
  //     mode: 'update'
  //   },
  //   component: CreateUpdateCategoryPageModule,
  // },
  {
    path: 'create',
    data: {
      mode: 'create'
    },
    loadChildren: () => import('./create-update-category/create-update-category.module').then( m => m.CreateUpdateCategoryPageModule)
  },
  {
    path: 'update/:category_id',
    data: {
      mode: 'update'
    },
    loadChildren: () => import('./create-update-category/create-update-category.module').then( m => m.CreateUpdateCategoryPageModule)
  },

  // {
  //   path: 'create-update-category',
  //   loadChildren: () => import('./create-update-category/create-update-category.module').then( m => m.CreateUpdateCategoryPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryPageRoutingModule {}
