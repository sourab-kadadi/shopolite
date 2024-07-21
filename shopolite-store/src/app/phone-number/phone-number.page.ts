import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageLib, ngXFgsType, ngXLoaderType } from '../constants/system.const';
import { ServiceService } from './service/service.service';
@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.page.html',
  styleUrls: ['./phone-number.page.scss'],
})
export class PhoneNumberPage implements OnInit {

  isSubmitted: boolean = false;
  public loaderType: string = ngXLoaderType;
  spinner = ngXFgsType;
  loginForm: any = this.formBuilder.group({
    phoneNo: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
  });

  constructor(
    public platform: Platform,
    public service: ServiceService,
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      this.presentToast(MessageLib.FORM_VALIDATION_MESSAGE);
      return false;
    } else {
      this.ngxUiLoader.startLoader("loader-03");
      this.service.requestOtp(this.loginForm.value).subscribe(res => {
        this.ngxUiLoader.stopLoader("loader-03");
        this.router.navigate(["./verification", res.data.otpKey]);
        this.presentToast(MessageLib.OTP_SENT_SUCCESS);
      }, error => {
        if (error.status && error.status === 404) {
        this.router.navigate(["./register"]);
        } else {
          this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
        }
        this.ngxUiLoader.stopLoader("loader-03");
      })
    }
  }
}
