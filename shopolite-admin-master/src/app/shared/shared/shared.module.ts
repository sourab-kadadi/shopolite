import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ngxUiLoaderConfig } from '../../constants/system.const';
import { ReactiveFormsModule } from '@angular/forms';
// import { ImageUploadModule } from '../../module/image-upload/image-upload.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    ReactiveFormsModule,
    // ImageUploadModule
  ],
  exports: [
    NgxUiLoaderModule,
    ReactiveFormsModule,
    // ImageUploadModule
  ]
})
export class SharedModule { }
