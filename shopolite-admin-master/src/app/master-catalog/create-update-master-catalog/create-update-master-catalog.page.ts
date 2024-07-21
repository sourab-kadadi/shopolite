import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonSearchbar, LoadingController } from '@ionic/angular';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../../constants/system.const';
// import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
// import { Directory, Filesystem } from '@capacitor/filesystem';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { UploadService } from '../../service/service/upload.service';
import { environment } from '../../../environments/environment.prod';
import { HttpEventType } from '@angular/common/http';
import {MasterCatalogService } from '../service/master-catalog.service';
import { ServiceService } from '../../category/service/service.service';
import { SubCategoryService } from '../../sub-category/service/subcategory.service';

@Component({
  selector: 'app-create-update-master-catalog',
  templateUrl: './create-update-master-catalog.page.html',
  styleUrls: ['./create-update-master-catalog.page.scss'],
})
export class CreateUpdateMasterCatalogPage implements OnInit {
  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild('selectComponentCategory') selectComponentCategory: IonicSelectableComponent;
  @ViewChild('selectComponentSubCat') selectComponentSubCat: IonicSelectableComponent;
  value = 0;
  bufferValue = 100;
  progressBarVisible = false;
  imageData: any;
  mediaData: any[] = [];
  imageItem: any;
  s3path: any = environment.s3Url;
  verifiedDate: Date;
  filter = {
    page: 0,
    count: 100,
    search: '',
  };

  filterDropdownCat = {
    page: 0,
    count: 1500,
    search: '',
    categoryId: '',
  };


item: any;
  // images: LocalFile[] = []; //for camera
  signedUrl: any;
  // image: any;
  imageSingle: boolean;

  mode: 'create' | 'update' = 'create';
  catalogId: any;
  categoryId: any;
  categoryName: string;
  subcategoryId: any;
  subCategoryName: string;
  categoriesData: any[] = [];
  subCategoriesData: any[] = [];
  itemCat: any;
  itemSubCat: any;

  // imagesPaths = [];
  isActive = true;

  // image: any = this.formBuilder.group({
  //   filePath: ['', [Validators.required]],
  //   type: ['', [Validators.required]],
  // });
  // keyWord: any = this.formBuilder.group({
  //   name: [''],
  // });

  keyWordForm = this.formBuilder.group({
    name: [],
  });


  // keyWords = new FormArray([]);


  catalogForm: any = this.formBuilder.group({
    categoryId: [, [Validators.required]],
    categoryName: [, [Validators.required]],
    barcode: [, [Validators.required]],
    subCategoryId: [, [Validators.required]],
    subCategoryName: [, [Validators.required]],
    name: [, [Validators.required]],
    brandName: [, [Validators.required]],
    // description: [, [Validators.required]],
    status: [true, [Validators.required]],
    unitValue: [, [Validators.required]],
    unit: [, [Validators.required]],
    offerUnit: [],
    originalPrice: [, [Validators.required]],
    verified: [false, [Validators.required]],
    comment: [],
    // restaurantMenuDishType: [],
    skills: new FormArray([])
    // keyWord: this.formBuilder.array([])

    // image: this.formBuilder.group({
    //   filePath: [, [Validators.required]],
    //   type: [, [Validators.required]]
    // }),
  });


  constructor(
    private categoryService: ServiceService,
    private subCategoryservice: SubCategoryService,
    private masterCatalogservice: MasterCatalogService,
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
    console.log(this.mode);
    console.log(this.route);
    this.catalogId = this.route.snapshot.paramMap.get('catalog_id');
  }

  // get keyWord() {
  //   return this.catalogForm.controls.keyWord as FormArray;
  // }

  // eslint-disable-next-line @typescript-eslint/member-ordering

  // keyWord = this.catalogForm.get('keyWord') as FormArray;




  ngOnInit() {
    // if (this.mode === 'create') {

      this.getAllCategories();

    // }
    // console.log(this.mode);
    if (this.mode === 'update') {

      this.ngxUiLoader.startLoader('loader-catalog-add');
      this.masterCatalogservice.getCatalogById(this.catalogId).subscribe(res => {
        this.ngxUiLoader.stopLoader('loader-catalog-add');
        console.log(res);
        console.log(this.catalogForm, 'before');
        this.categoryName = res.data.categoryName;
        this.categoryId = res.data.categoryId;
        if (this.categoryName === 'Food & Meals' ) {
          this.catalogForm.addControl('restaurantMenuDishType',this.formBuilder.control([, [Validators.required]]));
          console.log(this.catalogForm);

          if (res.data.restaurantMenuDishType) {
            this.catalogForm.patchValue({
              restaurantMenuDishType: res.data.restaurantMenuDishType,
            });
          }

        }
        this.catalogForm.patchValue({
          categoryId: res.data.categoryId,
          categoryName: res.data.categoryName,
          barcode: res.data.barcode,
          subCategoryId: res.data.subCategoryId,
          subCategoryName: res.data.subCategoryName,
          name: res.data.name,
          brandName: res.data.brandName,
          status: res.data.status,
          unitValue: res.data.unitValue,
          unit: res.data.unit,
          offerUnit: res.data.offerUnit,
          originalPrice: res.data.originalPrice,
          verified: res.data.verified,
          comment: res.data.comment
          // restaurantMenuDishType: res.data?.restaurantMenuDishType,
        });
        console.log(this.catalogForm);
        // this.verifiedDate = res.data?.verifiedDate;
        this.itemCat = { _id: res.data.categoryId, name: res.data.categoryName, };
        this.itemSubCat = { _id: res.data.subCategoryId, name: res.data.subCategoryName, };
        this.item = res.data.categoryName;

        this.getAllSubCategories();
        console.log(this.item);
        console.log(this.catalogForm);
        this.imageData = res.data.image;
        this.mediaData = res.data.media;
        this.keyWordForm.patchValue({
        name:res.data.keyWord[0]
        });
        // this.product = res.data;
        // if (!res.data.image || !res.data.image[0]?.filePath || res.data.image[0]?.filePath === 'string' || res.data.image[0]?.filePath === null ) {
        //   this.imagePresent = false;
        // }
        // this.isLoading = false;
        // this.inActive = false;
      }, error => {
        // this.isLoading = false;
        // this.inActive = true;
        this.ngxUiLoader.stopLoader('loader-catalog-add');
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      });
  };
}





async getAllCategories() {
  // this.isLoading = true;
  // this.isActive = false;
console.log('treii');
  this.ngxUiLoader.startLoader('loader-category-list');
  await this.categoryService.getCategory(this.filter).subscribe(res => {
    console.log(res, 'res');
    this.ngxUiLoader.stopLoader('loader-category-list');
    if(res.data) {
      this.categoriesData = res.data;
      this.isActive = true;
    }
    console.log(this.categoriesData);
    if(res.status === false) {
      this.presentAlert(res.message || 'No Details Found !!!');
    }
    // if (this.salesOrders.length === res.totalCount) {
    //   this.infiniteScroll.disabled = true;
    // }
    // console.log(res);
    // this.isLoading = false;
    // this.isActive = true;


  }, error => {
    // this.isLoading = false;
    // this.isActive = false;
    this.ngxUiLoader.stopLoader('loader-category-list');
    // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  });
}

async getAllSubCategories() {
  // this.isLoading = true;
  // this.isActive = false;

  this.ngxUiLoader.startLoader('loader-category-list');
  await this.subCategoryservice.getSubCategoryByCategoryIdDropdown(this.categoryId).subscribe(res => {
    console.log(res, 'res');
    this.ngxUiLoader.stopLoader('loader-category-list');
    if(res.data) {
      this.subCategoriesData = res.data;
      this.isActive = true;
    }
    console.log(this.subCategoriesData);
    if(res.status === false) {
      this.presentAlert(res.message || 'No Details Found !!!');
    }
  }, error => {
    // this.isLoading = false;
    // this.isActive = false;
    this.ngxUiLoader.stopLoader('loader-category-list');
    // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  });
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



  async createCatalog() {



//     if (this.keyWordForm && this.keyWordForm.value > 0 ) {
      console.log(this.keyWordForm.value.name);
//       const catalog = this.catalogForm.value;

//     }
// console.log(this.catalogForm);


    if (this.imageData && this.imageData.filePath) {
      const catalog = this.catalogForm.value;
      catalog.image = this.imageData;
      catalog.keyWord= [this.keyWordForm.value.name];
      if (this.mediaData && this.mediaData.length>0) {
        catalog.media = this.mediaData;
      }
      this.ngxUiLoader.startLoader('loader-catalog-add');
      this.masterCatalogservice.createCatalog(catalog).subscribe((res) => {
          // this.toastr.success("Category Successfully Creatred", "Sccess!!");
          this.ngxUiLoader.stopLoader('loader-catalog-add');
          this.router.navigate(['/master-catalog']);
          this.presentToast(MessageLib.CREATED_SUCCESS);
        }, error => {
          this.ngxUiLoader.stopLoader('loader-catalog-add');
          console.log(error);
          this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        }
      );
    } else {
      this.ngxUiLoader.stopLoader('loader-catalog-add');
      this.presentAlert('Please upload image');
    }

}

save() {
  if (this.mode === 'create') {
    this.createCatalog();
  } else if (this.mode === 'update') {
    // this.updateCategory();
  }
}

async updateCatalog() {
  this.ngxUiLoader.startLoader('loader-catalog-add');
  const catalog = this.catalogForm.value;
  if (this.imageData && this.imageData.filePath) {
    catalog.image = this.imageData;
  }
  if (this.mediaData && this.mediaData.length>0) {
    catalog.media = this.mediaData;
  }
  console.log(this.subcategoryId, catalog);
  this.masterCatalogservice.updateCatalogById(this.catalogId, catalog).subscribe(
    (res) => {
      console.log(res, 'update');
      this.ngxUiLoader.stopLoader('loader-catalog-add');
      this.router.navigate(['/master-catalog']);
      this.presentToast(MessageLib.UPDATED_SUCCESS);
      // this.navigateToCategoryList();
    },
    ({error}) => {
      this.ngxUiLoader.stopLoader('loader-catalog-add');
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    }
  );
}


saveImage(event) {
  this.imageData = event;
  console.log('this.image', event);
  this.catalogForm.patchValue({
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


deleteFileMedia(i){
  this.mediaData.splice(i, 1);
}








  async uploadFileToS3(event: any, imageSingle?) {
    this.value = 0;
    this.progressBarVisible = true;
    let file = event.target.files[0];
    console.log(file, 'file');
    this.ngxUiLoader.startLoader('loader-catalog-add');
    // this.isActive = false;
    let presignedUrl: any = await this.uploadService.getS3Url().toPromise();
    this.uploadService.uploadS3(file, presignedUrl.data.url, presignedUrl.data.fields).subscribe(data => {
      this.ngxUiLoader.stopLoader('loader-catalog-add');
      // this.isActive = true;
      if (data.type === HttpEventType.Response) {
        this.progressBarVisible = false;
        // this.imageData = {filePath: presignedUrl.data.fields.key, type: file.type, fileName: file.name, name: file.name};
        this.imageItem = { filePath: presignedUrl.data.fields.key, type: file.type };
        // this.onSave.emit({data: this.imageData});
        if (imageSingle === false) {
this.imageData = this.imageItem;
console.log(this.imageData);
                  }

        if (imageSingle === true) {
console.log(this.imageItem);
          console.log(this.mediaData);
          this.mediaData.push(this.imageItem);

console.log(this.mediaData);
        }

        // this.saveImage(this.imageData);
      }



      if (data.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * data.loaded / data.total);
        this.value = percentDone;
      }
       }   , error => {
        // this.isActive = true;
        this.ngxUiLoader.stopLoader('loader-catalog-add');
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
        // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      });
  }



ionViewWillLeave() {
    this.catalogForm.reset();
}




itemChangeCategory(event: {
  component: IonicSelectableComponent;
  value: any;
}) {
  this.catalogForm.patchValue({
    // eslint-disable-next-line no-underscore-dangle
    categoryId : event.value._id,
    categoryName: event.value.name,
  });
  this.filter.page = 0;
  // eslint-disable-next-line no-underscore-dangle
// this.filter.categoryId = event.value._id;
// this.filter.subCategoryId = '';
// eslint-disable-next-line no-underscore-dangle
this.categoryName = event.value.name;
this.categoryId = event.value._id;
if (this.categoryName === 'Food & Meals' ) {
  this.catalogForm.addControl('restaurantMenuDishType',this.formBuilder.control([, [Validators.required]]));
} else {
  this.catalogForm.removeControl('restaurantMenuDishType');
}
// this.getAllCatalogs();
this.getAllSubCategories();
this.itemSubCat = null;
this.catalogForm.patchValue ({
  subCategoryId: '',
  subCategoryName: ''
});


// this.categoryChanged = true;

}

itemChangeSubCat(event: {
  component: IonicSelectableComponent;
  value: any;
}) {
  // this.filter.page = 0;
  // eslint-disable-next-line no-underscore-dangle
// this.filter.subCategoryId = event.value._id;
// this.getAllCatalogs();
// this.categoryChanged = !this.categoryChanged;
this.catalogForm.patchValue({
  // eslint-disable-next-line no-underscore-dangle
  subCategoryId : event.value._id,
  subCategoryName: event.value.name,

});

console.log(this.catalogForm);
}

dishTypeSelection(event) {
  console.log(event);
  this.catalogForm.addControl('restaurantMenuDishType',this.formBuilder.control([, [Validators.required]]));
  this.catalogForm.patchValue({
    restaurantMenuDishType: event.detail.value
  });
  console.log(this.catalogForm.value);
}





}
