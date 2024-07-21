import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../service/service/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {
  constructor(public auth: AuthServiceService, public router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      const token = await this.auth.jwtDecoder();
      console.log("Inside");
      if (token && token.userType == 'STORE') {
        this.router.navigate(['/tabs/category']);
        return false;
      } else {
        return true;

      }
    }
  
}
