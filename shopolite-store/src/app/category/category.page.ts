import { Component, OnInit } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ServiceService } from './service/service.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthServiceService } from '../service/service/auth-service.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  categories: any[] = [];
  s3path: any = environment.s3Url;

  constructor(
    public service: ServiceService,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthServiceService
  ) { }

  ngOnInit() {
  }
  showMyOrder: boolean = false;
  categoryId: string = '';


  ionViewWillEnter() {
    this.checkCategory();
  }

  async checkCategory() {
    const user = await this.auth.jwtDecoder();
    this.showMyOrder = user?.businessCategoryId?.length == 1 ? true : false;
    this.categoryId = user?.businessCategoryId?.[0] || '';
    console.log(this.categoryId,  this.showMyOrder, user);
    this.showMyOrder ? this.router.navigate(['/tabs/category/default-item', this.categoryId ]) : this.getAllCategory();
  }

  

  getAllCategory() {
    this.ngxUiLoader.startLoader("loader-03");
    this.service.getAllCategory().subscribe(res => {
      this.categories = res.data;
      this.ngxUiLoader.stopLoader("loader-03");
    }, error => {
      this.ngxUiLoader.stopLoader("loader-03");
    })
}

 listProduct(categoryId) {
  this.router.navigate(['./items', categoryId ]);
 }


}
