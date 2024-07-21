import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
// eslint-disable-next-line max-len
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../constants/system.const';
import { SubCategoryService } from './service/subcategory.service';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
// import { AuthService } from '../../login/auth.service';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.page.html',
  styleUrls: ['./sub-category.page.scss'],
})
export class SubCategoryPage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;

  filter = {
    page: 0,
    count: 300000,
    search: '',
  };
  s3path: any = environment.s3Url;
  subCategoryData: any[] = [];
  isActive = false;

  constructor(
    private service: SubCategoryService,
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
  }
  ngOnInit() {
    // this.getAllCategories();
  }

  ionViewWillEnter() {
        this.subCategoryData = [];
    this.getAllCategories();
    console.log('temp');
  }

  async getAllCategories() {
    // this.isLoading = true;
    // this.isActive = false;

    this.ngxUiLoader.startLoader('loader-subcategory-list');
    await this.service.getSubCategory(this.filter).subscribe(res => {
      console.log(res, 'res');
      this.ngxUiLoader.stopLoader('loader-subcategory-list');
      if(res.data) {
        this.subCategoryData = [...this.subCategoryData, ...res.data];
        this.isActive = true;
      }
      console.log(this.subCategoryData);
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
      this.ngxUiLoader.stopLoader('loader-subcategory-list');
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
    this.subCategoryData = [];
    this.filter.page = 0;
    // this.infiniteScroll.disabled = false;
    this.getAllCategories();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

}
