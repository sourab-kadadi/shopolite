import { Component, OnDestroy, OnInit, ViewChild, AfterContentChecked, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
// import { SwiperCore } from 'swiper/core';
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
  EffectCube,
  EffectFlip
} from 'swiper';

SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
  EffectCube,
  EffectFlip
]);
@Component({
  selector: 'app-variation-selection',
  templateUrl: './variation-selection.page.html',
  styleUrls: ['./variation-selection.page.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class VariationSelectionPage implements OnInit, AfterContentChecked {
  @ViewChild('swiper') swiper: SwiperComponent;

  config: SwiperOptions = {
    slidesPerView: 'auto',
    // effect: 'cube',
    spaceBetween: 30,
    pagination: true,
    // pagination: {
    //   clickable: true
    // },
    loop: true,
    zoom: true,
    autoplay: {
      delay: 200
    },
    navigation: true,
    // lazy: true

  };



  
  id: any;
  productName: any;
  brandName: any;
  image: any;
  media: any;
  sellingPrice: any;
  sku: any;
  subCategoryName: any;
  unitValue: any;
  unit: any;
  index: any;
  quantity: any;
  s3path: any = environment.s3Url;
  isAvailable: any = false;
  images: any[] = [];
  allProductImages: any[] = [];
  constructor(private modalController: ModalController) { }

  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  ngOnInit() {
    this.images = [this.image].concat(this.media);
  }


  onAdd() {
    const data: any = { productId: this.id, index: this.index };
    this.modalController.dismiss(data);
  }

  dismiss() {
    // const data: any = {productId: this.id, index: this.index};
    const data = null;
    this.modalController.dismiss(data);
  }


}
