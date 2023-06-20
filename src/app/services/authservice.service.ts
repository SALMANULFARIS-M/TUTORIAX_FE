import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private cookieService: CookieService,private router:Router ) { }

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

// Inside your response handling logic
handleError(status: number) {
  switch (status) {
    case 404:
      this.router.navigate(['/404']);
      break;
    case 500:
      this.router.navigate(['/500']);
      break;
    case 502:
      this.router.navigate(['/502']);
      break;
    default:
      // Handle other error statuses or display a generic error message
  }
}

}
