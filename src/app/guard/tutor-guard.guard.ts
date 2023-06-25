import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthserviceService } from '../services/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class TutorGuardGuard implements CanActivate {
  constructor(private authService: AuthserviceService, private router: Router) { }
  canActivate() {
    const isLoggedIn = this.authService.istutorLoggedIn();
    if (isLoggedIn) {
      return true;
    } else {
      return this.router.navigate(['/tutor/login']);
    }
  }

}
