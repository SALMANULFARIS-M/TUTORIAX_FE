import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthserviceService } from '../services/authservice.service';

@Injectable({
  providedIn: 'root'
})
export class AdminLoadGuard implements CanLoad {
  constructor(private authService: AuthserviceService) { }
  canLoad() {
    const isLoggedIn = this.authService.isStudentLoggedIn();
    if (isLoggedIn) {
      return false;
    } else {
      return true;
    }
  }
}
