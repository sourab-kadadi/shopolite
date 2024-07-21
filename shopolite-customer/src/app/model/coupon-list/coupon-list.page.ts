import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-coupon-list',
  templateUrl: './coupon-list.page.html',
  styleUrls: ['./coupon-list.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CouponListPage implements OnInit {
  couponList: any[] = [];
  constructor(private modalController: ModalController) { }


  ngOnInit() {
  }


  dismiss(code) {
    this.modalController.dismiss(code || null);
  }

}
