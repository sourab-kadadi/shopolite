/////this file is not in use



import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
// import { Strings } from '../constants/system.const';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    // private alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router) {}

    // async canActivate(
    //   route: ActivatedRouteSnapshot,
    //   state: RouterStateSnapshot): Promise<boolean> {
    //     const token = await this.authService.jwtDecoder();
    //     if (token && token.userType === 'ADMIN') {
    //       this.router.navigate(['/home-page']);
    //       return false;
    //     } else {
    //       return true;

    //     }
    //   }
    canActivate(): boolean {
      const token = this.authService.jwtDecoder();
      console.log(token);
    if (!token || token === '' || token.userType !== 'ADMIN') {
      this.router.navigate(['/login-page']);
      return false;
    }
    return true;
  }

      // async canActivate(
      //   route: ActivatedRouteSnapshot,
      //   state: RouterStateSnapshot
      // ): Promise<boolean> {
      //   const token = await this.authService.jwtDecoder();
      //   // return (
      //   //   (user.userType === 'ADMIN' && this.router.parseUrl('/home-page'))
      //   // );
      //           if (token && token.userType === 'ADMIN') {
      //     this.router.navigate(['/home-page']);
      //     return false;
      //   } else {
      //     return true;

      // }





}

