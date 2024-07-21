import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, IonInfiniteScroll, IonSlides, Platform, ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { MessageLib } from '../constants/system.const';
import { MyOrderService } from './service/my-order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('slides', { static: true }) slider: IonSlides;
  segment = 0;
 orderList: any[] = [];
 orderStatusButton: any[] = [];
 filter = {
  page: 0,
  count: 10,
  search: null,
  fromDate: null,
  toDate: null,
  orderStatus: null
};
orderType = null;
totalCount = 0;
s3path: any = environment.s3Url;

isLoading = false;
isInitial = true;
private filterTimeOut: any = null;



  constructor(
    private myOrderSevice: MyOrderService,
    public platform: Platform,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    public actionSheetController: ActionSheetController
    ) {
     }

  ngOnInit() {
    this.getOrderStatus();
  }


  ionViewWillEnter() {
    console.log("ENTER====");
    
    this.myOrder(true);
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  myOrder(init?: boolean, infinitScrollEvent?: any) {
    this.ngxUiLoader.startLoader("loader-03");
    if(this.isInitial === true) {
      this.isLoading = true;
    } else {
      this.isLoading = false;
    }
    // eslint-disable-next-line max-len
    this.myOrderSevice.myOrder(this.filter.page, this.filter.count, this.filter.search, this.filter.fromDate, this.filter.toDate, this.filter.orderStatus).subscribe(res => {
      this.orderList = init ? res.data : [...this.orderList, ...res.data ];
      console.log(this.orderList);
      this.totalCount = res.totalCount;
      this.infiniteScroll.disabled = false;
      if (this.orderList.length === res.totalCount) {
      this.infiniteScroll.disabled = true;
      }
      this.ngxUiLoader.stopLoader("loader-03");
      this.isLoading = false;
    }, error => {
      this.ngxUiLoader.stopLoader("loader-03");
      this.isLoading = false;
      this.isInitial = false;
      if (error.status === 404) {
        this.orderList = [];
        this.totalCount = 0;
      this.presentToast(error.message || MessageLib.ORDER_NOT_FOUND);
      } else {
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      }
    });
  }

  getOrderStatus() {
    this.myOrderSevice.getOrderStatusDropDown().subscribe(res => {
      let status = res.data.map((data: any) => { return {text: data.label.replace(
        /\w\S*/g,
        function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase().replaceAll('_', ' ');
        }
      ), data: data.value} });
      this.orderStatusButton = [...status, {text: "Clear", data: null}];
    });
  }


  loadData(event) {
    this.isInitial = false;
    setTimeout(() => {
      if (this.orderList.length === this.totalCount) {
        event.target.disabled = true;
      event.target.complete();
      } else {
        this.filter.page = ++this.filter.page;
        this.myOrder();
        event.target.complete();
      }
    }, 500);
    }


  async segmentChanged() {
    await this.slider.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }
 order_info(documentId: string) {
    this.router.navigate(['/order-info', documentId]);
  }

  doRefresh(event) {
    if (this.segment === 0) {
    this.orderList = [];
    this.filter.page = 0;
    this.infiniteScroll.disabled = false;
    this.myOrder();
  }
   setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async presentActionSheet() {
    this.infiniteScroll.disabled = false;
    this.isInitial = true;
    const actionSheet = await this.actionSheetController.create({
      header: 'Order Status',
      cssClass: 'my-custom-class',
      buttons: this.orderStatusButton
    });
    await actionSheet.present();
    const { data } = await actionSheet.onDidDismiss();
    this.filter.page = 0;
    this.filter.orderStatus = data;
    this.orderType = data;
    this.myOrder(true);
  }

  onChangeSearch(event) {
    this.filter.page = 0;
    if (this.filterTimeOut) {
      this.filterTimeOut = clearTimeout(this.filterTimeOut);
    }
    this.infiniteScroll.disabled = false;
    this.filterTimeOut = setTimeout(() => {
      // event.target.complete();
      this.myOrder();
    }, 500);
  }

}
