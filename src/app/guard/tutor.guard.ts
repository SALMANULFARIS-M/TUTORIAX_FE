import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TutorGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate() {
    const isLoggedIn = this.authService.istutorLoggedIn();
    if (isLoggedIn) {
      return true;
    } else {
      return this.router.navigate(['/tutor/login']);
    }
  }

}
