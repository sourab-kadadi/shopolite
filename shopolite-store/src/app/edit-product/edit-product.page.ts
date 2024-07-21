import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from '../../environments/environment';
import { MessageLib, ngXFgsType, ngXLoaderType, discountType, DiscountType } from '../constants/system.const';
import { AuthServiceService } from '../service/service/auth-service.service';
import { ServiceService } from './service/service.service';
import { Location } from '@angular/common';
import { ProductImagePage } from '../product-image/product-image.page';
import { ItemSubscribeService } from '../subcriber/item-subscribe.service';
// import { AnimationOptions } from '@capacitor/status-bar';
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit {
item_category: string = "1";
s3path: any = environment.s3Url;
catalog: any = {};
catalogId: string;
isSubmitted: boolean = false;
public loaderType: string = ngXLoaderType;
spinner = ngXFgsType;
logo = "";
storeImage = "";
storeId: string;
mode: "create" | "update" = "create";
defaultRef = '/tabs/category';
discountType = discountType;
productImages: any[] = [];
productForm: any = this.formBuilder.group({
  status: [true, [Validators.required]],
  originalPrice: [1, [Validators.required]],
  discount: this.formBuilder.group({
    type: [],
    value: [0]
  }),
});

  sellingValue = 0;

barcodeValue = "1234567890";
  constructor(
    private modalController: ModalController,
    public platform: Platform,
    public service: ServiceService,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthServiceService,
    private location: Location,
    public navCtrl: NavController,
    public itemSubscribe: ItemSubscribeService
  ) {
    this.catalogId = this.route.snapshot.paramMap.get("catalogId");
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
      this.service.createStoreProduct(this.catalogId, this.productForm.value).subscribe(res => {
        this.ngxUiLoader.stopLoader("manage-loader");
        this.presentToast(MessageLib.STORE_CREATE_SUCCESS);
        this.itemSubscribe.publishData({catalogId: this.catalogId, unit: this.catalog.unit, ...res.data});
        this.navCtrl.back();
      }, error => {
        this.ngxUiLoader.stopLoader("manage-loader");
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      });
    }
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
        this.itemSubscribe.publishData({catalogId: this.catalogId, unit: this.catalog.unit, ...res.data});
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


  // eslint-disable-next-line @typescript-eslint/naming-convention
  async product_images() {
    const modal = await this.modalController.create({
      component: ProductImagePage,
      componentProps: {
        productName: this.catalog.name,
        brandName: this.catalog.brandName,
        image: this.catalog.image,
        media: this.catalog.media,
        sellingPrice: this.catalog.sellingPrice,
        subCategoryName: this.catalog.subCategoryName,
        unitValue: this.catalog.unitValue,
        unit: this.catalog.unit,
        offerUnit: this.catalog.offerUnit,
        quantity: this.catalog.myCart?.quantity,
      }
    });
  //   modal.onDidDismiss()
  //   .then((data) => {
  //     const dataInfo = data.data;
  //     if (dataInfo != null) {
  //       this.addToCart(dataInfo?.productId, dataInfo?.index);
  //     }
  // });
    return await modal.present();
  }










}
