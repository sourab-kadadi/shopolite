import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController, NavParams } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { Router, ActivatedRoute, RoutesRecognized, NavigationEnd } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../../environments/environment';
import { ServiceService } from '../service/service.service';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, zoomInOnEnterAnimation, zoomInUpOnEnterAnimation, zoomOutDownOnLeaveAnimation, zoomOutOnLeaveAnimation } from 'angular-animations';
import {
  MessageLib,
  ngXFgsType,
  ngXLoaderType,
  restaurantMenuDishType,
} from '../../constants/system.const';
import { StorageService } from '../../service/service/storage.service';
import { AuthServiceService } from '../../service/service/auth-service.service';
import { VariationSelectionPage } from 'src/app/variation-selection/variation-selection.page';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.page.html',
  styleUrls: ['./search-item.page.scss'],
})
export class SearchItemPage implements OnInit {
  @ViewChild('slides', { static: true }) slider: IonSlides;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  segment = 0;

  products: any[] = [];
  s3path: any = environment.s3Url;
  categoryId: string;
  subCategoryId: string;
  storeCustomId: string;
  totalCartCost: number = 0;
  totalCartQuantity: number = 0;
  storeInfo: any;
  restaurantMenuDishTypes = restaurantMenuDishType;

  filter = {
    page: 0,
    count: 10,
    search: '',
    location: '',
    type: null
  };
  isLoadingOnlyProducts = false;
  storeType:string;
  private filterTimeOut: any = null;
  totalCount = 0;
  public loaderType: string = ngXLoaderType;
  spinner = ngXFgsType;
  subCategory: any[] = [
  ];
  previosUrl: any;
  searchToggle: boolean = false;
  isStoreAvailable: boolean = false;
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
    public params: NavParams
  ) {
    this.storeCustomId = this.params.get('storeCustom_id');
    this.storeType = this.params.get('storeType');
    this.filter.type = this.params.get('type');
    this.isStoreAvailable = this.params.get('isAvailable');
    this.storeInfo = this.params.get('storeInfo');
    this.getAllStoreProducts(true);
    this.getTotalCartCost();
  }



  ngOnInit() {
  }

  ionViewWillEnter() {

  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }


  dismiss()  {
    this.modalController.dismiss();
  }


  async getAllStoreProducts(isInitial?: boolean, infinitScrollEvent?: any) {
    if (isInitial === true) {
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
        null,
        null,
      )
      .subscribe(
        (res) => {
          this.products = isInitial ? res.data : [...this.products, ...res.data ];
          this.totalCount = res.totalCount;
          this.isLoadingOnlyProducts = false;
          if (infinitScrollEvent) {
            infinitScrollEvent.target.complete();
          }
          if (this.products.length === res.totalCount) {
            this.infiniteScroll.disabled = true;
          }

          this.ngxUiLoader.stopLoader('loader-03');
        },
        (error) => {
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
    this.filterTimeOut = setTimeout(() => {
      this.getAllStoreProducts(true);
    }, 500);
  }




  loadData(event) {
    this.filter.page = ++this.filter.page;
    this.getAllStoreProducts(false, event);
  }

  cart() {
    this.modalController.dismiss()
    this.router.navigate(['./cart', this.storeCustomId]);
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
        }
      });
      modal.onDidDismiss()
      .then((data) => {
        const dataInfo = data.data;
        if (dataInfo != null) {
          this.addToCart(dataInfo?.productId, dataInfo?.index);
        }
    });
      return await modal.present();
    }


    dishSelection(event) {
      this.filter.type = this.filter.type !== event ? event : null;
      this.getAllStoreProducts(true);
    }

}
