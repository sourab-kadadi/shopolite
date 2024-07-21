import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ChatCustomerPage } from '../chat-customer/chat-customer.page';
import { MessageLib } from '../constants/system.const';
import { OrderDetailsService } from './service/order-details.service';
@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.page.html',
  styleUrls: ['./order-info.page.scss'],
})
export class OrderInfoPage implements OnInit {
  viewType: string;
  viewTypeB: string;
  isDisabled = true;
  orderDetails: any;
  fabAction = true;
  orderId;
  s3path: any = environment.s3Url;
  origin: any;
  destination: any;
  isLoading = false;
  isActive = false;
  public streetViewControl = false;
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
        icon:  {url: "assets/images/map_pin.png", scaledSize: {height: 50, width: 30} },
    },
    destination: {
        icon: {url: "assets/images/map_pin.png", scaledSize: {height: 50, width: 50} },
        infoWindow: `
        <h4>Hello<h4>
        <a href='http://www-e.ntust.edu.tw/home.php' target='_blank'>Taiwan Tech</a>
        `
    },

}


  ngOnInit() {
  }
  setViewType(vt) {
    this.viewType = vt;
  }
  setViewTypeB(vt) {
    this.viewTypeB = vt;
  }

// chat_customer(){
//     this.modalController.create({component:ChatCustomerPage}).then((modalElement)=>
//     {
//       modalElement.present();
//     }
//     )
//   }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  getMyOrderDetails(documentId: string) {
    this.isLoading = true;
    this.orderDetailsService.getMyOrderDetails(documentId).subscribe(
      (res) => {
        this.orderDetails = res.data;
        console.log(this.orderDetails);
        this.origin = { lat: res.data.storeDetails.location.coordinates[0], lng: res.data.storeDetails.location.coordinates[1] };
        this.destination = { lat: res.data.address.location.coordinates[0], lng: res.data.address.location.coordinates[1] };
        this.markerOptions.destination.icon.url = this.s3path + res.data.category.image.filePath;
        this.isLoading = false;
        this.isActive = true;
      },(error) => {
        this.isLoading = false;
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      }
    );
  }







  readytoDeliver(documentId: string) {
    this.orderDetailsService.readyToDeliver(documentId).subscribe(
      (res) => {
        this.getMyOrderDetails(documentId);
        this.presentToast( MessageLib.READY_TO_DELIVERED);
      },
      (error) => {
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      }
    );
  }

  delivered(documentId: string) {
    this.orderDetailsService.delivered(documentId).subscribe(
      (res) => {
        this.getMyOrderDetails(documentId);
        this.presentToast( MessageLib.DELIVERED);
      },
      (error) => {
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      }
    );
  }

  accept(documentId: string) {
    this.orderDetailsService.accept(documentId).subscribe(
      (res) => {
        this.getMyOrderDetails(documentId);
        this.presentToast( MessageLib.ACCEPT);
      },
      (error) => {
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      }
    );
  }

  reject(documentId: string) {
    this.orderDetailsService.reject(documentId).subscribe(
      (res) => {
        this.getMyOrderDetails(documentId);
        this.presentToast( MessageLib.REJECT);
      },
      (error) => {
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      }
    );
  }

  onMapReady(map?: google.maps.Map ){
    if(map) {
      map.setOptions({
        streetViewControl: false,
        zoom: 35,
      });
  }
  }
}
