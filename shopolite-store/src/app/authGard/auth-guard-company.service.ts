import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthServiceService } from '../service/service/auth-service.service';
@Injectable()
export class AuthGuardCompanyService implements CanActivate {
  constructor(public auth: AuthServiceService, public router: Router) {}
  async canActivate(): Promise<boolean> {
    const token = await this.auth.jwtDecoder();
    console.log(token);
    if (!token || token == '' || token.userType != 'STORE') {
      this.router.navigate(['/phone-number']);
      return false;
    }
    return true;
  }
}