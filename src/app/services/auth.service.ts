import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Observer } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
  app: any;
  auth: any;
  storage: any;
  Toast: any;
  constructor(private cookieService: CookieService, private router: Router) {
    //firebase config
    this.app = initializeApp({
      apiKey: "AIzaSyBuDl_nSTpKOc6a_FzabCvQW2UtqnLuffE",
      authDomain: "e-mail-otp-verification.firebaseapp.com",
      projectId: "e-mail-otp-verification",
      storageBucket: "e-mail-otp-verification.appspot.com",
      messagingSenderId: "481187461752",
      appId: "1:481187461752:web:f8255469cf48b74e5d0b8d",
      measurementId: "G-DGKX0B9QDQ"
    });
    this.auth = getAuth(this.app);
    this.auth.languageCode = 'it';
    this.storage = getStorage(this.app)
    this.Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

  }

  isAdminLoggedIn() {
    return !!this.cookieService.get('adminjwt')
  }

  isStudentLoggedIn() {
    return !!this.cookieService.get('studentjwt')
  }

  istutorLoggedIn() {
    return !!this.cookieService.get('tutorjwt')
  }

  //JWT Token taken from browser cokkiestorage
  getToken(token: string) {
    if (token == "admin") {
      return this.cookieService.get('adminjwt')
    } else if ("tutor") {
      return this.cookieService.get('tutorjwt')
    } else {
      return this.cookieService.get('studentjwt')
    }
  }

  // Inside your response handling logic
  handleError(status: number) {
    switch (status) {
      case 400:
        this.router.navigate(['/400']);
        break;
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
        this.router.navigate(['/error']);
    }
  }

  getMessage() {
    const socket = io(environment.socketIO_Endpoint);
    return new Observable((observer: Observer<any>) => {
      socket.on('message recieved', (message: any) => {
        observer.next(message)
      })
    })
  }


}
