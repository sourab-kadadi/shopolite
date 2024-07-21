import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { IonicModule } from '@ionic/angular';
import { SupportFabButtonComponent } from './support-fab-button/support-fab-button.component';



@NgModule({
  declarations: [SupportFabButtonComponent],
  imports: [
    CommonModule,
    IonicModule,

  ],
  exports: [
    SupportFabButtonComponent
  ]
})
export class ComponentsModule { }
