import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { VariationSelectionPage } from '../variation-selection/variation-selection.page';
import { IonSlides } from '@ionic/angular';
import {
  Router,
  ActivatedRoute,
  RoutesRecognized,
  NavigationEnd,
} from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthServiceService } from '../service/service/auth-service.service';
import { environment } from '../../environments/environment';
import { ServiceService } from './service/service.service';

import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  zoomInOnEnterAnimation,
  zoomInUpOnEnterAnimation,
  zoomOutDownOnLeaveAnimation,
  zoomOutOnLeaveAnimation,
} from 'angular-animations';
import {
  MessageLib,
  ngXFgsType,
  ngXLoaderType,
  restaurantMenuDishType,
} from '../constants/system.const';
import { StorageService } from '../service/service/storage.service';
import { SearchItemPage } from './search-item/search-item.page';
import { ActionSheetController } from '@ionic/angular';
import { CouponDetailsPage } from '../model/coupon-details/coupon-details.page';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
  animations: [
    fadeInOnEnterAnimation({ delay: 1000 }),
    fadeOutOnLeaveAnimation(),
    zoomInOnEnterAnimation({ duration: 500, delay: 1000 }),
    zoomInUpOnEnterAnimation({ duration: 500, delay: 1000 }),
    zoomOutOnLeaveAnimation({ duration: 100, delay: 500 }),
    zoomOutOnLeaveAnimation({ duration: 100, delay: 500 }),
    zoomOutDownOnLeaveAnimation(),
  ],
})
export class ItemsPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('slides', { static: true }) slider: IonSlides;
  @ViewChild(IonContent) content: IonContent;

  segment = 0;
  products: any[] = [];
  s3path: any = environment.s3Url;
  categoryId: string;
  subCategoryId: string;
  storeCustomId: string;
  totalCartCost = 0;
  totalCartQuantity = 0;
  storeInfo: any;
  filter = {
    page: 0,
    count: 10,
    search: '',
    location: '',
    type: null,
  };
  lat: any;
  long: any;

  result: string;

  isInitial = true;
  serverError = false;
  productDetailToggle = false;
  isLoadingOnlyProducts = false;
  isLoadingStore = false;

  //dish type for restaurant only
  filterDishType = {
    veg: false,
    nonVeg: false,
    egg: false,
    all: true,
  };

  restaurantMenuDishTypes = restaurantMenuDishType;

  totalCount = 0;
  public loaderType: string = ngXLoaderType;
  spinner = ngXFgsType;
  subCategory: any[] = [];

  previosUrl: any;
  searchToggle = false;
  private filterTimeOut: any = null;


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
    public ionStorage: StorageService,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.storeCustomId = this.route.snapshot.paramMap.get('storeCustom_id');
    this.previosUrl = '/stores/' + this.storeCustomId;
  }

  getCurrentRoute() {
    try {
    } catch (error) {}
  }

  ngOnInit() {
    this.ionStorage.get('defaultAddress').then((res) => {
      this.lat = res?.location?.coordinates[0] || null;
      this.long = res?.location?.coordinates[1] || null;
     });
    this.getStoreDetails();
    this.getAllSubCategory();
    this.couponListDetails(this.storeCustomId);
  }

  ionViewWillEnter() {
    this.itemViewInit();
  }

  itemViewInit() {
    if (this.segment) {
      this.getAllStoreProducts(true);
    }
    this.getTotalCartCost();
  }

  // ionViewDis

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  getAllSubCategory() {
    this.ngxUiLoader.startLoader('loader-03');
    this.service
      .getAllActiveSubCategory(this.storeCustomId, this.filter)
      .subscribe(
        (res) => {
          this.subCategory = res.data;
          this.ngxUiLoader.stopLoader('loader-03');
          console.log(this.subCategory);
          this.segment = this.subCategoryId = res.data.length
            ? res.data[0]._id
            : null;
          // this.getAllStoreProducts();
        },
        (error) => {
          // this.serverError = true;
          this.ngxUiLoader.stopLoader('loader-03');
          this.presentToast(
            'error.message' || MessageLib.INTERNAL_SERVER_ERROR
          );
        }
      );
  }

  getAllCategory() {
    this.ngxUiLoader.startLoader('loader-03');
    this.service.getAllActiveCategory(this.storeCustomId).subscribe(
      (res) => {
        this.subCategory = res.data;
        this.ngxUiLoader.stopLoader('loader-03');
        this.segment = this.subCategoryId = res.data.length
          ? res.data[0]._id
          : null;
        // this.getAllStoreProducts();
      },
      (error) => {
        // this.serverError = true;
        this.ngxUiLoader.stopLoader('loader-03');
        this.presentToast('error.message' || MessageLib.INTERNAL_SERVER_ERROR);
      }
    );
  }

  getStoreDetails() {
    this.isLoadingStore = true;
    this.ngxUiLoader.startLoader('loader-03');
    this.service
      .getStoreDetails(this.storeCustomId, this.lat, this.long)
      .subscribe(
        (res) => {
          this.storeInfo = res.data;
          console.log(this.storeInfo);
          this.ngxUiLoader.stopLoader('loader-03');
          this.isLoadingStore = false;
        },
        (error) => {
          this.isLoadingStore = false;
          // this.serverError = true;
          this.ngxUiLoader.stopLoader('loader-03');
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        }
      );
  }

  async getAllStoreProducts(isInitial: boolean, infinitScrollEvent?: any) {
    if (this.isInitial === true) {
      this.isLoadingOnlyProducts = true;
    } else {
      this.isLoadingOnlyProducts = false;
    }
    let user = await this.auth.jwtDecoder();
    this.ngxUiLoader.startLoader('loader-03');
    this.service
      .getStoreProducts(
        user ? true : false,
        this.storeCustomId,
        this.filter,
        this.subCategoryId || null,
        this.categoryId || null
      )
      .subscribe(
        (res) => {
          this.products = isInitial
            ? res.data
            : [...this.products, ...res.data];
          this.totalCount = res.totalCount;
          this.isLoadingOnlyProducts = false;
          if (infinitScrollEvent) {
            infinitScrollEvent.target.complete();
          }
          if (this.products.length === res.totalCount) {
            this.infiniteScroll.disabled = true;
          }

          this.ngxUiLoader.stopLoader('loader-03');
          this.serverError = false;
          this.isInitial = false;
        },
        (error) => {
          // this.serverError = true;
          this.isInitial = false;
          this.isLoadingOnlyProducts = false;
          this.ngxUiLoader.stopLoader('loader-03');
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        }
      );
  }

  async getTotalCartCost() {
    let user = await this.auth.jwtDecoder();
    this.ngxUiLoader.startLoader('loader-03');
    if (user) {
      this.service.getTotalCost(this.storeCustomId).subscribe(
        (res) => {
          this.totalCartQuantity = res.data.totalCartQuantity;
          this.totalCartCost = res.data.totalCartCost;
          this.ngxUiLoader.stopLoader('loader-03');
        },
        (error) => {
          // this.serverError = true;
          this.ngxUiLoader.stopLoader('loader-03');
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        }
      );
    }
  }

  async addToCart(productId: string, index: number) {
    let used = await this.auth.jwtDecoder();
    if (used) {
      const cartReq: any = {
        storeCustomId: this.storeCustomId,
        productId: productId,
      };
      this.service.addToCart(cartReq).subscribe(
        (res) => {
          this.products[index].myCart = res.data.myCart;
          this.totalCartQuantity = res.data.totalCartQuantity;
          this.totalCartCost = res.data.totalCartCost;
          this.ngxUiLoader.stopLoader('loader-03');
        },
        (error) => {
          // this.serverError = true;
          this.ngxUiLoader.stopLoader('loader-03');
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        }
      );
    } else {
      this.router.navigate(['/phone-number'], {
        queryParams: { backUrl: this.router.url },
      });
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
      this.service.updateCart(cartReq).subscribe(
        (res) => {
          this.products[index].myCart = res.data.myCart;
          this.totalCartQuantity = res.data.totalCartQuantity;
          this.totalCartCost = res.data.totalCartCost;
          this.ngxUiLoader.stopLoader('loader-03');
        },
        (error) => {
          // this.serverError = true;
          this.ngxUiLoader.stopLoader('loader-03');
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        }
      );
    } else {
      this.router.navigate(['/phone-number'], {
        queryParams: { backUrl: this.router.url },
      });
    }
  }

  onChangeSearch(event) {
    this.filter.page = 0;
    if (this.filterTimeOut) {
      this.filterTimeOut = clearTimeout(this.filterTimeOut);
    }
    this.infiniteScroll.disabled = false;
    this.filterTimeOut = setTimeout(() => {
      event.target.complete();
      this.getAllStoreProducts(true);
    }, 500);
  }

  loadData(event) {
    this.filter.page = ++this.filter.page;
    this.getAllStoreProducts(false, event);
  }

  async segmentChanged(event) {
    await this.slider.slideTo(this.segment);
    this.infiniteScroll.disabled = false;
    this.subCategoryId = this.segment as any;
    this.filter.page = 0;
    this.content.scrollToTop();
    this.isInitial = true;
    this.isLoadingOnlyProducts = true;
    if (this.subCategoryId) {
      this.getAllStoreProducts(true);
    }
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }
  cart() {
    this.router.navigate(['./cart']);
  }
  reviews() {
    this.router.navigate(['./reviews']);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async variation_selection(i) {
    const modal = await this.modalController.create({
      component: VariationSelectionPage,
      componentProps: {
        // eslint-disable-next-line no-underscore-dangle
        id: this.products[i]._id,
        productName: this.products[i].productName,
        brandName: this.products[i].brandName,
        // image: this.products[i].image?.filePath,
        image: this.products[i]?.image,
        media: this.products[i]?.media,
        sellingPrice: this.products[i].sellingPrice,
        sku: this.products[i].sku,
        subCategoryName: this.products[i].subCategoryName,
        unitValue: this.products[i].unitValue,
        unit: this.products[i].unit,
        index: i,
        quantity: this.products[i].myCart?.quantity,
        isAvailable: this.storeInfo?.isAvailable
      },
    });
    modal.onDidDismiss().then((data) => {
      const dataInfo = data.data;
      if (dataInfo != null) {
        this.addToCart(dataInfo?.productId, dataInfo?.index);
      }
    });
    return await modal.present();
  }



  async couponDetails(data) {
    const modal = await this.modalController.create({
      component: CouponDetailsPage,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.3,
      componentProps: {data},
    });
    modal.onDidDismiss().then((data) => {
    });
    return await modal.present();
  }
  

  couponListDetails(storeCustomId: string) {
    this.service.getAllCouponList(storeCustomId).subscribe((res) => {
      this.couponList = res.data
    });
  }


  async searchItem() {
    let modal = await this.modalController
      .create({
        component: SearchItemPage,
        componentProps: { storeCustom_id: this.storeCustomId, type: this.filter.type, storeType: this.storeInfo?.storeType?.name, isAvailable: this.storeInfo?.isAvailable, storeInfo: this.storeInfo },
      })
      .then((modalElement) => {
        modalElement.present();
        modalElement.onWillDismiss().then((data) => {
          this.itemViewInit();
        });
      });
  }

  searchToggleFun() {
    this.searchToggle = !this.searchToggle;
  }

  detailProduct(index: number) {
    this.productDetailToggle = !this.productDetailToggle;
  }

  refresh() {
    this.isInitial = true;
    this.getAllStoreProducts(true);
    this.getTotalCartCost();
    this.getAllSubCategory();
    this.getStoreDetails();
  }

  dishSelection(event) {
    this.filter.type = this.filter.type !== event ? event : null;
    this.getAllStoreProducts(true);
    this.getAllSubCategory();
  }
}
