import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll, Platform, ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../../constants/system.const';
import { AuthServiceService } from '../../service/service/auth-service.service';
import { environment } from '../../../environments/environment';
import { ServiceService } from '../service/service.service';
import { ItemSubscribeService } from '../../subcriber/item-subscribe.service';
@Component({
  selector: 'app-search-items',
  templateUrl: './search-items.page.html',
  styleUrls: ['./search-items.page.scss'],
})
export class SearchItemsPage implements OnInit {

  segment = 0;
  @ViewChild('slides', { static: true }) slider: IonSlides;
  s3path: any = environment.s3Url;
  subCategory: any[] = [
  ];
  subCategoryId: string;
  categoryId: string;
  products: any[] = [];
 
  isSearchBar = true;
 
  isUpdateProduct = false;
  onlyMyProducts = false;
 //  user: any;
  private filterTimeOut: any = null;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  totalCount = 0;
  public loaderType: string = ngXLoaderType;
  spinner = ngXFgsType;
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
    public params: NavParams
   ) {
     this.categoryId = this.params.get('category_id');
     this.onlyMyProducts = this.params.get('only_my_products');
   }
 
   filter = {
     page: 0,
     count: 10,
     search: "",
     location: ""
   }
 
   ngOnInit() {
   }
 
 
   async presentToast(message: string) {
     const toast = await this.toastController.create({
       message: message,
       duration: 2000
     });
     toast.present();
   }
 
 ionViewWillEnter(){
   this.itemSubscribe.getObservable().subscribe((data) => {
     var foundIndex = this.products.findIndex(x => x._id == data.catalogId);
     if (foundIndex != -1) {
     let productData = this.products[foundIndex];
     productData["myProduct"] = data;
     this.products[foundIndex] = productData;
     }
 });}
 
 
 getAllStoreProducts(isInitial?: boolean) {
   this.ngxUiLoader.startLoader("product-loader");
   this.service.getStoreProducts(this.categoryId, null, this.onlyMyProducts, this.filter).subscribe(res => {
     this.products = isInitial ? res.data : [...this.products, ...res.data ];
     this.totalCount = res.totalCount;
     this.ngxUiLoader.stopLoader("product-loader");
   }, error => {
     this.ngxUiLoader.stopLoader("product-loader");
     this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
 
   })
 }
 
 onChangeSearch(event) {
 this.filter.page = 0;
 this.isUpdateProduct = false;
 if(this.filterTimeOut) {
 this.filterTimeOut = clearTimeout(this.filterTimeOut);
 }
 this.filterTimeOut = setTimeout(() => {
   this.getAllStoreProducts(true);
 }, 500);
 }
 
 loadData(event) {
 setTimeout(() => {
   if (this.products.length == this.totalCount) {
     event.target.disabled = true;
   event.target.complete();
     // this.infiniteScroll.disabled = true;
   } else {
     this.filter.page = ++this.filter.page;
     this.getAllStoreProducts();
     event.target.complete();
   }
 }, 500)
 
 }
 
 
   async segmentChanged() {
     await this.slider.slideTo(this.segment);
     this.subCategoryId = this.segment as any;
     this.filter.page = 0;
     this.getAllStoreProducts(true);
   }
 
   async slideChanged() {
     this.segment = await this.slider.getActiveIndex();
   }
 edit_product(catalogId) {
    this.dismiss();
     this.router.navigate(['./edit-product', catalogId]);
   } 
 add_product() {
  this.dismiss();
     this.router.navigate(['./add-product']);
   } 
 
   toggleSearch() {
     this.isSearchBar = !this.isSearchBar;
     if (this.isSearchBar == true) {
       this.filter.search = "";
       this.getAllStoreProducts();
     }
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
    this.getAllStoreProducts(true);
    this.isUpdateProduct = false;
  }

   dismiss()  {
    this.modalController.dismiss();
  }

}
