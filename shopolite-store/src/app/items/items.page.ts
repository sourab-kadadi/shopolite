import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSlides, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll, Platform, ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../constants/system.const';
import { AuthServiceService } from '../service/service/auth-service.service';
import { environment } from '../../environments/environment';
import { ServiceService } from './service/service.service';
import { ItemSubscribeService } from '../subcriber/item-subscribe.service';
import { SearchItemsPage } from './search-items/search-items.page';
@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {
  segment: any = 0;
  @ViewChild('slides', { static: true }) slider: IonSlides;
  s3path: any = environment.s3Url;
  subCategory: any[] = [
  ];
  subCategoryId: string;
  categoryId: string;
  products: any[] = [];
  isSearchBar = true;

  isUpdateProduct = false;
  isStoreInventorty = true;
  //  user: any;
  private filterTimeOut: any = null;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  totalCount = 0;
  public loaderType: string = ngXLoaderType;
  spinner = ngXFgsType;
  onlyMyProducts: boolean = true;
  @ViewChild(IonContent) content: IonContent;

  constructor(
    public platform: Platform,
    public service: ServiceService,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthServiceService,
    public itemSubscribe: ItemSubscribeService,
    private modalController: ModalController,
  ) {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');
  }

  filter = {
    page: 0,
    count: 10,
    search: "", 
    location: ""
  }

  ngOnInit() {
    this.service.getCatalogById(this.categoryId).subscribe( data => {
      this.isStoreInventorty = data?.data?.isStoreInventorty;
    });
    this.getAllSubCategory(this.isStoreInventorty);
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  getAllSubCategory(isStoreInventorty) {
    this.ngxUiLoader.startLoader("loader-03");
    ( isStoreInventorty ? this.service.getAllActiveSubCategory(this.categoryId) :  this.service.getAllActiveSubCategory(this.categoryId)).subscribe(res => {
      this.subCategory = res.data;
      // this.totalCount = res.totalCount;
      this.ngxUiLoader.stopLoader("loader-03");
      if (!this.subCategoryId){
      this.segment = this.subCategoryId = res.data.length ? res.data[0]._id : null;
      } else {
      this.segment = this.subCategoryId;
      }
      // this.getAllStoreProducts(true);
    }, error => {
      this.ngxUiLoader.stopLoader("loader-03");
      this.presentToast("error.message" || MessageLib.INTERNAL_SERVER_ERROR);
    })
  }

  ionViewWillEnter() {
    this.itemSubscribe.getObservable().subscribe((data) => {
      var foundIndex = this.products.findIndex(x => x._id == data.catalogId);
      if (foundIndex != -1) {
        let productData = this.products[foundIndex];
        productData["myProduct"] = data;
        this.products[foundIndex] = productData;
      }
    });
  }


  getAllStoreProducts(isInitial: boolean,  infinitScrollEvent?: any) {
    this.ngxUiLoader.startLoader("product-loader");
    this.service.getStoreProducts(this.categoryId, this.subCategoryId, this.onlyMyProducts, this.filter).subscribe(res => {
      this.products = isInitial ? res.data : [...this.products, ...res.data];
      console.log(this.products);
      this.totalCount = res.totalCount;
      this.ngxUiLoader.stopLoader("product-loader");
      if (infinitScrollEvent) {
        infinitScrollEvent.target.complete();
      }
      if (this.products.length === res.totalCount) {
        this.infiniteScroll.disabled = true;
      }
    }, error => {
      this.ngxUiLoader.stopLoader("product-loader");
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);

    })
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


  async segmentChanged() {
    await this.slider.slideTo(this.segment);
    this.infiniteScroll.disabled = false;
    this.subCategoryId = this.segment as any;
    if (this.subCategoryId) {
    this.reset();
    }
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }
  edit_product(catalogId) {
    this.router.navigate(['./edit-product', catalogId]);
  }
add_product() {
    this.router.navigate(['./add-product',]);
  }

  toggleSearch() {
    this.isSearchBar = !this.isSearchBar;
    if (this.isSearchBar == true) {
      this.filter.search = "";
      this.getAllStoreProducts(false);
    }
  }

  async searchItem() {
    let modal = await this.modalController
      .create({ component: SearchItemsPage, componentProps: { category_id: this.categoryId, only_my_products: this.onlyMyProducts } })
      .then((modalElement) => {
        modalElement.present();
        modalElement.onWillDismiss().then(data => {
          console.log("Entered searchItem");
          this.reset();
        });
      });

  }

  onOnlyMyProductsStatusChange(event) {
    this.onlyMyProducts = event.detail.checked;
    this.filter.page = 0;
    this.getAllSubCategory(this.onlyMyProducts);
  }


  onStatusChange(event, index, productId) {
    this.isUpdateProduct = true;
    console.log(event, index);
    if (!this.products[index].myProduct) {
      this.add_product();
    }
    this.ngxUiLoader.startLoader("product-loader");
    this.service.statusUpdateStoreProduct(productId, event.detail.checked).subscribe(res => {
      if (this.isUpdateProduct) {
      this.products[index].myProduct.status = event.detail.checked;
      }
      this.ngxUiLoader.stopLoader("product-loader");
    }, error => {
      if (error.status == 404) {
        this.presentToast(error.message || MessageLib.UNABLE_TO_CHANGE_STATUS);
        this.reset();
        return
      }
      this.ngxUiLoader.stopLoader("product-loader");
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);

    })
  }

  reset() {
    this.filter.page = 0;
    this.content.scrollToTop();
    this.getAllStoreProducts(true);
    this.isUpdateProduct = false;
  }
}
