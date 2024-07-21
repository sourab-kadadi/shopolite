import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExcelDumpPage } from './excel-dump.page';

const routes: Routes = [
  {
    path: '',
    component: ExcelDumpPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExcelDumpPageRoutingModule {}
