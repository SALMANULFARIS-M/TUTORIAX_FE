import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private cookieService: CookieService) { }

  isAdminLoggedIn() {
    return !!this.cookieService.get('adminjwt')
  }

  isStudentLoggedIn() {
    return !!this.cookieService.get('studentjwt')
  }

  istutorLoggedIn() {
    return !!this.cookieService.get('instructorjwt')
  }

  //JWT Token taken from browser cokkiestorage
  getToken(token: string) {
    if (token == "admin") {
      return this.cookieService.get('adminjwt')
    } else if ("intructor") {
      return this.cookieService.get('instructorjwt')
    } else {
      return this.cookieService.get('studentjwt')
    }
  }

}
