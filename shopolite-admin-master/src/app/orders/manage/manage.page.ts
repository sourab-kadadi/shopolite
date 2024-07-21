import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
// eslint-disable-next-line max-len
import { IonInfiniteScroll, NavController, Platform, ToastController, IonSearchbar, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../../constants/system.const';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment.prod';
// import { AuthService } from '../../login/auth.service';
import { OrdersService } from './../service/orders.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.page.html',
  styleUrls: ['./manage.page.scss'],
})
export class ManagePage implements OnInit {
  orderId: any;
data: any;
  private filterTimeOut: any = null;
  viewType: string;
  viewTypeB: string;
  isDisabled = true;
  orderDetails: any;
  fabAction = true;
  s3path: any = environment.s3Url;
  origin: any;
  destination: any;
  isLoading = false;
  isActive = false;
  public streetViewControl = false;
  orderStatusToBeUpdatedTo: string;

  constructor(

    private router: Router,
    private loadingCtrl: LoadingController,
    public platform: Platform,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private ngxUiLoader: NgxUiLoaderService,
    // private uploadService: UploadService,
    public alertController: AlertController,
        private route: ActivatedRoute,
        private ordersService: OrdersService
  ) {
    this.orderId = this.route.snapshot.paramMap.get('order_id');
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

ionViewWillEnter() {
  this.getOrderbyId();
}

  async getOrderbyId() {
    this.isLoading = true;
    this.ordersService.getOrderDetailById(this.orderId).subscribe(
      (res) => {
        this.orderDetails = res.data;
        console.log(this.orderDetails?.storeDetails?.location?.coordinates[0]);
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
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }




  navigateToStore() {
    const storeLocation = `${this.orderDetails?.storeDetails?.location?.coordinates[0]},${this.orderDetails?.storeDetails?.location?.coordinates[1]}`
    const url = `https://www.google.com/maps/search/?api=1&query=${storeLocation}`;   
    window.open(url, '_blank');
  }

  navigateToCustomer() {
    const customerLocation = `${this.orderDetails?.address?.location?.coordinates[0]},${this.orderDetails?.address?.location?.coordinates[1]}`
    const url = `https://www.google.com/maps/search/?api=1&query=${customerLocation}`;   
    window.open(url, '_blank');
  }



  async askConfirmation(orderId: any, statusToBeUpdated: string) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure you want to proceed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'OK',
          handler: () => {
            this.updateOrderStatusByAdmin(orderId, statusToBeUpdated);
          },
        },
      ],
    });

    await alert.present();
  }



  
  updateOrderStatusByAdmin(orderId?: any, orderStatusToBeUpdated?: string ) {

console.log(orderStatusToBeUpdated)
      // if (this.coords && this.coords.length == 2) {
      //   store["location"] = {coordinates: this.coords};
      // } else {
      //   this.presentToast("Please Select Location");
      //   return;
      // }
      const orderStatusData = {orderStatus: orderStatusToBeUpdated}

      this.ngxUiLoader.startLoader("loader-orders-manage-page");
      this.ordersService.updateOrderStatusByAdmin(orderId, orderStatusData).subscribe(res => {
        this.ngxUiLoader.stopLoader("loader-orders-manage-page");
        this.presentToast("Order Updated Successfully");
        this.router.navigate(['/orders']);
      }, error => {
        this.ngxUiLoader.stopLoader("loader-orders-manage-page");
        // this.isLoading = false;
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      })
    }

    doRefresh(event: any) {
      this.getOrderbyId();
      setTimeout(() => {
        event.target.complete();
      }, 1000);
    }
  }

