import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }
  canActivate() {
    const isLoggedIn = this.authService.isAdminLoggedIn();
    if (isLoggedIn) {
      return true;
    } else {
      return this.router.navigate(['/admin/login']);
    }
  }

}
