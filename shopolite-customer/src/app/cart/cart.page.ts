import { ModalController, NavController } from '@ionic/angular';
import { VariationSelectionPage } from '../variation-selection/variation-selection.page';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthServiceService } from '../service/service/auth-service.service';
import { environment } from '../../environments/environment';
import { ServiceService } from './service/service.service';
import { MessageLib } from '../constants/system.const';
import { SubscribeService } from '../subscriber/subscribe.service';
import { StorageService } from '../service/service/storage.service';
import { ServiceService as ItemsService } from '../items/service/service.service';
import { CouponListPage } from '../model/coupon-list/coupon-list.page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  list: any[] = [];
  totalCartOriginalPrice: number = 0;
  totalCartDiscount: number = 0;
  totalCustomerOrderCost: number = 0;
  totalCartQuantity: number = 0;
  totalDeliveryCost: number = 0;
  totalCouponDiscount: number = 0;
  thresholdDeliveryText: string;
  // totalCustomerOrderCost: number = 0;
  couponDetails: any;
  note: string;

  storeCustomId: string;
  address: any;
  storeName: string;
  previousPage: string;
  couponCodeTemp: string;
  couponCode: string;
  isLoading = false;
  serverError = false;
  s3path: any = environment.s3Url;
  couponList: any[] = [];
  constructor(
    private modalController: ModalController,
    public platform: Platform,
    public service: ServiceService,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthServiceService,
    private addressSubject: SubscribeService,
    private navCtrl: NavController,
    public ionStorage: StorageService,
    private itemsService: ItemsService
  ) {
    this.storeCustomId = this.route.snapshot.paramMap.get('storeCustom_id');
    this.previousPage = `/items/${this.storeCustomId}`;
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getCart();
    this.getAddress();
    this.getCouponListDetails(this.storeCustomId);
  }

  getAddress() {
    this.ionStorage.get('defaultAddress').then((res) => {
      this.address = res;
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  applyCoupon(couponCodeTemp) {
    this.couponCode = couponCodeTemp;
    this.getCart(this.couponCode, true);
  }

  async getCart(couponCode?: string, noLoader?: boolean) {
    if (!noLoader) {
      this.isLoading = true;
    }
    this.serverError = false;
    let user = await this.auth.jwtDecoder();
    let address = await this.ionStorage.get('defaultAddress');
    this.ngxUiLoader.startLoader('loader-03');
    if (user) {
      this.service
        .getMyCart(this.storeCustomId, address?._id || '', couponCode || null)
        .subscribe(
          (res) => {
            this.list = res.data;
            this.storeName = res.data.length
              ? res.data[0].storeName
              : 'No Orders Found';
            this.totalCartQuantity = res.totalCartQuantity;
            this.totalCustomerOrderCost = res.totalCustomerOrderCost;
            this.totalCartOriginalPrice = res.totalCartOriginalPrice;
            this.totalCartDiscount = res.totalCartDiscount;
            this.totalDeliveryCost = res.totalDeliveryCost;
            this.thresholdDeliveryTextTemplate(res.isthresholdDeliveryKm, res.thresholdDeliveryKm);
            this.parseCouponDetails(res.couponDetails || null);
            // this.totalCustomerOrderCost = res.totalCustomerOrderCost;
            this.ngxUiLoader.stopLoader('loader-03');
            this.isLoading = false;
          },
          (error) => {
            // this.serverError = true;
            this.ngxUiLoader.stopLoader('loader-03');
            this.presentToast(
              error.message || MessageLib.INTERNAL_SERVER_ERROR
            );
          }
        );
    }
  }

  thresholdDeliveryTextTemplate(isthresholdDeliveryKm, thresholdDeliveryKm) {
    this.thresholdDeliveryText = isthresholdDeliveryKm
      ? `(upto ${thresholdDeliveryKm} km)`
      : thresholdDeliveryKm
      ? `(more than ${thresholdDeliveryKm} km)`
      : null;
  }

  parseCouponDetails(couponDetails) {
    this.couponDetails = couponDetails;
    if (couponDetails?.validate) {
      this.totalCouponDiscount = couponDetails?.discountAmount || 0;
    } else {
      this.totalCouponDiscount = 0;
    }
  }

  increment(quantity: number, productId: string, index: number) {
    this.updateStore(++quantity, productId, index);
  }

  decrement(quantity: number, productId: string, index: number) {
    this.updateStore(--quantity, productId, index);
  }

  OnKeyUp(event: any, productId: string, index: number) {
    this.updateStore(event.target.value, productId, index);
  }

  async updateStore(quantity: number, productId: string, index: number) {
    let used = await this.auth.jwtDecoder();
    if (used) {
      // this.ngxUiLoader.startLoader("loader-03");
      const cartReq: any = {
        storeCustomId: this.storeCustomId,
        productId: productId,
        quantity: quantity,
      };
      this.itemsService
        .updateCart(cartReq, this.address?._id || null, this.couponCode || null)
        .subscribe(
          (res) => {
            if (res.data.myCart) {
              this.list[index].totalSellingPrice =
                res.data.myCart.totalSellingPrice;
              this.list[index].totalOriginalPrice =
                res.data.myCart.totalOriginalPrice;
              this.list[index].totalDiscount = res.data.myCart.totalDiscount;
              this.list[index].quantity = res.data.myCart.quantity;
              this.list[index].sellingPrice = res.data.myCart.sellingPrice;
              this.list[index].unit = res.data.myCart.unit;
              this.list[index].unitValue = res.data.myCart.unitValue;
            } else if (res.data.myCart == null) {
              let array = this.list.splice(index, 1);
            }
            this.totalCartQuantity = res.data.totalCartQuantity;
            this.totalCustomerOrderCost = res.data.totalCustomerOrderCost;
            this.totalCartOriginalPrice = res.data.totalCartOriginalPrice;
            this.totalCartDiscount = res.data.totalCartDiscount;
            this.thresholdDeliveryTextTemplate(res.isthresholdDeliveryKm, res.thresholdDeliveryKm);
            this.parseCouponDetails(res?.data?.couponDetails || null);

            this.ngxUiLoader.stopLoader('loader-03');
          },
          (error) => {
            this.ngxUiLoader.stopLoader('loader-03');
            this.presentToast(
              error.message || MessageLib.INTERNAL_SERVER_ERROR
            );
          }
        );
    } else {
      this.router.navigate(['/login'], {
        queryParams: { backurl: this.router.url },
      });
    }
  }

  // saved_addresses() {
  //    this.route.navigate(['./saved-addresses']);
  //  }
  order() {
    if (!this.address._id) {
      this.presentToast(MessageLib.SELECT_ADDRESS);
      return;
    }
    this.isLoading = true;
    this.service
      .order(
        this.storeCustomId,
        this.address._id,
        this.note || null,
        this.couponCode || null
      )
      .subscribe(
        (res) => {
          this.navCtrl.navigateRoot(['./order-placed']);

          this.ngxUiLoader.stopLoader('loader-03');
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          if (error.status != 409)
            // this.serverError = true;
            this.ngxUiLoader.stopLoader('loader-03');
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        }
      );
  }

  async variation_selection(i) {
    const modal = await this.modalController.create({
      component: VariationSelectionPage,
      componentProps: {
        id: this.list[i]._id,
        productName: this.list[i].productName,
        brandName: this.list[i].brandName,
        image: this.list[i].image?.filePath,
        sellingPrice: this.list[i].sellingPrice,
        sku: this.list[i].sku,
        subCategoryName: this.list[i].subCategoryName,
        unitValue: this.list[i].unitValue,
        unit: this.list[i].unit,
        index: i,
        quantity: this.list[i]?.quantity,
      },
    });
    return await modal.present();
  }
  selectAddress() {
    this.router.navigate(['/saved-addresses', 'select'], {
      queryParams: { backUrl: `/cart/${this.storeCustomId}` },
    });
  }

  async couponListModel(couponList) {
    const modal = await this.modalController.create({
      component: CouponListPage,
      breakpoints: [0, 0.3, 0.5, 0.7, 1],
      initialBreakpoint: 0.3,
      componentProps: { couponList },
    });
    modal.onDidDismiss().then((code: any) => {
      if (code.data) {
        this.couponCodeTemp = code.data;
        this.applyCoupon(this.couponCodeTemp);
      }
    });
    return await modal.present();
  }

  getCouponListDetails(storeCustomId: string) {
    this.service.getAllCouponList(storeCustomId).subscribe((res) => {
      this.couponList = res.data;
    });
  }
}
