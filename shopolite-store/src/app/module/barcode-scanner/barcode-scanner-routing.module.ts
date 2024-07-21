import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BarcodeScannerPage } from './barcode-scanner.page';

const routes: Routes = [
  {
    path: '',
    component: BarcodeScannerPage,
    data: {type: 'PRODUCT'}
  },
  {
    path: 'get-barcode',
    component: BarcodeScannerPage,
    data: {type: 'BARCODE'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarcodeScannerPageRoutingModule {}
