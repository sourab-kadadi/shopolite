import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardCompanyService } from '../authGard/auth-guard-company.service';

import { CategoryPage } from './category.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryPage
  },
  {
    path: 'default-item/:categoryId',
    loadChildren: () => import('../items/items.module').then( m => m.ItemsPageModule),
    canActivate: [AuthGuardCompanyService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryPageRoutingModule {}
