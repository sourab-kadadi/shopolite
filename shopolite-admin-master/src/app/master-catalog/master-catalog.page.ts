import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
// eslint-disable-next-line max-len
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../constants/system.const';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
// import { AuthService } from '../../login/auth.service';
import { MasterCatalogService } from './service/master-catalog.service';
import { ServiceService } from '../category/service/service.service';
import { SubCategoryService } from '../sub-category/service/subcategory.service';
@Component({
  selector: 'app-master-catalog',
  templateUrl: './master-catalog.page.html',
  styleUrls: ['./master-catalog.page.scss'],
})
export class MasterCatalogPage implements OnInit {
  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild('selectComponentCategory') selectComponentCategory: IonicSelectableComponent;
  @ViewChild('selectComponentSubCat') selectComponentSubCat: IonicSelectableComponent;

  data: Array<any>;
  totalCount: number;
  categoriesData: any[] = [];
  subCategoriesData: any[] = [];
  categoryChanged = false;
  subCategoryChanged = false;

  filter = {
    page: 0,
    count: 10,
    search: '',
    categoryId: '',
    subCategoryId: '',
    comment: '',
    verified: null,
    updatedDateSort: '',
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

  s3path: any = environment.s3Url;
  catalogData: any[] = [];
  isActive = false;
  itemCat: any;
  itemSubCat: any;
  private filterTimeOut: any = null;
  constructor(
    private masterCatalogservice: MasterCatalogService,
    private categoryService: ServiceService,
    private subCategoryservice: SubCategoryService,
    private router: Router,
    private loadingCtrl: LoadingController,
    public platform: Platform,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private ngxUiLoader: NgxUiLoaderService,
    // private uploadService: UploadService,
    public alertController: AlertController,
    private route: ActivatedRoute,
  ) {
    // this.mode = this.route.snapshot.data.mode;
    // this.categoryId = this.route.snapshot.paramMap.get('category_id');
    this.data = new Array<any>();

  }
  ngOnInit() {
    this.getAllCategories();
    this.getAllSubCategories();
    this.getAllCatalogs();
  }

  ionViewWillEnter() {
    // this.catalogData = [];


    console.log('temp');
  }

  async getAllCatalogs() {
    // this.isLoading = true;
    // this.isActive = false;


    this.ngxUiLoader.startLoader('loader-category-list');
    // eslint-disable-next-line max-len

    await this.masterCatalogservice.getCatalogOnCatIDSubCatId(this.filter.categoryId, this.filter.subCategoryId, this.filter).subscribe(res => {
      console.log(res, 'res');


      this.ngxUiLoader.stopLoader('loader-category-list');
      if (res.data) {
        this.data = res.data;
        this.totalCount = res.totalCount;
        // this.catalogData = [...this.catalogData, ...res.data];
        // this.isActive = true;
      }
      console.log(this.catalogData);
      if (res.status === false) {
        this.presentAlert(res.message || 'No Details Found !!!');
      }
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

  async getAllCategories() {
    // this.isLoading = true;
    // this.isActive = false;

    this.ngxUiLoader.startLoader('loader-category-list');
    await this.categoryService.getCategory(this.filterDropdownCat).subscribe(res => {
      console.log(res, 'res');
      this.ngxUiLoader.stopLoader('loader-category-list');
      if (res.data) {
        this.categoriesData = res.data;
        this.isActive = true;
      }
      console.log(this.categoriesData);
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

  async getAllSubCategories() {
    // this.isLoading = true;
    // this.isActive = false;

    this.ngxUiLoader.startLoader('loader-category-list');
    await this.subCategoryservice.getSubCategory(this.filterDropdownSubCat).subscribe(res => {
      console.log(res, 'res');
      this.ngxUiLoader.stopLoader('loader-category-list');
      if (res.data) {
        this.subCategoriesData = res.data;
        this.isActive = true;
      }
      console.log(this.categoriesData);
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
      duration: 1500
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


  doRefresh(event) {
    this.catalogData = [];
    this.filter.page = 0;
    // this.infiniteScroll.disabled = false;
    this.getAllCatalogs();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }


  pageChanged(event) {
    this.filter.page = event;
    this.getAllCatalogs();
  }

  itemChangeCategory(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {

    this.filter.page = 0;
    // eslint-disable-next-line no-underscore-dangle
    this.filter.categoryId = event.value._id;
    this.filter.subCategoryId = '';
    // eslint-disable-next-line no-underscore-dangle
    this.filterDropdownSubCat.categoryId = event.value._id;


    this.getAllCatalogs();
    this.getAllSubCategories();
    // this.categoryChanged = true;

  }

  itemChangeSubCat(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    this.filter.page = 0;
    // eslint-disable-next-line no-underscore-dangle
    this.filter.subCategoryId = event.value._id;
    this.getAllCatalogs();
    // this.categoryChanged = !this.categoryChanged;
  }

  openLink(itemId) {
    const url = 'master-catalog/update/' + itemId;
    window.open(url, '_blank');
  }


  onSearchChange(event) {
    this.filter.search = event.detail.value;
    if (this.filter.search === '') {
      this.filter.page = 0;
      this.catalogData = [];
      this.getAllCatalogs();
      return;
    }
    if (this.filterTimeOut) {
      this.filterTimeOut = clearTimeout(this.filterTimeOut);
    }
    this.filterTimeOut = setTimeout(() => {
      this.catalogData = [];
      this.filter.page = 0;
      console.log(this.filter);
      this.getAllCatalogs();
    }, 500);
  }


  pageChange(event) {
    console.log(event);
    console.log(event.detail.value);
    this.filter.page = event.detail.value;
    if (this.filter.page === null) {
      this.catalogData = [];
      this.getAllCatalogs();
      return;
    }
    this.catalogData = [];
    this.getAllCatalogs();
  }



  onDropdownSelectionFilter(event) {
    console.log(event)
    if (event.detail.value === 'VERIFIED') {
      this.filter.verified = true;
      this.filter.page = 0;
      console.log(this.filter)
      this.catalogData = [];
      this.getAllCatalogs();
    } else if (event.detail.value === 'NOTVERIFIED') {
      console.log(this.filter);
      this.filter.verified = false;
      this.filter.page = 0;
      this.catalogData = [];
      console.log(this.filter)
      this.getAllCatalogs();
    }
  }





}
