import { Component, OnInit } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ServiceService } from './service/service.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SubscribeService } from '../subscriber/subscribe.service';
import { StorageService } from '../service/service/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
location: string = "home";
categories: any[] = [];
s3path: any = environment.s3Url;
address: any;
search: any;
isLoading = false;
serverError= false;
  constructor(
    public service: ServiceService,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private addressSubject: SubscribeService,
    public ionStorage: StorageService,
  ) { }


  ionViewWillEnter() {
    this.getAddress();
    this.addressSubject.subscribeAddress().subscribe((res) => {
      this.address = res;
      this.ionStorage.set('defaultAddress', res);
    });
  }



  ngOnInit() {
    this.getAllCategory();
  }


  async getAddress() {
     this.ionStorage.get('defaultAddress').then(res => {
      this.address = res;
     });
  }

  ionViewinit() {

  }

  getAllCategory() {
    this.isLoading = true;
    this.serverError = false;
    this.ngxUiLoader.startLoader("loader-03");
    this.service.getAllCategory().subscribe(res => {
      this.categories = res.data;
      this.ngxUiLoader.stopLoader("loader-03");
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      // this.serverError = true;
      this.ngxUiLoader.stopLoader("loader-03");
    });
}

 listStore(categoryId) {
  this.router.navigate(['./stores', categoryId ]);
 }

cart() {
    this.router.navigate(['./cart']);
  }
stores() {
    this.router.navigate(['./stores']);
  }
custom_delivery() {
    this.router.navigate(['./custom-delivery']);
  }

  selectAddress() {
    this.router.navigate(['/saved-addresses', 'select'], { queryParams: { backUrl: '/tabs/home' }});
  }
}
