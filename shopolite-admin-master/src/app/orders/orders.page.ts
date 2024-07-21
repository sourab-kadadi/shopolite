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
import { ServiceService } from '../category/service/service.service';
import { SubCategoryService } from '../sub-category/service/subcategory.service';
import { OrdersService } from './service/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {


  data: Array<any>;
  totalCount: number;

  filter = {
    page: 0,
    count: 30,
  };

  s3path: any = environment.s3Url;
  ordersData: any[] = [];
  isActive = false;
  itemCat: any;
  itemSubCat: any;
  private filterTimeOut: any = null;
  constructor(
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
    private ordersService: OrdersService
  ) {
    // this.mode = this.route.snapshot.data.mode;
    // this.categoryId = this.route.snapshot.paramMap.get('category_id');
    this.data = new Array<any>();

  }
  ngOnInit() {
  }


  ionViewWillEnter() {
    this.getAllOrders();
  }

  async getAllOrders() {
    // this.isLoading = true;
    // this.isActive = false;
    this.ngxUiLoader.startLoader('loader-order-list');
    await this.ordersService.getOrders(this.filter).subscribe(res => {
      this.ngxUiLoader.stopLoader('loader-order-list');
      if (res.data) {
        this.data = res.data;
        this.totalCount = res.totalCount;
        // this.ordersData = [...this.ordersData, ...res.data];
        // this.isActive = true;
      }
      // console.log(this.ordersData);
      if (res.status === false) {
        // this.presentAlert(res.message || 'No Details Found !!!');
      }
      // this.isLoading = false;
      // this.isActive = true;
    }, error => {
      console.log('error')
      // this.isLoading = false;
      // this.isActive = false;
      this.ngxUiLoader.stopLoader('loader-order-list');
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      // this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
    });
  }








  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }





  order_info(documentId: string) {
    this.router.navigate(['./orders/manage', documentId]);
  }

  
  pageChanged(event) {
    console.log(event)
    this.filter.page = event;
    this.getAllOrders();
  }

  doRefresh(event) {
    this.data = [];
    this.filter.page = 0;
    // this.infiniteScroll.disabled = false;
    this.getAllOrders();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}












