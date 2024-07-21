import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardCompanyService } from './authGard/auth-guard-company.service';
import { LoginGuardGuard } from './authGard/login-guard.guard';

const routes: Routes = [
 {
    path: '',
    redirectTo: '/phone-number',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'phone-number',
    loadChildren: () => import('./phone-number/phone-number.module').then( m => m.PhoneNumberPageModule),
    canActivate: [LoginGuardGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'verification/:otpKey',
    loadChildren: () => import('./verification/verification.module').then( m => m.VerificationPageModule),
  },
  {
    path: 'my-orders',
    loadChildren: () => import('./my-orders/my-orders.module').then( m => m.MyOrdersPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'order-info',
    loadChildren: () => import('./order-info/order-info.module').then( m => m.OrderInfoPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'chat-customer',
    loadChildren: () => import('./chat-customer/chat-customer.module').then( m => m.ChatCustomerPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'items/:categoryId',
    loadChildren: () => import('./items/items.module').then( m => m.ItemsPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'add-product',
    loadChildren: () => import('./edit-product/add-product/add-product.module').then( m => m.AddProductPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'edit-product/:catalogId',
    loadChildren: () => import('./edit-product/edit-product.module').then( m => m.EditProductPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'my-account',
    loadChildren: () => import('./my-account/my-account.module').then( m => m.MyAccountPageModule),
    canActivate: [AuthGuardCompanyService]

  },
  {
    path: 'store-profile',
    loadChildren: () => import('./store-profile/store-profile.module').then( m => m.StoreProfilePageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'set-location',
    loadChildren: () => import('./set-location/set-location.module').then( m => m.SetLocationPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'insight',
    loadChildren: () => import('./insight/insight.module').then( m => m.InsightPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'wallet',
    loadChildren: () => import('./wallet/wallet.module').then( m => m.WalletPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'send-to-bank',
    loadChildren: () => import('./send-to-bank/send-to-bank.module').then( m => m.SendToBankPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then( m => m.SupportPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'terms-conditions',
    loadChildren: () => import('./terms-conditions/terms-conditions.module').then( m => m.TermsConditionsPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'reviews',
    loadChildren: () => import('./reviews/reviews.module').then( m => m.ReviewsPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'vt-popup',
    loadChildren: () => import('./vt-popup/vt-popup.module').then( m => m.VtPopupPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'category',
    loadChildren: () => import('./category/category.module').then( m => m.CategoryPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'map-search',
    loadChildren: () => import('./module/map-list-page/map-list-page-routing.module').then( m => m.MapListPagePageRoutingModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'barcode-scanner',
    loadChildren: () => import('./module/barcode-scanner/barcode-scanner.module').then( m => m.BarcodeScannerPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'request-product',
    loadChildren: () => import('./edit-product/request-product/request-product.module').then( m => m.RequestProductPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'product-image',
    canActivate: [AuthGuardCompanyService],
    loadChildren: () => import('./product-image/product-image.module').then( m => m.ProductImagePageModule)
  },
  {
    path: 'store-timings/:store_id',
    loadChildren: () => import('./store-profile/store-timings/store-timings.module').then( m => m.StoreTimingsPageModule)
  }




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' },)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
