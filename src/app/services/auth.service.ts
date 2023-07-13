import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { Auth, GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Observable, Observer } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  [x: string]: any;
  app: FirebaseApp;
  auth: Auth;
  storage: FirebaseStorage;
  Toast: any;
  constructor(private router: Router) {
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

  GoogleAuth() {
    const provider = new GoogleAuthProvider(); // Create an instance of GoogleAuthProvider
    return this.AuthLogin(provider)
      .then((res: any) => {
        return res.accessToken
      });
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return signInWithPopup(this.auth, provider)
      .then((result) => {
        return result.user
      })
      .catch((error) => {
        this.Toast.fire({
          icon: 'error',
          title: error
        })
      });
  }
  isAdminLoggedIn() {
    return !!localStorage.getItem('adminjwt')
  }

  isStudentLoggedIn() {
    return !!localStorage.getItem('studentjwt')
  }

  istutorLoggedIn() {
    return !!localStorage.getItem('tutorjwt')
  }

  //JWT Token taken from browser cokkiestorage
  getToken(token: string): any {
    if (token == "admin") {
      return localStorage.getItem('adminjwt')
    } else if (token == "tutor") {
      return localStorage.getItem('tutorjwt')
    } else if (token == 'student') {
      return localStorage.getItem('studentjwt')
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
      case 401:
        this.router.navigate(['/']);
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

  uploadImage(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const thumbnailRef = ref(this.storage, "Tutoriax/thumbnails/" + file.name);
      uploadBytes(thumbnailRef, file)
        .then(() => {
          getDownloadURL(thumbnailRef)
            .then((thumbnailURL) => {
              resolve(thumbnailURL);
            })
            .catch((error) => {
              this.handleError(error.status);
              reject(error);
            });
        })
        .catch((error) => {
          this.handleError(error.status);
          reject(error);
        });
    });
  }



}
