import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthserviceService } from '../services/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class StudentGuardGuard implements CanActivate {
  constructor(private authService: AuthserviceService, private router: Router) { }
  canActivate() {
    const isLoggedIn = this.authService.isStudentLoggedIn();
    if (isLoggedIn) {
      return true;
    } else {
      return this.router.navigate(['/']);
    }
  }

}
