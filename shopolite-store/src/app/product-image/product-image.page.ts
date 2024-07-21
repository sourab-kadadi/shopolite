import { Component, OnDestroy, OnInit, ViewChild, AfterContentChecked, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
// import { SwiperCore } from 'swiper/core';
import SwiperCore , {
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
  selector: 'app-product-image',
  templateUrl: './product-image.page.html',
  styleUrls: ['./product-image.page.scss'],
// encapsulation: ViewEncapsulation.Emulated
})
export class ProductImagePage implements OnInit, AfterContentChecked {

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

  productName: any;
  brandName: any;
  image: any;
  media: any;
  unitValue: any;
  unit: any;
offerUnit: any;

  s3path: any = environment.s3Url;

  images: any[]=[];

  constructor(private modalController: ModalController) { }
  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  ngOnInit() {
    this.images = [this.image].concat(this.media);
    console.log(this.images);
  }


 dismiss(){
  // const data: any = {productId: this.id, index: this.index};
  const data = null;
    this.modalController.dismiss(data);
  }


}
