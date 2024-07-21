import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageLib } from 'src/app/constants/system.const';
import { Clipboard } from '@capacitor/clipboard';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-coupon-details',
  templateUrl: './coupon-details.page.html',
  styleUrls: ['./coupon-details.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CouponDetailsPage implements OnInit {
  data: any;
  constructor(
    public toastController: ToastController,
  ) { }

  ngOnInit() {
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  async copyToClipBoard(data) {
    await Clipboard.write({
      string: data
    });
    this.presentToast(
      MessageLib.COPYIED_CLIPBOARD
    );
  }

}
