import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './login-page/auth.guard';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'folder/Inbox',
    redirectTo: 'login-page',
    pathMatch: 'full'
  },
  {
    path: 'login-page',
    loadChildren: () => import('./login-page/login-page.module').then(m => m.LoginPagePageModule)
  },
  {
    path: 'home-page',
    loadChildren: () => import('./home-page/home-page.module').then(m => m.HomePagePageModule),
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'folder/:id',
  //   loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule),
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'category',
    loadChildren: () => import('./category/category.module').then(m => m.CategoryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sub-category',
    loadChildren: () => import('./sub-category/sub-category.module').then(m => m.SubCategoryPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'master-catalog',
    loadChildren: () => import('./master-catalog/master-catalog.module').then(m => m.MasterCatalogPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'excel-dump',
    loadChildren: () => import('./excel-dump/excel-dump.module').then(m => m.ExcelDumpPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'error-resolve-by-product',
    loadChildren: () => import('./error-resolve-by-product/error-resolve-by-product.module').then(m => m.ErrorResolveByProductPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'split-pane',
    loadChildren: () => import('./split-pane/split-pane.module').then(m => m.SplitPanePageModule),
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'scan',
  //   loadChildren: () => import('./module/barcode-scanner/barcode-scanner.module').then(m => m.BarcodeScannerPageModule),
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then( m => m.OrdersPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'stores',
    loadChildren: () => import('./stores/stores.module').then( m => m.StoresPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
