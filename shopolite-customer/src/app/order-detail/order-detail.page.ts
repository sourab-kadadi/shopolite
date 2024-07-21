import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ChatPage } from '../chat/chat.page';
import { MessageLib } from '../constants/system.const';
import { OrderDetailsService } from './service/order-details.service';
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {
  orderDetails: any;
  fabAction = true;
  orderId;
  s3path: any = environment.s3Url;
  origin: any;
  destination: any;
defaultImgStore = '../../../../assets/images/shop-default.png';
  isLoading = false;
  isActive = false;
serverError = false;
  public streetViewControl = false;
  isDisabled = true;
  thresholdDeliveryText: string;
  constructor(
    private router: Router,
    private modalController: ModalController,
    private orderDetailsService: OrderDetailsService,
    public toastController: ToastController,
    private route: ActivatedRoute,
  ) {
    this.orderId = this.route.snapshot.paramMap.get("order_Id");
    this.getMyOrderDetails(this.orderId);
  }
  public renderOptions = {
    suppressMarkers: true,
}

  public markerOptions: any = {
    origin: {
        icon:  {url: "assets/images/map_pin.png", scaledSize: {height: 50, width: 50} },

    },
    destination: {
        icon: {url: "assets/images/map_pin.png", scaledSize: {height: 50, width: 30} },
        infoWindow: `
        <h4>Hello<h4>
        <a href='http://www-e.ntust.edu.tw/home.php' target='_blank'>Taiwan Tech</a>
        `
    },
}

  ngOnInit() {}
  toggleFab() {
    this.fabAction = !this.fabAction;
  }
  chat() {
    this.modalController
      .create({ component: ChatPage })
      .then((modalElement) => {
        modalElement.present();
      });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  getMyOrderDetails(documentId: string) {
    this.isLoading = true;
    this.serverError = false;
    this.orderDetailsService.getMyOrderDetails(documentId).subscribe(
      (res) => {
        this.orderDetails = res.data;
        this.origin = { lat: res.data.storeDetails.location.coordinates[0], lng: res.data.storeDetails.location.coordinates[1] };
        this.destination = { lat: res.data.address.location.coordinates[0], lng: res.data.address.location.coordinates[1] };
        this.markerOptions.origin.icon.url = this.s3path + res.data.category.image.filePath;
        this.thresholdDeliveryTextTemplate(res.data?.isthresholdDeliveryKm,  res.data?.deliveryConfig?.thresholdDeliveryKm);
        this.isLoading = false;
        this.isActive = true;
      },
      (error) => {
        this.isLoading = false;
        this.isActive = false;
        // this.serverError = true;
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      }
    );
  }

  thresholdDeliveryTextTemplate(isthresholdDeliveryKm, thresholdDeliveryKm) {
    this.thresholdDeliveryText = isthresholdDeliveryKm
      ? `(upto ${thresholdDeliveryKm} km)`
      : thresholdDeliveryKm
      ? `(more than ${thresholdDeliveryKm} km)`
      : null;
  }

  onMapReady(map?: google.maps.Map ){
    if(map) {
      map.setOptions({
        streetViewControl: false,
      });
  }
  }

}
