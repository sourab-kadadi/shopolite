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
import { StoresService } from './service/stores.service';
import { ServiceService } from '../category/service/service.service';
import { UsersService } from '../users/service/users.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.page.html',
  styleUrls: ['./stores.page.scss'],
})
export class StoresPage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;
  @ViewChild('selectComponentStoreOnline') selectComponentStoreOnline: IonicSelectableComponent;
  @ViewChild('selectComponentStatus') selectComponentStatus: IonicSelectableComponent;

  data: Array<any>;
  totalCount: number;


isActive = false;
s3path: any = environment.s3Url;

  filter = {
    page: 0,
    count: 150,
    businessCategoryId: '',
    place: '',
    search: '',
    storeOnline: '',
    status: '',

  };
  private filterTimeOut: any = null;
  constructor(
    private categoryService: ServiceService,
    private router: Router,
    private loadingCtrl: LoadingController,
    public platform: Platform,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private ngxUiLoader: NgxUiLoaderService,
    public alertController: AlertController,
        private route: ActivatedRoute,
        private storesService: StoresService,
        private userService: UsersService

  ) {
    this.data = new Array<any>();

  }
  ngOnInit() {
    this.getAllStores();
  }



  async getAllStores() {
      this.isActive = false;
      // this.data=[];
      this.ngxUiLoader.startLoader('loader-product-packing-size-list');
      this.storesService.getAllStores(this.filter).subscribe({
        next: (res) => {
          if (res.data) {
            this.data = res.data;
            this.totalCount = res.totalCount;
          }
          if (res.status === false) {
            this.presentAlert('No Details Found !!!');
          }
        }, error: (e) => {
          // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
          this.isActive = true;
          this.ngxUiLoader.stopLoader("loader-product-packing-size-list");
          this.presentAlert(e.message || e.error.message ||  MessageLib.INTERNAL_SERVER_ERROR_ALERT);
  
        }, complete: () => {
          this.isActive = true;
          this.ngxUiLoader.stopLoader('loader-product-packing-size-list');
        }
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
  
    ngOnDestroy() {
    }
  
  
    doRefresh(event: any) {
      this.getAllStores();
      setTimeout(() => {
        event.target.complete();
      }, 1000);
    }

    onStoreOnlineStatusChange(event, i) {
      console.log(event, 'number', i)

console.log(this.data[i]._id, this.data[i].storeOnline)

      if (!this.data[i].storeOnline) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        let data = { storeOnline: true };
        this.storesService.updateStoreOnlineStatus(this.data[i]._id ,data).subscribe(res => {
          if (res.status === true) { this.data[i].storeOnline = true; }
          else {
            setTimeout(() => { this.data[i].storeOnline = false; });
            this.presentToast(MessageLib.INTERNAL_SERVER_ERROR);
          }
        }, error => {
          if (error) { this.data[i].storeOnline = false; }
          // this.ngxUiLoader.stopLoader("product-loader");
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        });
      }
      if (this.data[i].storeOnline) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        let data = { storeOnline: false };
        this.storesService.updateStoreOnlineStatus(this.data[i]._id, data).subscribe(res => {
          if (res.status === true) { this.data[i].storeOnline = false; }
          else {
            setTimeout(() => { this.data[i].storeOnline = true; });
            this.presentToast(MessageLib.INTERNAL_SERVER_ERROR);
          }
        }, error => {
          if (error) { this.data[i].storeOnline = true; }
          // this.ngxUiLoader.stopLoader("product-loader");
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        });
      }
    }
  
    openLink(storeId: any) {
      this.router.navigate(['./stores/manage', storeId]);
    }
  
    pageChanged(event) {
      this.filter.page = event;
      this.getAllStores();
        }

        onSearchChange(event) {
          this.filter.search = event.detail.value;
          if (this.filter.search === '') {
            this.filter.page = 0;
            this.data = [];
            this.getAllStores();
            return;
          }
          if (this.filterTimeOut) {
            this.filterTimeOut = clearTimeout(this.filterTimeOut);
          }
          this.filterTimeOut = setTimeout(() => {
            this.data = [];
            this.filter.page = 0;
            this.getAllStores();
          }, 500);
        }
        
  }
