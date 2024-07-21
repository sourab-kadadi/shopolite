import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { NgForm } from '@angular/forms';
import { LoadingController, AlertController, Platform, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../login-page/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageLib } from '../constants/system.const';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {

  isSubmitted = false;
  form: FormGroup;

  type = true;
  isLogin = false;





  // form = this.formBuilder.group({
  //   email: ['', [Validators.required, Validators.email]],
  //   psw: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,30}$')]],
  // });

  // isLoading = false;
  // isLogin = true;

  constructor(


    private ngxUiLoader: NgxUiLoaderService,
    public toastController: ToastController,


    private route: ActivatedRoute,


    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public alertController: AlertController
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email],
      }),
      psw: new FormControl(null, {
        updateOn: 'blur',
      validators: [Validators.required],
      }),
    });
  }


  changeType() {
    this.type = !this.type;
  }
  // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,30}$')

  // async presentToast(message: string) {
  //   const toast = await this.toastController.create({
  //     message: message,
  //     duration: 2000
  //   }),
  //   toast.present(),
  // }

  // get errorControl() {
  //   return this.form.controls;
  // }


  submitForm() {
    this.isSubmitted = true;
    this.ngxUiLoader.startLoader('loader-login');
    if (!this.form.valid) {
      this.presentAlert(MessageLib.FORM_VALIDATION_MESSAGE);
      return false;
    } else {

    this.authService.login(this.form.value).subscribe((res) => {
      // this.ngxUiLoader.stopLoader('loader-login');
        localStorage.setItem("token", JSON.stringify(res));
        const user = this.authService.jwtDecoder();
          if (user?.userType === 'ADMIN') {
            this.router.navigateByUrl('/home-page');};

    // this.presentToast(MessageLib.LOGIN_SUCCESS);
    },
    error => {
      this.ngxUiLoader.stopLoader('loader-login');
      // this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
      this.ngxUiLoader.stopLoader('loader-login');
      if (error.statusCode && error.statusCode === 401) {
        this.presentAlert('Unautherized, please enter valid email and password');
      } else {
        this.presentAlert(error.message || MessageLib.INTERNAL_SERVER_ERROR_ALERT);
      }
    });
  }
 }



   onForgotPassword(): void {

    this.router.navigate(['/login/forgot-password']);
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      message,
      cssClass: 'my-custom-class',
      translucent: true,
      buttons: ['OK']
    });
    await alert.present();
  }

}








  // authenticate(email: string, password: string) {
  //   this.isLoading = true;
  //   this.loadingCtrl
  //     .create({ keyboardClose: true, message: 'Logging in...' })
  //     .then(loadingEl => {
  //       loadingEl.present();
  //       let authObs: Observable<any>;
  //       if (this.isLogin) {
  //         authObs = this.authService.login(email, password);
  //       }
  //       // else {
  //       //   authObs = this.authService.signup(email, password);
  //       // }
  //       authObs.subscribe(
  //         resData => {
  //           console.log(resData);
  //           this.isLoading = false;
  //           loadingEl.dismiss();
  //           this.router.navigateByUrl('/folder/Dashboard');
  //         },
  //         errRes => {
  //           // loadingEl.dismiss();
  //           // const code = errRes.error.error.message;
  //           // let message = 'Could not sign you up, please try again.';
  //           // if (code === 'EMAIL_EXISTS') {
  //           //   message = 'This email address exists already!';
  //           // } else if (code === 'EMAIL_NOT_FOUND') {
  //           //   message = 'E-Mail address could not be found.';
  //           // } else if (code === 'INVALID_PASSWORD') {
  //           //   message = 'This password is not correct.';
  //           // }
  //           // this.showAlert(message);
  //         }
  //       );
  //     });
  // }



  // onSubmit(form: NgForm) {
  //   if (!form.valid) {
  //     return;
  //   }
  //   const email = form.value.email;
  //   const password = form.value.password;

  //   this.authenticate(email, password);
  //   form.reset();
  //   console.log(email, password);
  // }




  // private showAlert(message: string) {
  //   this.alertCtrl
  //     .create({
  //       header: 'Authentication failed',
  //       message: message,
  //       buttons: ['Okay']
  //     })
  //     .then(alertEl => alertEl.present());
  // }

