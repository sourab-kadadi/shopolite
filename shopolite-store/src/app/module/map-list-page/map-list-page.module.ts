import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapListPagePageRoutingModule } from './map-list-page-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { MapListPagePage } from './map-list-page.page';
import { SharedModule } from '../../shared/shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'src/environments/environment';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapListPagePageRoutingModule,
    TranslateModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsAPIKey
    })
  ],
  declarations: [MapListPagePage]
})
export class MapListPagePageModule {}
