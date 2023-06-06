import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentServicesService } from "./services/student-services.service";
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private studentService: StudentServicesService) { }
  token!: string;

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    const commonUrl = "http://localhost:3001/"
    const isAdminRequest = request.url.includes("admin");
    const isTeacherRequest = request.url.includes("teacher");

    if (isAdminRequest) {
      this.token = "admin";
    } else if (isTeacherRequest) {
      this.token = "teacher";
    } else {
      this.token = "student";
    }

    let authService = this.studentService.getToken(this.token);
    if (authService) {
      const headers = {
        Authorization: 'Bearer' + authService
      };
      let newRequest = request.clone({
        url: commonUrl + request.url,
        setHeaders: headers
      })
      return next.handle(newRequest);
    } else {
      let newRequest = request.clone({
        url: commonUrl + request.url
      })
      return next.handle(newRequest);
    }
  }
}
