import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplitPanePage } from './split-pane.page';

const routes: Routes = [
  {
    path: '',
    component: SplitPanePage,
    children: [
      // {
      //   path: 'folder/:id',
      //   loadChildren: () => import('../folder/folder.module').then( m => m.FolderPageModule)
      // },
      {
        path: 'category',
        loadChildren: () => import('../category/category.module').then( m => m.CategoryPageModule)
      },
      {
        path: 'sub-category',
        loadChildren: () => import('../sub-category/sub-category.module').then( m => m.SubCategoryPageModule)
      },
      {
        path: 'master-catalog',
        loadChildren: () => import('../master-catalog/master-catalog.module').then( m => m.MasterCatalogPageModule)
      },
      {
        path: 'excel-dump',
        loadChildren: () => import('../excel-dump/excel-dump.module').then( m => m.ExcelDumpPageModule)
      },
      {
        path: 'error-resolve-by-product',
        // eslint-disable-next-line max-len
        loadChildren: () => import('../error-resolve-by-product/error-resolve-by-product.module').then( m => m.ErrorResolveByProductPageModule)
      },
      {
        path: '',
        redirectTo: '/home-page',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplitPanePageRoutingModule {}
