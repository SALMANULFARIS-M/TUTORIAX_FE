import { Injectable } from '@angular/core';
import { CanLoad, Router, Routes, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentLoadGuard implements CanLoad {

  constructor(private authService: AuthService,private router:Router) { }
  canLoad() {
    const isLoggedIn = this.authService.isStudentLoggedIn();
    if (isLoggedIn) {
      return  this.router.navigate(['/']);;
    } else {
      return true;
    }
  }
}
