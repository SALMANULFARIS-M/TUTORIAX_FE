import { Injectable } from '@angular/core';
import { CanLoad, Router, Routes, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthserviceService } from '../services/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class StudentLoadGuard implements CanLoad {

  constructor(private authService: AuthserviceService,private router:Router) { }
  canLoad() {
    const isLoggedIn = this.authService.isStudentLoggedIn();
    if (isLoggedIn) {
      return false;
    } else {
      return true;
    }
  }
}
