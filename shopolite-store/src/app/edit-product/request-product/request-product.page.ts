import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, ToastController, ModalController, IonInfiniteScroll } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageLib } from 'src/app/constants/system.const';
import { AuthServiceService } from 'src/app/service/service/auth-service.service';
import { ItemSubscribeService } from 'src/app/subcriber/item-subscribe.service';
import { ServiceService } from '../service/service.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-request-product',
  templateUrl: './request-product.page.html',
  styleUrls: ['./request-product.page.scss'],
})
export class RequestProductPage implements OnInit {

  s3path: any = environment.s3Url;
  filter = {
    page: 0,
    count: 10,
    search: "",
    location: ""
  }
  products: any[] = [];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  totalCount = 0;
  private filterTimeOut: any = null;
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
    this.getAllRequestStoreProducts(true);
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

  getAllRequestStoreProducts(isInitial?: boolean) {
    this.ngxUiLoader.startLoader("product-loader");
    this.service.getRequestedProducts(this.filter).subscribe(res => {
      this.products = isInitial ? res.data : [...this.products, ...res.data];
      this.totalCount = res.totalCount;
      this.ngxUiLoader.stopLoader("product-loader");
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
      this.getAllRequestStoreProducts(true);
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
        this.getAllRequestStoreProducts();
        event.target.complete();
      }
    }, 500)

  }

  addRequestProduct() {
    this.router.navigate(['/add-product']);
  }


}
