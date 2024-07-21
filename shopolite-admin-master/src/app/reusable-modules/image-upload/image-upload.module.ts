import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload.component';
import { IonicModule } from '@ionic/angular';
// import { Camera } from '@awesome-cordova-plugins/camera/ngx';



@NgModule({
  declarations: [
    ImageUploadComponent
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    ImageUploadComponent
  ],
  providers: [
    // Camera
],
})
export class ImageUploadModule { }
