import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageLib } from '../constants/system.const';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  userProfile : any = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNo: [''],
  });

  constructor(
    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,
    public formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private service: RegisterService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.getAddress();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  updateUserProfile() {
    this.ngxUiLoader.startLoader("loader-03");
    let user = this.userProfile.value;
    delete user.phoneNo;
    this.service.updateProfile(user).subscribe(res => {
      this.ngxUiLoader.stopLoader("loader-03");
      this.router.navigate(['/my-account']);
      this.presentToast(MessageLib.PROFILE_UPDATED);
    }, error => {
      this.ngxUiLoader.stopLoader("loader-03");
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    })
  }

  getAddress() {
    this.service.getMyProfile().subscribe(res => {
      this.userProfile.patchValue(res.data);
    }, error => {
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    })
  }
}
