import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardCompanyService } from './authGard/auth-guard-company.service';
import { LoginGuardGuard } from './authGard/login-guard.guard';
import { DownloadRedirectComponent } from './download-redirect/download-redirect.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/phone-number',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
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
    loadChildren: () => import('./verification/verification.module').then( m => m.VerificationPageModule)
  },
  {
    path: 'set-location',
    loadChildren: () => import('./set-location/set-location.module').then( m => m.SetLocationPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'stores/:category_id',
    loadChildren: () => import('./stores/stores.module').then( m => m.StoresPageModule)
  },
  {
    path: 'items/:storeCustom_id',
    loadChildren: () => import('./items/items.module').then( m => m.ItemsPageModule),
  },
  {
    path: 'variation-selection',
    loadChildren: () => import('./variation-selection/variation-selection.module').then( m => m.VariationSelectionPageModule)
  },
  {
    path: 'cart/:storeCustom_id',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'order-placed',
    loadChildren: () => import('./order-placed/order-placed.module').then( m => m.OrderPlacedPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'my-orders',
    loadChildren: () => import('./my-orders/my-orders.module').then( m => m.MyOrdersPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'order-detail',
    loadChildren: () => import('./order-detail/order-detail.module').then( m => m.OrderDetailPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'my-account',
    loadChildren: () => import('./my-account/my-account.module').then( m => m.MyAccountPageModule)
  },
  {
    path: 'saved-addresses',
    loadChildren: () => import('./saved-addresses/saved-addresses.module').then( m => m.SavedAddressesPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.module').then( m => m.SupportPageModule)
  },
  {
    path: 'terms-conditions',
    loadChildren: () => import('./terms-conditions/terms-conditions.module').then( m => m.TermsConditionsPageModule)
  },
  {
    path: 'buyappalert',
    loadChildren: () => import('./buyappalert/buyappalert.module').then( m => m.BuyappalertPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'socila-login',
    loadChildren: () => import('./socila-login/socila-login.module').then( m => m.SocilaLoginPageModule)
  },
  {
    path: 'reviews',
    loadChildren: () => import('./reviews/reviews.module').then( m => m.ReviewsPageModule)
  },
  {
    path: 'add-review',
    loadChildren: () => import('./add-review/add-review.module').then( m => m.AddReviewPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'add-money',
    loadChildren: () => import('./add-money/add-money.module').then( m => m.AddMoneyPageModule)
  },
  {
    path: 'vt-popup',
    loadChildren: () => import('./vt-popup/vt-popup.module').then( m => m.VtPopupPageModule)
  },
  {
    path: 'custom-delivery',
    loadChildren: () => import('./custom-delivery/custom-delivery.module').then( m => m.CustomDeliveryPageModule)
  },
  {
    path: 'package-type',
    loadChildren: () => import('./package-type/package-type.module').then( m => m.PackageTypePageModule)
  },
  {
    path: 'coupon-details',
    loadChildren: () => import('./model/coupon-details/coupon-details.module').then( m => m.CouponDetailsPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  {
    path: 'coupon-list',
    loadChildren: () => import('./model/coupon-list/coupon-list.module').then( m => m.CouponListPageModule),
    canActivate: [AuthGuardCompanyService]
  },
  { path: 'download/:type', component: DownloadRedirectComponent },

  //not found page should always be at the end
  {
    path: '**',
    loadChildren: () => import('./not-found/not-found.module').then( m => m.NotFoundPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
