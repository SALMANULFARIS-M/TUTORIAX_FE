import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from '@angular/common/http';

import { environment } from 'src/environments/environment.development';
import { AuthserviceService } from './services/authservice.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthserviceService) { }
  token!: string;

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    const isAdminRequest = request.url.includes("admin");
    const isTeacherRequest = request.url.includes("teacher");

    if (isAdminRequest) {
      this.token = "admin";
    } else if (isTeacherRequest) {
      this.token = "tutor";
    } else {
      this.token = "student";
    }

    let authService = this.authService.getToken(this.token);
    if (authService) {
      const headers = {
        Authorization: 'Bearer' + authService
      };
      let newRequest = request.clone({
        url: environment.backendApiUrl + request.url,
        setHeaders: headers
      })
      return next.handle(newRequest);
    } else {
      let newRequest = request.clone({
        url: environment.backendApiUrl + request.url
      })
      return next.handle(newRequest);
    }
  }
}
