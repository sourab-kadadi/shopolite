import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { MessageLib } from 'src/app/constants/system.const';
import { BarcodeServiceService } from './service/barcode-service.service';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.page.html',
  styleUrls: ['./barcode-scanner.page.scss'],
})
export class BarcodeScannerPage implements OnInit {

  scanActive = false;
  result;
  barcodeType: any = '';
  constructor(
    private alertCtrl: AlertController,
    private service: BarcodeServiceService,
    private router: Router,
    private route: ActivatedRoute,
    public toastController: ToastController,
    private modalController: ModalController,
    ) {
     this.barcodeType = route.snapshot.data.type;
     }

  ngOnInit() {
  }

  ionViewDidLeave() {
    this.stopScanner();
}
  ionViewDidEnter() {
    this.result = null;
    BarcodeScanner.prepare();
    this.startScan();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  async startScan() {
    BarcodeScanner.hideBackground(); // make background of WebView transparent
    const allowed = await this.checkPermission();
    if (allowed) {
      this.scanActive = true;
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    if (result.hasContent) {
      console.log(result.content); // log the raw scanned content
      this.result = result.content;
      this.enteredBarcode();
    }
  }
  };


  enteredBarcode() {
    if (this.barcodeType == "PRODUCT") {
    this.getCatalogIdByBarcode(this.result);
    } else {
      this.dismiss(this.result);
    }
  }

  getCatalogIdByBarcode(barcode) {
    this.service.getCatlaogIdByBarCode(barcode).subscribe( res => {
      this.scanActive = false;
      this.router.navigate(['/edit-product', res.data._id])
    }, error => {
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      this.startScan();
    })
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({force: true});
      if (status.granted) {
        resolve(true);
      } else if(status.denied) {
        const alert = await this.alertCtrl.create({
          header: 'No Permission',
          message: 'Please allow camara access in your setting',
          buttons: [{
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Open Settings',
            handler: () => {
              resolve(false);
              BarcodeScanner.openAppSettings();
            }
          }
        ]
        })
      } else  {
        resolve(false);
      }
    })

  }


  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ngonDestroy() {
    this.stopScanner();
  }

  dismiss(data: any)  {
    this.modalController.dismiss(data);
  }
}
