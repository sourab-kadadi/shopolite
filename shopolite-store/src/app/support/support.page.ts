import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

// import { IonicSelectableComponent } from 'ionic-selectable';
import { IonDatetime } from '@ionic/angular';
import { format, parseISO } from 'date-fns';

import { Subscription } from 'rxjs';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router} from '@angular/router';
import { MessageLib, ngXFgsType, ngXLoaderType, Role } from 'src/app/constants/system.const';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ServiceService } from './service/service.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  isSubmitted = true;
isLoading = false;

  modelForm: any = this.formBuilder.group({
    phoneNumberRes: [''],
    messageRes: ['', [Validators.required]],
 });




  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private service: ServiceService,
    public toastController: ToastController,
  ) {
  }

  ngOnInit() {
  }



  createSupport() {
    this.isSubmitted = true;
    this.isLoading =  true;
    this.service.createSupportTicket(this.modelForm.value).subscribe(res => {
       // this.ngxUiLoader.stopLoader("loader-03");
        this.isLoading = false;
        if(res.status === true) {
          this.modelForm.reset();
        }
        this.presentToast(res.message || MessageLib.SUPPORT_REQUEST_SUCCESS);
      }, error => {
        this.isLoading = false;
        // this.ngxUiLoader.stopLoader("loader-03");
        this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      });
    }

    async presentToast(message: string) {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000
      });
      toast.present();
    }


}
