import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthserviceService } from '../services/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {

  constructor(private authService: AuthserviceService, private router: Router) { }
  canActivate() {
    const isLoggedIn = this.authService.isAdminLoggedIn();
    if (isLoggedIn) {
      return true;
    } else {
      return this.router.navigate(['/admin/login']);
    }
  }

}
