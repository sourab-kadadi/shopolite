import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BarcodeScannerPage } from 'src/app/module/barcode-scanner/barcode-scanner.page';
import { environment } from 'src/environments/environment';
import { ngXLoaderType, ngXFgsType, discountType, DiscountType, MessageLib } from '../../constants/system.const';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  item_category: string = "1";
  s3path: any = environment.s3Url;
  isSubmitted: boolean = false;
  public loaderType: string = ngXLoaderType;
  spinner = ngXFgsType;
  logo = "";
  catalog: any = {};
  catalogId: string;
  storeImage = "";
  storeId: string;
  mode: "create" | "update" = "create";
  defaultRef = '/tabs/category';
  discountType = discountType;
  categories: any[] = [];
  subCategories: any[] = [];
  productForm: any = this.formBuilder.group({
    category: ['', [Validators.required]],
    subCategory: [{value: '', disabled: true}, [Validators.required]],
    brandName: ['', [Validators.required]],
    barcode: ['', [Validators.required]],
    name: ['', [Validators.required]],
    catalogType: ['Local', [Validators.required]],
    status: [true, [Validators.required]],
    originalPrice: [1, [Validators.required]],
    discount: this.formBuilder.group({
      type: [],
      value: [0]
    }),
    unit: ['', [Validators.required]],
    unitValue: ['', [Validators.required]],
    image: ['', [Validators.required]]
  });

  sellingValue = 0;
  constructor(
    public platform: Platform,
    public service: ServiceService,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public navCtrl: NavController,
    private modalController: ModalController,

    // public itemSubscribe: ItemSubscribeService
  ) {
    this.catalogId = this.route.snapshot.paramMap.get("catalogId");
    this.getAllCategory();
    this.getCatalogById(this.catalogId);
   }

   ngOnInit() {

  }

   get errorControl() {
    return this.productForm.controls;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }


  getCatalogById(catalogId) {
    this.service.getCatalogById(catalogId).subscribe(res => {
      this.catalog = res.data;
      this.defaultRef = `/items/${this.catalog.categoryId}`;
      if (res.data && res.data.myProduct) {
        this.mode = "update";
        this.productForm.patchValue({
          status: res.data.myProduct.status,
          originalPrice: res.data.myProduct.originalPrice,
          discount: res.data.myProduct.discount
        }, { emitEvent: false});
        this.sellingValue = res.data.myProduct.sellingPrice;
      } else {
        this.productForm.patchValue({
          originalPrice: res.data.sellingPrice
        }, { emitEvent: false })
        this.sellingValue = res.data.sellingPrice;
      }
    }, error => {
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    })
  }

  getAllCategory() {
    this.ngxUiLoader.startLoader("loader-03");
    this.service.getAllCategory().subscribe(res => {
      this.categories = res.data;
      this.ngxUiLoader.stopLoader("loader-03");
    }, error => {
      this.ngxUiLoader.stopLoader("loader-03");
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    })
}

onCategorySelection(event: any) {
  this.getSubAllCategory(event.target.value._id);

}


getSubAllCategory(categoryId: string) {
  this.ngxUiLoader.startLoader("loader-03");
  this.service.getAllSubCategoryDropDown(categoryId).subscribe(res => {
    this.subCategories = res.data;
    this.productForm.get('subCategory').enable();
    this.ngxUiLoader.stopLoader("loader-03");
  }, error => {
    this.ngxUiLoader.stopLoader("loader-03");
    this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
  })
}



  submitForm() {
    if (this.mode === "create") {
      this.createStore();
    } else if (this.mode === "update") {
      this.updateStore();
    }
  }

  createStore() {
    this.isSubmitted = true;
    if (!this.productForm.valid) {
      this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
      return false;
    } else {
      this.ngxUiLoader.startLoader("manage-loader");
      let productData = this.getProductData();
      this.service.createStoreRequestCatalog(productData).subscribe(res => {
        this.ngxUiLoader.stopLoader("manage-loader");
        this.presentToast(MessageLib.STORE_CREATE_SUCCESS);
        this.navCtrl.back();
      }, error => {
        this.ngxUiLoader.stopLoader("manage-loader");
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      });
    }
  }

  getProductData() {
    let productData: any = this.productForm.value;
    productData["categoryId"] = this.productForm.value.category._id;
    productData["categoryName"] = this.productForm.value.category.name;
    productData["subCategoryId"] = this.productForm.value.category._id;
    productData["subCategoryName"] = this.productForm.value.category.name;
    delete productData.category;
    delete productData.subCategory;
    return productData;
  }
  

  updateStore() {
    this.isSubmitted = true;
    if (!this.productForm.valid) {
      this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
      return false;
    } else {
      this.ngxUiLoader.startLoader("manage-loader");
      this.service.updateStoreProduct(this.catalog.myProduct._id, this.productForm.value).subscribe(res => {
        this.ngxUiLoader.stopLoader("manage-loader");
        this.presentToast(MessageLib.STORE_UPDATE_SUCCESS);
        this.navCtrl.pop();
      }, error => {
        this.ngxUiLoader.stopLoader("manage-loader");
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      });
    }
  }

  caluclateSellingPrice() {
    let sellingPrice = 0;
    console.log(this.productForm.controls['discount'].value.type, this.productForm.controls["originalPrice"].value);
    if (this.productForm.controls['discount'].value.type == DiscountType.AMOUNT) {
      sellingPrice = this.productForm.controls["originalPrice"].value - this.productForm.controls['discount'].value.value;
    } else if (this.productForm.controls['discount'].value.type == DiscountType.PERCENTAGE) {
      sellingPrice = this.productForm.controls["originalPrice"].value - (this.productForm.controls["originalPrice"].value * (this.productForm.controls['discount'].value.value / 100));
    } else {
      sellingPrice = this.productForm.controls["originalPrice"].value;
    }
    this.sellingValue = sellingPrice;
  }

  productImage(event) {
    let image = {filePath: event.data.filePath, type: event.data.type};
    this.productForm.patchValue({ image: image});
    this.logo =event.data;
  }

async getBarCode() {
  let modal = await this.modalController
  .create({ component: BarcodeScannerPage })
  .then((modalElement) => {
    modalElement.present();
    modalElement.onWillDismiss().then(data => {
      console.log("Entered searchItem", data);
      this.productForm.patchValue({
        barcode: data.data
      })
    });
  });
}


}
