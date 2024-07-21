import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../../constants/system.const';
// import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
// import { Directory, Filesystem } from '@capacitor/filesystem';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { UploadService } from '../../service/service/upload.service';
import { environment } from '../../../environments/environment.prod';
import { HttpEventType } from '@angular/common/http';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-create-update-category',
  templateUrl: './create-update-category.page.html',
  styleUrls: ['./create-update-category.page.scss'],
})
export class CreateUpdateCategoryPage implements OnInit {

  value = 0;
  bufferValue = 100;
  progressBarVisible = false;
  imageData: any;
  s3path: any = environment.s3Url;

  // images: LocalFile[] = []; //for camera
  signedUrl: any;
  // image: any;

  mode: 'create' | 'update' = 'create';
  categoryId: string;
  // imagesPaths = [];
  isActive = true;

  // image: any = this.formBuilder.group({
  //   filePath: ['', [Validators.required]],
  //   type: ['', [Validators.required]],
  // });

  categoryForm: any = this.formBuilder.group({
    name: ['', [Validators.required]],
    status: [, [Validators.required]],
    manualRanking: []
    // image: this.formBuilder.group({
    //   filePath: [, [Validators.required]],
    //   type: [, [Validators.required]]
    // }),
  });

  constructor(
    private service: ServiceService,
    private router: Router,
    private loadingCtrl: LoadingController,
    public platform: Platform,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private ngxUiLoader: NgxUiLoaderService,
    private uploadService: UploadService,
    public alertController: AlertController,
        private route: ActivatedRoute,
  ) {
    this.mode = this.route.snapshot.data.mode;
    this.categoryId = this.route.snapshot.paramMap.get('category_id');
  }

  ngOnInit() {
    console.log(this.mode);
    if (this.mode === 'update') {
      this.ngxUiLoader.startLoader('loader-category-add');
      this.service.getCategoryById(this.categoryId).subscribe(res => {
        this.ngxUiLoader.stopLoader('loader-category-add');
        console.log(res);
        console.log(this.categoryForm, 'before');
        this.categoryForm.patchValue({
          name: res.data.name,
          status: res.data.status,
          manualRanking: res.data.manualRanking
        });
        console.log(this.categoryForm);
        this.imageData = res.data.image;
        // this.product = res.data;
        // if (!res.data.image || !res.data.image[0]?.filePath || res.data.image[0]?.filePath === 'string' || res.data.image[0]?.filePath === null ) {
        //   this.imagePresent = false;
        // }
        // this.isLoading = false;
        // this.inActive = false;
      }, error => {
        // this.isLoading = false;
        // this.inActive = true;
        this.ngxUiLoader.stopLoader('loader-category-add');
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      });
  };
}


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message,
      cssClass: 'my-custom-class',
      translucent: true,
      buttons: ['OK']
    });
    await alert.present();
  }



  async createCategory() {
    this.ngxUiLoader.startLoader('loader-category-add');
    // console.log("sdsdsds", this.image);
    // console.log(this.form.value);


    if (this.imageData && this.imageData.filePath) {
      const category = this.categoryForm.value;
      category.image = this.imageData;
      console.log(category.image);
      this.service.createCategory(category).subscribe((res) => {
          // this.ngxUiLoader.stopLoader("loader-01");
          // this.toastr.success("Category Successfully Creatred", "Sccess!!");
          this.ngxUiLoader.stopLoader('loader-category-add');
          this.router.navigate(['/category']);
          this.presentToast(MessageLib.CREATED_SUCCESS);
        }, error => {
          this.ngxUiLoader.stopLoader('loader-category-add');
          console.log(error);
          this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        }
      );
    } else {
      this.ngxUiLoader.stopLoader('loader-category-add');
      this.presentAlert('Please upload image');
    }

}

save() {
  if (this.mode === 'create') {
    this.createCategory();
  } else if (this.mode === 'update') {
    this.updateCategory();
  }
}

async updateCategory() {
  this.ngxUiLoader.startLoader('loader-category-add');
  const category = this.categoryForm.value;
  if (this.imageData && this.imageData.filePath) {
    // const category = this.categoryForm.value;
    category.image = this.imageData;
    // category.image = await this.uploadFileToS3(this.image.file).catch(
    //   ({error}) => {
    //     // this.ngxUiLoader.stopLoader("loader-01");
    //     this.presentAlert(error.message || "Unable to upload the image");
    //     return 1;
    //   }
    // );
  }
  console.log(this.categoryId, category);
  this.service.updateCategoryById(this.categoryId, category).subscribe(
    (res) => {
      console.log(res, 'update');
      this.ngxUiLoader.stopLoader('loader-category-add');
      this.router.navigate(['/category']);
      this.presentToast(MessageLib.UPDATED_SUCCESS);
      // this.ngxUiLoader.stopLoader("loader-01");
      // this.toastr.success("Successfully Updated Category", "Success!!");
      // this.navigateToCategoryList();
    },
    ({error}) => {
      this.ngxUiLoader.stopLoader('loader-category-add');
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    }
  );
}


saveImage(event) {
  this.imageData = event;
  console.log('this.image', event);
  this.categoryForm.patchValue({
    image: {
      filePath: this.imageData.filePath,
      type: this.imageData.type
    },
  });
}


//   deleteImage(i) {
//     this.imagesPaths.splice(i, 1);
//     // this.imageData.reset();
//     // this.saveImage(this.imageData);
//     // this.onSave.emit({data: this.imageData});
//   }

isCreateMode() {
  return this.mode === 'create';
}

isUpdateMode() {
  return this.mode === 'update';
}

deleteFile() {
  this.imageData = null;
  // this.imageData.reset();
  // this.saveImage(this.imageData);
  // this.onSave.emit({data: this.imageData});
}











  async uploadFileToS3(event: any) {
    this.value = 0;
    this.progressBarVisible = true;
    let file = event.target.files[0];
    console.log(file, 'file');
    this.ngxUiLoader.startLoader('loader-category-add');
    // this.isActive = false;
    let presignedUrl: any = await this.uploadService.getS3Url().toPromise();
    this.uploadService.uploadS3(file, presignedUrl.data.url, presignedUrl.data.fields).subscribe(data => {
      this.ngxUiLoader.stopLoader('loader-category-add');
      // this.isActive = true;
      if (data.type === HttpEventType.Response) {
        this.progressBarVisible = false;
        // this.imageData = {filePath: presignedUrl.data.fields.key, type: file.type, fileName: file.name, name: file.name};
        this.imageData = { filePath: presignedUrl.data.fields.key, type: file.type };
        // this.onSave.emit({data: this.imageData});
        // this.saveImage(this.imageData);
      }
      if (data.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * data.loaded / data.total);
        this.value = percentDone;
      }
       }   , error => {
        // this.isActive = true;
        this.ngxUiLoader.stopLoader('loader-category-add');
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      });
  }



ionViewWillLeave() {
    this.categoryForm.reset();
}




//   ionViewWillLeave() {
//     this.productForm.reset();
//     // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
//     const control = <FormArray>this.productForm.get('morphologicalCharacters');
//     control.controls = [];
//     // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
//     const con = <FormArray>this.productForm.get('specialFeaturesUSPS');
//     con.controls = [];
//     this.resetMorfButton = false;
//     this.morfActive = false;
//     this.isMorf = false;
//     this.featureActive = false;
//     this.resetFeatureButton = false;
//   }

}
