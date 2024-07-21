import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExcelDumpPageRoutingModule } from './excel-dump-routing.module';

import { ExcelDumpPage } from './excel-dump.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedModule } from '../shared/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExcelDumpPageRoutingModule,
    SharedModule,
    IonicSelectableModule,
    NgxPaginationModule
  ],
  declarations: [ExcelDumpPage]
})
export class ExcelDumpPageModule {}
