import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll, Platform, ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthServiceService } from '../service/service/auth-service.service';
import { environment } from '../../environments/environment';
import { ServiceService } from './service/service.service';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../constants/system.const';
import { StorageService } from '../service/service/storage.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.page.html',
  styleUrls: ['./stores.page.scss'],
})
export class StoresPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  list: any[] = [];
  s3path: any = environment.s3Url;
  categoryId: string;
  filter = {
    page: 0,
    count: 10,
    search: "",
    location: "",
    lat: null,
    long: null
  }
  category: any;
  serverError = false;
  isLoading = false;
  isInitial = true;
  private filterTimeOut: any = null;
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
    public ionStorage: StorageService,

  ) {
    this.categoryId = this.route.snapshot.paramMap.get("category_id");
    this.ionStorage.get('defaultAddress').then(res => {
      this.filter.lat = res?.location?.coordinates[0] || null;
      this.filter.long = res?.location?.coordinates[1] || null;
      this.getAllStoreByCategoryId();
      this.getCategoryById();
     });
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

  getAllStoreByCategoryId(init?: boolean) {
    if (this.isInitial === true) {
      this.isLoading = true;
    } else {
      this.isLoading = false;
    }
    // if(this.serverError) {
    //   this.infiniteScroll.disabled = true;
    // }
    this.ngxUiLoader.startLoader("loader-03");
    this.service.getStoreByCategoryId(this.categoryId, this.filter).subscribe(res => {
      this.list = init ? res.data : [...this.list, ...res.data];
      this.totalCount = res.totalCount;
      this.infiniteScroll.disabled = false;
      if (this.list.length === res.totalCount) {
        this.infiniteScroll.disabled = true;
      }
      this.ngxUiLoader.stopLoader("loader-03");
      this.isLoading = false;
      this.serverError = false;
    }, error => {
      this.isLoading = false;
      // this.serverError = true;
      this.ngxUiLoader.stopLoader("loader-03");
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    });
}

getCategoryById() {
  this.isLoading = true;
  this.ngxUiLoader.startLoader("loader-03");
  this.service.getCategoryById(this.categoryId).subscribe(res => {
   this.category = res.data;
   this.isLoading = false;
    this.ngxUiLoader.stopLoader("loader-03");
  }, error => {
    this.isLoading = false;
    this.ngxUiLoader.stopLoader("loader-03");
    this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
  });
}

onChangeSearch(event) {
  this.filter.page = 0;
  if(this.filterTimeOut) {
  this.filterTimeOut = clearTimeout(this.filterTimeOut);
  }
  this.infiniteScroll.disabled = false;
  this.filterTimeOut = setTimeout(() => {
    this.getAllStoreByCategoryId(true);
  }, 500);
}

loadData(event) {
      this.isInitial = false;
  setTimeout(() => {
    if (this.list.length === this.totalCount) {
      event.target.disabled = true;
      event.target.complete();
      // this.infiniteScroll.disabled = true;
    } else {
      this.filter.page = ++this.filter.page;
      this.getAllStoreByCategoryId();
      event.target.complete();
    }
  }, 500);

}

doRefresh(event) {
  this.list = [];
  this.filter.page = 0;
  this.infiniteScroll.disabled = false;
  this.getAllStoreByCategoryId();
  setTimeout(() => {
    event.target.complete();
  }, 1000);
}


items(storeCustomeId) {
    this.router.navigate(['./items', storeCustomeId]);
  }

tryAgain() {
  this.getAllStoreByCategoryId();
  this.getCategoryById();
}

}
