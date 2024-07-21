import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonSearchbar, LoadingController } from '@ionic/angular';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../constants/system.const';
// import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
// import { Directory, Filesystem } from '@capacitor/filesystem';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { UploadService } from '../service/service/upload.service';
import { environment } from '../../environments/environment.prod';
import { HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
// eslint-disable-next-line max-len
// import { AuthService } from '../../login/auth.service';
import { MasterCatalogService } from '../master-catalog/service/master-catalog.service';
import { ServiceService } from '../category/service/service.service';
import { SubCategoryService } from '../sub-category/service/subcategory.service';
import { ExcelDumpService } from '../excel-dump/service/excel-dump.service';

@Component({
  selector: 'app-error-resolve-by-product',
  templateUrl: './error-resolve-by-product.page.html',
  styleUrls: ['./error-resolve-by-product.page.scss'],
})
export class ErrorResolveByProductPage implements OnInit {
  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild('selectComponentCategory') selectComponentCategory: IonicSelectableComponent;
  @ViewChild('selectComponentSubCat') selectComponentSubCat: IonicSelectableComponent;
  @ViewChild('selectComponentKeyWord') selectComponentKeyWord: IonicSelectableComponent;
  value = 0;
  bufferValue = 100;
  progressBarVisible = false;
  imageData: any;
  mediaData: any[] = [];
  imageItem: any;
  s3path: any = environment.s3Url;
  totalRemaining: any;
  errorMessage: any;
  referenceName: any;
  filter = {
    page: 0,
    count: 1,
    search: '',
  };

  filterDropdownCat = {
    page: 0,
    count: 1500,
    search: '',
    categoryId: '',
  };

  filterDropdownSubCat = {
    page: 0,
    count: 1500,
    search: '',
    categoryId: '',
    subCategoryId: ''
  };

  item: any;
  itemKeyWord: any;
  storeProductName: any;
  // images: LocalFile[] = []; //for camera
  signedUrl: any;
  // image: any;
  imageSingle: boolean;
  subCategoryNameRef: string;
  mode: 'create' | 'update' = 'create';
  catalogId: any;
  subcategoryId: string;
  categoriesData: any[] = [];
  subCategoriesData: any[] = [];
  itemCat: any;
  itemSubCat: any;
  imagesExcel: any[] = [];
  // imagesPaths = [];
  isActive = true;
  excelCatalogId: any;
  categoryNameSelect: any;
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

  //   keyWordsArray: any;
  //   keyWordFruits = ["Fresh Vegetables","Herbs & Seasonings","Fresh Fruits","Organic Fruits & Vegetables","Cuts & Sprouts","Exotic Fruits & Veggies","Flower Bouquets", 'Bunches'];
  //   keyWordFoodgrains = ["Atta", "Flours & Sooji","Rice & Rice Products","Dals & Pulses","Organic Staples","Edible Oils & Ghee","Salt", "Sugar & Jaggery","Masalas & Spices",'Dry Fruits'];
  //   keyWordBakery = ["Dairy","Breads & Buns","Non Dairy","Gourmet Breads","Cookies", "Rusk & Khari","Ice creams & Desserts","Bakery Snacks",'Cakes & Pastries'];
  //   keyWordBeverages = ['Energy & Soft drinks',"Water ","Health Drink"," Supplement","Tea","Coffee","Fruit Juices & Drinks"];
  // keyWordSnacks = ['Noodle, Pasta, Vermicelli','Breakfast Cereals','Frozen Veggies & Snacks','Biscuits & Cookies','Snacks & Namkeen ','Spreads,Sauces, Ketchup ','Ready to cook & Eat ','Chocolates & Candies','Pickles & Chutney','Indian Mithai'];
  // keyWordBeauty = ['Oral Care','Feminine Hygiene','Bath & Hand Wash','Hair Care ','Health & Medicine','Mens Grooming ','Skin Care ','Makeup','Fragrances & Deos'];
  // keyWordCleaning = ['Detergents & Dishwash','All Purpose Cleaners ','Disposables, Garbage Bag ','Fresheners & Repellents','Mops, Brushes & Scrubs','Car & Shoe Care','Pooja Needs','Stationery','Bins & Bathroom Ware','Party & Festive Needs'];
  // keyWordKitchen = ['Pet Food & Accessories','Appliances & Electricals','Steel Utensils','Gardening','Kitchen Accessories','Cookware & Non Stick','Flask & Casserole','Bakeware','Crockery & Cutlery ','Storage & Accessories'];
  // keyWordEggs = ['Eggs ','Sausages, Bacon & Salami','Mutton & lamb ','Marinades','Fish & Seafood ','Pork & Other Meats'];
  // keyWordGourmet = ['Oil & Vinegar','Dairy & Cheese','Snacks, Dry Fruits, Nuts','Pasta, Soup & Noodles ','Cereals & Breakfast','Sauces, Spreads & Dips','Chocolates & Biscuits','Cookiing & Baking Needs','Drinks & Beverages','Tinned & Processed Food'];
  // keyWordBabyCare = ['Diapers & Wipes','Baby Bath & Hygiene','Baby food & Formula','Mothers & Maternity','Feeding & Nursing','Baby Accessories'];





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
    skills: new FormArray([])
    // keyWord: this.formBuilder.array([])

    // image: this.formBuilder.group({
    //   filePath: [, [Validators.required]],
    //   type: [, [Validators.required]]
    // }),
  });


  constructor(
    private excelDumpService: ExcelDumpService,
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
    this.getAllSubCategories();
    // }
    // console.log(this.mode);
    // if (this.mode === 'update') {

    this.ngxUiLoader.startLoader('loader-excel-error');
    this.excelDumpService.getExcelDumpAll(this.filter).subscribe(res => {
      this.ngxUiLoader.stopLoader('loader-excel-error');
      this.catalogForm.patchValue({
        categoryId: res.data[0].data.CATEGORY_ID,
        categoryName: res.data[0].data.CATEGORY_NAME,
        barcode: res.data[0].data.BARCODE,
        subCategoryId: res.data[0].data.SUB_CATEGORY_ID,
        subCategoryName: res.data[0].data.SUB_CATEGORY,
        name: res.data[0].data.FULL_PRODUCT_NAME,
        brandName: res.data[0].data.BRAND,
        // status: res.data[0].data.status,
        unitValue: res.data[0].data.UNIT_VALUE,
        unit: res.data[0].data.UNIT,
        offerUnit: res.data[0].data.MULTIPACK,
        originalPrice: res.data[0].data.MRP,
      });
      this.storeProductName = res.data[0].data.PRODUCT_NAME;
      // this.item = res.data.categoryName;
      this.categoryNameSelect = res.data[0].data.CATEGORY_NAME;
      // this.imageData = res.data[0].data.PRODUCT_IMAGE_FRONT;
      // this.mediaData = res.data.media;
      this.keyWordForm.patchValue({
        name: res.data[0].data.KEY_WORD
      });
      // eslint-disable-next-line no-underscore-dangle
      this.excelCatalogId = res.data[0]._id;
      this.totalRemaining = res.totalCount;
      this.errorMessage = res.data[0].error;
      this.referenceName = res.data[0].referenceName;


      this.imagesExcel[0] = res.data[0]?.data?.PRODUCT_IMAGE_FRONT;

      this.imagesExcel[1] = res.data[0]?.data?.IMG_1;
      this.imagesExcel[2] = res.data[0]?.data?.IMG_2;
      this.imagesExcel[3] = res.data[0]?.data?.IMG_3;
      this.imagesExcel[4] = res.data[0]?.data?.IMG_4;
      this.imagesExcel[5] = res.data[0]?.data?.IMG_5;

      // if(res.data[0] && res.data[0].data.SUB_CATEGORY) {
      //   this.keyWordSelectorFunction(res.data[0].data.SUB_CATEGORY);
      // }

      // this.isLoading = false;
      // this.inActive = false;


    }, error => {
      // this.isLoading = false;
      // this.inActive = true;
      this.ngxUiLoader.stopLoader('loader-excel-error');
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
    // };
  }





  async getAllCategories() {
    // this.isLoading = true;
    // this.isActive = false;
    this.ngxUiLoader.startLoader('loader-category-list');
    await this.categoryService.getCategory(this.filter).subscribe(res => {
      this.ngxUiLoader.stopLoader('loader-category-list');
      if (res.data) {
        this.categoriesData = res.data;
        this.isActive = true;
      }
      if (res.status === false) {
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
    await this.subCategoryservice.getSubCategory(this.filterDropdownSubCat).subscribe(res => {
      this.ngxUiLoader.stopLoader('loader-category-list');
      if (res.data) {
        this.subCategoriesData = res.data;
        this.isActive = true;
      }
      if (res.status === false) {
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
    //       const catalog = this.catalogForm.value;

    //     }
    // console.log(this.catalogForm);



    if (this.imageData && this.imageData.filePath) {
      const catalog = this.catalogForm.value;
      catalog.image = this.imageData;
      catalog.keyWord = [this.keyWordForm.value.name];
      if (this.mediaData && this.mediaData.length > 0) {
        catalog.media = this.mediaData;
      }
      this.ngxUiLoader.startLoader('loader-excel-error');
      this.masterCatalogservice.createCatalog(catalog).subscribe((res) => {
        // this.toastr.success("Category Successfully Creatred", "Sccess!!");
        if (res.status === true) {
          this.deleteExcelData();
        }

        this.ngxUiLoader.stopLoader('loader-excel-error');

        this.presentToast(MessageLib.CREATED_SUCCESS);
      }, error => {
        this.ngxUiLoader.stopLoader('loader-excel-error');
if (error.log.status === 409 && error.log.response === "barcode Aleary Exist" ) {
  this.deleteExcelData();
}
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      }
      );
    } else {
      this.ngxUiLoader.stopLoader('loader-excel-error');
      this.presentAlert('Please upload image');
    }

  }




  // keyWordSelectorFunction(subCategoryName) {
  //   console.log(subCategoryName);
  //   if (subCategoryName === "Fruits & Vegetables") {
  // this.keyWordsArray = this.keyWordFruits;
  //   } else if (subCategoryName === "Foodgrains, Oil & Masala") {
  //     this.keyWordsArray = this.keyWordFoodgrains;
  //   } else if (subCategoryName === "Bakery, Cakes & Dairy") {
  //     this.keyWordsArray = this.keyWordBakery;
  //   } else if (subCategoryName === "Beverages") {
  //     this.keyWordsArray = this.keyWordBeverages;
  //   } else if (subCategoryName === "Snacks & Branded Foods") {
  //     this.keyWordsArray = this.keyWordSnacks;
  //   } else if (subCategoryName === "Beauty & Hygiene") {
  //     this.keyWordsArray = this.keyWordBeauty;
  //   } else if (subCategoryName === "Cleaning & Household") {
  //     this.keyWordsArray = this.keyWordCleaning;
  //   } else if (subCategoryName === "Kitchen, Garden & Pets") {
  //     this.keyWordsArray = this.keyWordKitchen;
  //   } else if (subCategoryName === "Eggs, Meat & Fish") {
  //     this.keyWordsArray = this.keyWordEggs;
  // } else if (subCategoryName === "Gourmet & World Food") {
  //   this.keyWordsArray = this.keyWordGourmet;
  // } else if (subCategoryName === "Baby Care") {
  //   this.keyWordsArray = this.keyWordBabyCare;
  // }




  // }




  save() {
    if (this.mode === 'create') {
      this.createCatalog();
    } else if (this.mode === 'update') {
      // this.updateCategory();
    }
  }

  async deleteExcelData() {
    this.ngxUiLoader.startLoader('loader-excel-error');
    this.excelDumpService.deleteExcelDumpById(this.excelCatalogId).subscribe((res) => {
      // this.toastr.success("Category Successfully Creatred", "Sccess!!");
      if (res.status === true) {
        // window.location.reload();
        this.ngOnInit();
this.imageData= null;
this.mediaData=[];


        // this.router.navigate(['/error-resolve-by-product']);
      }
      this.ngxUiLoader.stopLoader('loader-excel-error');
      this.presentToast(MessageLib.DATA_UPDATE_SUCCESS);
    }, error => {
      this.ngxUiLoader.stopLoader('loader-excel-error');
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
  }




  saveImage(event) {
    this.imageData = event;

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


  deleteFileMedia(i) {
    this.mediaData.splice(i, 1);
  }








  async uploadFileToS3(event: any, imageSingle?) {
    this.value = 0;
    this.progressBarVisible = true;
    let file = event.target.files[0];
    this.ngxUiLoader.startLoader('loader-excel-error');
    // this.isActive = false;
    let presignedUrl: any = await this.uploadService.getS3Url().toPromise();
    this.uploadService.uploadS3(file, presignedUrl.data.url, presignedUrl.data.fields).subscribe(data => {
      this.ngxUiLoader.stopLoader('loader-excel-error');
      // this.isActive = true;
      if (data.type === HttpEventType.Response) {
        this.progressBarVisible = false;
        // this.imageData = {filePath: presignedUrl.data.fields.key, type: file.type, fileName: file.name, name: file.name};
        this.imageItem = { filePath: presignedUrl.data.fields.key, type: file.type };
        // this.onSave.emit({data: this.imageData});
        if (imageSingle === false) {
          this.imageData = this.imageItem;
        }

        if (imageSingle === true) {
          this.mediaData.push(this.imageItem);

        }

        // this.saveImage(this.imageData);
      }



      if (data.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * data.loaded / data.total);
        this.value = percentDone;
      }
    }, error => {
      // this.isActive = true;
      this.ngxUiLoader.stopLoader('loader-excel-error');
      this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    });
  }



  ionViewWillLeave() {
    this.catalogForm.reset();
  }


  itemChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.catalogForm.patchValue({
      // eslint-disable-next-line no-underscore-dangle
      categoryId: event.value._id,
      categoryName: event.value.name,

    });
    // eslint-disable-next-line no-underscore-dangle

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

  itemChangeCategory(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.catalogForm.patchValue({
      // eslint-disable-next-line no-underscore-dangle
      categoryId: event.value._id,
      categoryName: event.value.name,

    });
    this.filter.page = 0;
    // eslint-disable-next-line no-underscore-dangle
    // this.filter.categoryId = event.value._id;
    // this.filter.subCategoryId = '';
    // eslint-disable-next-line no-underscore-dangle
    this.filterDropdownSubCat.categoryId = event.value._id;


    // this.getAllCatalogs();
    this.getAllSubCategories();
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
      subCategoryId: event.value._id,
      subCategoryName: event.value.name,

    });
    this.subCategoryNameRef = event.value.name;


  }





}
